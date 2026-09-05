/**
 * Master Decision Engine
 * Orchestrates all financial rules and returns a comprehensive, fully explainable DecisionResult.
 * 100% attribute-driven; no hardcoded personas.
 */

import { BorrowerProfile, DecisionResult, LoanType, PrimaryVerdict } from '../types/borrower';
import { LOAN_PRODUCTS } from '../data/loanProducts';
import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';
import { evaluateRecognizedIncome } from './income';
import { evaluateAffordability } from './affordability';
import { evaluateFairRate } from './rate';
import { calculateAllInApr } from '../calculations/aprCalculator';
import { evaluateLoanCapacity } from '../calculations/loanCapacity';
import { generateTenureOptions } from '../calculations/emi';
import { runStressScenarios } from './stressTest';
import { evaluateConfidence } from './confidence';

export function evaluateBorrower(profile: BorrowerProfile): DecisionResult {
  // 1. ATTRIBUTE-DRIVEN PRODUCT ROUTING CHECK
  // If self-employed borrower has substantial unencumbered property and requested unsecured business loan, recommend comparing secured LAP
  let activeLoanType: LoanType = profile.loanType;
  let isProductRouted = false;
  let productRoutingReason = '';

  if (
    profile.incomeType === 'self_employed' &&
    profile.loanType === 'business_unsecured' &&
    profile.collateralType === 'property_residential_commercial' &&
    profile.collateralValue &&
    profile.collateralValue >= 1500000 &&
    !profile.collateralEncumbered
  ) {
    activeLoanType = 'lap_secured';
    isProductRouted = true;
    productRoutingReason = `You hold ₹${(profile.collateralValue / 100000).toFixed(0)} Lakhs of unencumbered property. Comparing a Secured LAP / MSME route can lower interest rates from ~20% down to ~10%, significantly reducing monthly outflow.`;
  }

  // 2. INCOME RECOGNITION (Individual vs Household/Co-applicant)
  const incomeEval = evaluateRecognizedIncome(profile);

  // 3. AFFORDABILITY & EMI CEILING (Dual constraints: FOIR + Residual Cash)
  const affordEval = evaluateAffordability(
    profile,
    incomeEval.borrowerIndividualIncome,
    incomeEval.effectiveHouseholdIncome
  );

  // 4. FAIR RATE & APR EVALUATION (Explainable rate chain)
  const rateEval = evaluateFairRate(profile, activeLoanType);
  const aprLowBreakdown = calculateAllInApr(
    profile.requestedAmount,
    rateEval.fairRateLow,
    36,
    rateEval.standardProcessingFeePercent
  );
  const aprHighBreakdown = calculateAllInApr(
    profile.requestedAmount,
    rateEval.fairRateHigh,
    36,
    rateEval.standardProcessingFeePercent
  );

  // 5. LOAN CAPACITY (Lender Capacity vs Safe Borrower Amount)
  const capacityEval = evaluateLoanCapacity(
    { ...profile, loanType: activeLoanType },
    incomeEval.effectiveHouseholdIncome,
    affordEval.safeNewEmiCeiling,
    rateEval.fairRateMidpoint
  );

  // 6. MULTI-TENURE SCHEDULES
  const tenureOptions = generateTenureOptions(
    Math.min(profile.requestedAmount, capacityEval.safeBorrowerAmountMax || profile.requestedAmount),
    rateEval.fairRateMidpoint,
    capacityEval.safeRecommendedTenureMonths
  );

  // 7. STRESS TESTING (Dual scenarios: Income -20% and Rate +200 bps)
  const stressScenarios = runStressScenarios(
    profile,
    incomeEval.effectiveHouseholdIncome,
    affordEval.safeNewEmiCeiling,
    rateEval.fairRateMidpoint
  );

  // 8. MODEL CONFIDENCE
  const confEval = evaluateConfidence(profile);

  // 9. PRIMARY VERDICT LOGIC (Attribute-driven multi-factor evaluation)
  let verdict: PrimaryVerdict = 'BORROW';
  let verdictTitle = 'Borrowing Appears Manageable';
  let verdictSummary = '';
  const verdictRationale: string[] = [];

  // Multi-Factor Risk Trigger 1: High-cost debt + recent missed payment / delinquency / thin cash buffer
  const hasHighCostDebt = profile.hasHighCostDebt || (profile.highCostDebtOutstanding && profile.highCostDebtOutstanding > 0);
  const hasRecentPaymentStrain = profile.recentPaymentIssue === 'recent_bounce_or_default';
  const hasThinSafetyBuffer = (profile.emergencySavingsMonths === 0 || profile.emergencySavingsMonths === null) &&
    profile.incomeStability === 'unpredictable';
  
  const isHighRiskDistress = (hasHighCostDebt && (hasRecentPaymentStrain || hasThinSafetyBuffer || affordEval.isDebtBurdenCritical)) ||
    affordEval.residualCashAfterExpenses <= 0;

  if (isHighRiskDistress) {
    verdict = 'DONT_BORROW';
    verdictTitle = "Don't borrow right now / Stabilize existing debt first";
    verdictSummary = 'Your existing high-cost obligations and recent repayment indicators suggest that taking on new debt carries significant financial risk.';
    
    if (hasHighCostDebt) {
      verdictRationale.push('You carry active high-cost borrowing (>24% APR). Adding new debt before resolving this risks compounding your debt burden.');
    }
    if (hasRecentPaymentStrain) {
      verdictRationale.push('A recent missed or bounced payment indicates existing repayment strain.');
    }
    if (affordEval.residualCashAfterExpenses <= 0) {
      verdictRationale.push(`Your essential living and rent expenses (₹${affordEval.totalEssentialHouseholdExpenses.toLocaleString('en-IN')}) leave insufficient cash buffer for additional EMIs.`);
    }
    verdictRationale.push('Recommended action: Prioritize clearing or restructuring existing high-cost debt before taking on new principal.');
  } else if (isProductRouted) {
    verdict = 'CHANGE_PRODUCT_FIRST';
    verdictTitle = 'Compare a Secured LAP Route First';
    verdictSummary = 'Before taking high-cost unsecured business credit, evaluate securing the loan against your unencumbered property to achieve lower interest and manageable tenures.';
    verdictRationale.push(productRoutingReason);
    verdictRationale.push('Pledging unencumbered property provides stronger pricing eligibility and longer repayment terms.');
  } else if (profile.requestedAmount > capacityEval.safeBorrowerAmountMax * 1.20 && capacityEval.safeBorrowerAmountMax > 0) {
    verdict = 'BORROW_LESS';
    verdictTitle = 'Consider Borrowing Less Than Requested';
    verdictSummary = `Your requested amount of ₹${(profile.requestedAmount / 100000).toFixed(1)} Lakhs exceeds the safer estimated capacity of ₹${(capacityEval.safeBorrowerAmountMax / 100000).toFixed(1)} Lakhs.`;
    verdictRationale.push(`Borrowing ₹${(profile.requestedAmount / 100000).toFixed(1)} Lakhs would increase your monthly debt burden beyond comfortable limits.`);
    verdictRationale.push(`Capping borrowing closer to ₹${(capacityEval.safeBorrowerAmountMax / 100000).toFixed(1)} Lakhs keeps monthly payments under your safe EMI ceiling of ₹${affordEval.safeNewEmiCeiling.toLocaleString('en-IN')}.`);
  } else {
    verdict = 'BORROW';
    verdictTitle = 'Borrowing Appears Manageable';
    verdictSummary = `Based on the numbers you entered, borrowing ₹${(profile.requestedAmount / 100000).toFixed(1)} Lakhs appears affordable within your cash flow.`;
    verdictRationale.push(`Proposed EMI remains within the estimated ${affordEval.maxPermissibleFoirPercent}% monthly debt burden threshold.`);
    verdictRationale.push(`Your cash flow retains an estimated monthly living cushion of ₹${affordEval.residualCashAfterExpenses.toLocaleString('en-IN')} after essential expenses.`);
    
    // Consumption loan nuance
    if (profile.loanPurpose === 'wedding' || profile.loanPurpose === 'consumption_lifestyle') {
      verdictRationale.push('Because this is consumption borrowing that generates no future cash flow, we recommend keeping tenure capped (36–48 months) to limit total interest cost.');
    }
  }

  // 10. NEGOTIATION POINTS GENERATOR
  const negotiationPoints: DecisionResult['negotiationPoints'] = [];

  if (profile.creditScoreTier === 'prime_750_plus') {
    negotiationPoints.push({
      title: 'Leverage Prime Credit Score (750+)',
      description: `With a credit score of ${profile.creditScoreExact || '750+'}, request Tier-1 pricing within the ${rateEval.fairRateLow}% – ${rateEval.fairRateHigh}% range.`,
      category: 'STRENGTH',
    });
  }

  if (profile.incomeType === 'salaried' && profile.incomeStability === 'highly_stable') {
    negotiationPoints.push({
      title: 'Salaried Income Stability',
      description: 'Stable employment history supports competitive pricing. Ask for lower processing fees and zero pre-payment penalties.',
      category: 'STRENGTH',
    });
  }

  if (isProductRouted || activeLoanType === 'lap_secured') {
    negotiationPoints.push({
      title: 'Offer Unencumbered Property as Security',
      description: 'Inquire about MSME / LAP secured loan products at 9.0% – 11.5% with longer repayment schedules instead of unsecured business loans.',
      category: 'STRENGTH',
    });
  }

  negotiationPoints.push({
    title: 'Cap Upfront Processing Fees',
    description: `Negotiate processing fees to ${rateEval.standardProcessingFeePercent}% or lower, saving upfront charges on disbursal.`,
    category: 'TACTICAL_QUESTION',
  });

  negotiationPoints.push({
    title: 'Request Full Key Fact Statement (KFS)',
    description: 'Ask for the written Key Fact Statement under RBI Digital Lending guidelines showing the complete all-in APR including all fees and taxes.',
    category: 'TACTICAL_QUESTION',
  });

  // 11. EXISTING OFFER COMPARISON (if provided)
  let offerComparison: DecisionResult['offerComparison'];
  if (profile.hasExistingOffer && profile.offeredInterestRate && profile.offeredInterestRate > 0) {
    const diffBps = Math.round((profile.offeredInterestRate - rateEval.fairRateMidpoint) * 100);
    const isPredatory = profile.offeredInterestRate > 24 || diffBps > 400;
    const isHigh = diffBps > 150;

    let offerVerdictText = '';
    let offerVerdict: 'FAIR' | 'HIGH' | 'PREDATORY' = 'FAIR';

    if (isPredatory) {
      offerVerdict = 'PREDATORY';
      offerVerdictText = `Your quote of ${profile.offeredInterestRate}% carries an unusually high spread compared to the estimated fair range of ${rateEval.fairRateLow}% – ${rateEval.fairRateHigh}%.`;
    } else if (isHigh) {
      offerVerdict = 'HIGH';
      offerVerdictText = `Your quote of ${profile.offeredInterestRate}% is approximately ${Math.abs(diffBps / 100).toFixed(1)}% above the estimated fair benchmark for your profile.`;
    } else {
      offerVerdict = 'FAIR';
      offerVerdictText = `Your quote of ${profile.offeredInterestRate}% is in line with the estimated fair benchmark range.`;
    }

    const potentialSavingsTotal = Math.max(
      0,
      Math.round(((profile.offeredInterestRate - rateEval.fairRateLow) / 100) * profile.requestedAmount * 2.5)
    );

    offerComparison = {
      offeredRate: profile.offeredInterestRate,
      fairRateMidpoint: rateEval.fairRateMidpoint,
      differenceBps: diffBps,
      verdict: offerVerdict,
      verdictText: offerVerdictText,
      potentialSavingsTotal,
    };
  }

  const recommendedProductLabel = LOAN_PRODUCTS[activeLoanType]?.title || 'Standard Retail Loan';

  return {
    verdict,
    verdictTitle,
    verdictSummary,
    verdictRationale,

    borrowerIndividualIncome: incomeEval.borrowerIndividualIncome,
    householdIncomeConsidered: incomeEval.effectiveHouseholdIncome,
    hasCoApplicantIncome: incomeEval.hasCoApplicantIncome,
    coApplicantIncomeAmount: incomeEval.coApplicantIncome,

    likelyLenderSanctionMin: capacityEval.lenderSanctionMin,
    likelyLenderSanctionMax: capacityEval.lenderSanctionMax,
    likelyLenderSanctionReason: capacityEval.lenderReason,

    safeBorrowerAmountMin: capacityEval.safeBorrowerAmountMin,
    safeBorrowerAmountMax: capacityEval.safeBorrowerAmountMax,
    safeBorrowerAmountReason: capacityEval.safeReason,
    amountRecommendation: verdict === 'DONT_BORROW' ? 'RESTRUCTURE_FIRST' : (profile.requestedAmount > capacityEval.safeBorrowerAmountMax ? 'CAP_TO_PURPOSE' : 'USE_SAFE_AMOUNT'),

    fairRateLow: rateEval.fairRateLow,
    fairRateHigh: rateEval.fairRateHigh,
    fairRateBenchmarkReason: rateEval.rateRationale,

    estimatedAprLow: aprLowBreakdown.allInAprPercent,
    estimatedAprHigh: aprHighBreakdown.allInAprPercent,
    aprComponentsReason: `Estimated APR incorporates a ~${rateEval.standardProcessingFeePercent}% processing fee + 18% GST amortized over 36 months.`,
    standardProcessingFeePercent: rateEval.standardProcessingFeePercent,

    safeEmiCeiling: affordEval.safeNewEmiCeiling,
    emiCeilingReason: affordEval.affordabilityReason,
    currentRecognizedIncome: incomeEval.effectiveHouseholdIncome,
    totalEssentialHouseholdExpenses: affordEval.totalEssentialHouseholdExpenses,
    currentFoirPercent: affordEval.currentFoirPercent,
    projectedFoirPercent: affordEval.maxPermissibleFoirPercent,
    maxPermissibleFoirPercent: affordEval.maxPermissibleFoirPercent,
    residualMonthlyCash: affordEval.residualCashAfterExpenses,

    tenureOptions,
    stressScenarios,

    recommendedProduct: activeLoanType,
    recommendedProductLabel,
    productRoutingReason: isProductRouted ? productRoutingReason : undefined,
    isProductRouted,

    confidence: confEval.level,
    confidenceScore: confEval.score,
    confidenceReasons: confEval.reasons,
    uncertaintyDisclosures: confEval.uncertaintyDisclosures,

    negotiationPoints,
    offerComparison,
  };
}
