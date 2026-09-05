/**
 * Stress Testing Engine
 * Evaluates how the borrower's affordability holds up under adverse modelling conditions:
 * 1. Income Shock (-20% take-home reduction)
 * 2. Rate Shock (+200 bps floating interest rate hike)
 */

import { BorrowerProfile, StressScenarioResult } from '../types/borrower';
import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';

export function runStressScenarios(
  profile: BorrowerProfile,
  recognizedIncome: number,
  safeEmiCeiling: number,
  baseRateMidpoint: number
): StressScenarioResult[] {
  const currentExistingEmi = Math.max(0, profile.existingEmi || 0);
  const totalEssentialExpenses = Math.max(0, profile.monthlyEssentialExpenses || 0) + Math.max(0, profile.rent || 0);

  // SCENARIO 1: INCOME SHOCK (-20%)
  const dropPercent = FINANCIAL_ASSUMPTIONS.STRESS_TEST.INCOME_DROP_PERCENT;
  const stressedIncome = recognizedIncome * (1 - dropPercent);
  
  // What total EMI is safe under stressed income?
  const stressedMaxTotalEmi = stressedIncome * 0.45; // 45% FOIR cap under stress
  const stressedEmiCeiling = Math.max(0, Math.round(stressedMaxTotalEmi - currentExistingEmi));
  
  // Residual cash under stressed income if borrower takes safeEmiCeiling
  const stressedResidualCash = stressedIncome - (currentExistingEmi + safeEmiCeiling) - totalEssentialExpenses;
  
  let incomeVerdict: StressScenarioResult['impactVerdict'] = 'SAFE';
  let incomeExplanation = '';

  if (stressedResidualCash < 0 || stressedEmiCeiling <= 0) {
    incomeVerdict = 'UNSUSTAINABLE';
    incomeExplanation = `If monthly income drops by 20% (to ₹${Math.round(stressedIncome).toLocaleString('en-IN')}), existing obligations + living costs exceed income by ₹${Math.abs(Math.round(stressedResidualCash)).toLocaleString('en-IN')}/mo.`;
  } else if (stressedResidualCash < FINANCIAL_ASSUMPTIONS.STRESS_TEST.MINIMUM_BASE_LIVING_CUSHION) {
    incomeVerdict = 'TIGHT';
    incomeExplanation = `A 20% income dip reduces your safe new EMI ceiling from ₹${safeEmiCeiling.toLocaleString('en-IN')} to ₹${stressedEmiCeiling.toLocaleString('en-IN')}/mo.`;
  } else {
    incomeVerdict = 'SAFE';
    incomeExplanation = `Even with a 20% income drop, you retain a comfortable monthly cash cushion of ₹${Math.round(stressedResidualCash).toLocaleString('en-IN')}.`;
  }

  const incomeScenario: StressScenarioResult = {
    scenarioName: 'Income Reduction Shock (-20%)',
    description: 'Models a 20% drop in monthly earnings due to business downtime, gig slump, or pay cut.',
    baseScenario: `Base Income: ₹${Math.round(recognizedIncome).toLocaleString('en-IN')}/mo`,
    stressedIncomeOrRate: `₹${Math.round(stressedIncome).toLocaleString('en-IN')}/mo`,
    stressedEmiCeiling,
    stressedResidualCash: Math.round(stressedResidualCash),
    stressedFoir: stressedIncome > 0 ? +(((currentExistingEmi + safeEmiCeiling) / stressedIncome) * 100).toFixed(1) : 0,
    impactVerdict: incomeVerdict,
    impactExplanation: incomeExplanation,
  };

  // SCENARIO 2: RATE HIKE SHOCK (+200 bps)
  const rateHike = FINANCIAL_ASSUMPTIONS.STRESS_TEST.RATE_HIKE_PERCENT;
  const stressedRate = baseRateMidpoint + rateHike;
  
  // Rate hike impact on existing + proposed debt (~6.5% increase on monthly payment)
  const rateHikeEmiDeltaPercent = 6.5;
  const stressedRateEmi = Math.round(safeEmiCeiling * (1 + rateHikeEmiDeltaPercent / 100));
  const rateResidual = recognizedIncome - (currentExistingEmi + stressedRateEmi) - totalEssentialExpenses;

  let rateVerdict: StressScenarioResult['impactVerdict'] = 'SAFE';
  let rateExplanation = '';

  if (rateResidual < 0) {
    rateVerdict = 'UNSUSTAINABLE';
    rateExplanation = `A 2% rate hike pushes monthly outflow up by ₹${stressedRateEmi - safeEmiCeiling}, which breaches your living expense reserve.`;
  } else if (rateResidual < 10000) {
    rateVerdict = 'TIGHT';
    rateExplanation = `A 2% rate hike adds ~₹${stressedRateEmi - safeEmiCeiling}/mo to your payment, tightening your discretionary budget.`;
  } else {
    rateVerdict = 'SAFE';
    rateExplanation = `Your cash flow can comfortably absorb a 2.00% rate hike (new rate ${stressedRate.toFixed(2)}%).`;
  }

  const rateScenario: StressScenarioResult = {
    scenarioName: 'Floating Rate Hike (+200 bps)',
    description: 'Models a 2.0% benchmark rate rise on floating interest rate contracts.',
    baseScenario: `Base Rate: ${baseRateMidpoint.toFixed(2)}%`,
    stressedIncomeOrRate: `${stressedRate.toFixed(2)}%`,
    stressedEmiCeiling: stressedRateEmi,
    stressedResidualCash: Math.round(rateResidual),
    stressedFoir: recognizedIncome > 0 ? +(((currentExistingEmi + stressedRateEmi) / recognizedIncome) * 100).toFixed(1) : 0,
    impactVerdict: rateVerdict,
    impactExplanation: rateExplanation,
  };

  return [incomeScenario, rateScenario];
}
