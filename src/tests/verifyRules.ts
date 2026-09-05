/**
 * Verification Test Runner for Financial Rules & Personas
 * Run via: npm run test:rules
 */

import { TEST_PERSONAS } from '../data/personas';
import { evaluateBorrower } from '../rules/decision';
import { formatINR } from '../utils/currency';

console.log('====================================================');
console.log('🧪 RUNNING BORROWER COPILOT FINANCIAL ENGINE TESTS');
console.log('====================================================\n');

for (const persona of TEST_PERSONAS) {
  console.log(`\n----------------------------------------------------`);
  console.log(`👤 Testing Persona: ${persona.name} (${persona.personaType.toUpperCase()})`);
  console.log(`   ${persona.tagline}`);
  console.log(`   Requested: ${formatINR(persona.profile.requestedAmount)} for ${persona.profile.loanPurpose}`);
  console.log(`----------------------------------------------------`);

  const decision = evaluateBorrower(persona.profile);

  console.log(`O1: VERDICT -> [${decision.verdict}] - ${decision.verdictTitle}`);
  console.log(`    Summary: ${decision.verdictSummary}`);
  
  console.log(`\nINCOME ACCOUNTING:`);
  console.log(`    Borrower Individual: ${formatINR(decision.borrowerIndividualIncome)}/mo`);
  if (decision.hasCoApplicantIncome) {
    console.log(`    Joint Household:     ${formatINR(decision.householdIncomeConsidered)}/mo (incl. ${formatINR(decision.coApplicantIncomeAmount)} co-applicant)`);
  }
  console.log(`    Total Essential:     ${formatINR(decision.totalEssentialHouseholdExpenses)}/mo`);
  console.log(`    Residual Cash:       ${formatINR(decision.residualMonthlyCash)}/mo`);

  console.log(`\nO2: AMOUNTS`);
  console.log(`    Lender Capacity: ${formatINR(decision.likelyLenderSanctionMin)} – ${formatINR(decision.likelyLenderSanctionMax)}`);
  console.log(`    Safe Capacity:   ${formatINR(decision.safeBorrowerAmountMin)} – ${formatINR(decision.safeBorrowerAmountMax)}`);
  console.log(`    Reason:          ${decision.safeBorrowerAmountReason}`);

  console.log(`\nO3: FAIR RATE & APR`);
  console.log(`    Fair Rate Band:  ${decision.fairRateLow}% – ${decision.fairRateHigh}%`);
  console.log(`    All-in APR Band: ${decision.estimatedAprLow}% – ${decision.estimatedAprHigh}%`);
  console.log(`    Reason:          ${decision.fairRateBenchmarkReason}`);

  console.log(`\nO4: EMI CEILING & STRESS`);
  console.log(`    Safe EMI Ceiling: ${formatINR(decision.safeEmiCeiling)}/month`);
  console.log(`    Affordability:    ${decision.emiCeilingReason}`);
  console.log(`    Stress 1 (Income): ${decision.stressScenarios[0].impactVerdict} -> ${decision.stressScenarios[0].impactExplanation}`);
  console.log(`    Stress 2 (Rate):   ${decision.stressScenarios[1].impactVerdict} -> ${decision.stressScenarios[1].impactExplanation}`);

  console.log(`\nCONFIDENCE: [${decision.confidence}] (Score: ${decision.confidenceScore}/100)`);
  if (decision.uncertaintyDisclosures.length > 0) {
    console.log(`    Disclosures: ${decision.uncertaintyDisclosures.join(' | ')}`);
  }

  if (decision.productRoutingReason) {
    console.log(`\nPRODUCT GUIDANCE: -> Recommended [${decision.recommendedProductLabel}]`);
    console.log(`    Reason: ${decision.productRoutingReason}`);
  }

  if (decision.offerComparison) {
    console.log(`\nOFFER COMPARISON: -> [${decision.offerComparison.verdict}] Quote`);
    console.log(`    Lender: ${decision.offerComparison.offeredRate}% vs Fair Midpoint: ${decision.offerComparison.fairRateMidpoint}% (Gap: +${decision.offerComparison.differenceBps} bps)`);
    console.log(`    Potential Savings: ${formatINR(decision.offerComparison.potentialSavingsTotal)}`);
  }

  console.log(`\nNEGOTIATION POINTS (${decision.negotiationPoints.length} points generated):`);
  decision.negotiationPoints.forEach((pt, i) => {
    console.log(`    ${i + 1}. [${pt.category}] ${pt.title}`);
  });
}

console.log('\n====================================================');
console.log('✅ ALL TEST FIXTURES EVALUATED SUCCESSFULLY!');
console.log('====================================================');
