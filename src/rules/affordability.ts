/**
 * Affordability & Debt Burden Engine
 * Computes maximum comfortable debt servicing ceiling via dual constraints:
 * 1. Fixed Obligation to Income Ratio (FOIR) debt capacity
 * 2. Residual Household Cash Buffer Check (after essential living costs and rent)
 */

import { BorrowerProfile } from '../types/borrower';
import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';

export interface AffordabilityEvaluation {
  maxPermissibleFoirPercent: number;
  maxTotalMonthlyDebtCapacity: number;
  currentExistingEmi: number;
  currentFoirPercent: number;
  rawFoirEmiHeadroom: number;
  
  nonRentEssentialExpenses: number;
  rentExpenses: number;
  totalEssentialHouseholdExpenses: number;
  minimumLivingBufferRequired: number;
  residualCashAfterExpenses: number;
  
  safeNewEmiCeiling: number;
  isDebtBurdenCritical: boolean;
  affordabilityReason: string;
}

export function evaluateAffordability(
  profile: BorrowerProfile,
  individualRecognizedIncome: number,
  effectiveHouseholdIncome: number
): AffordabilityEvaluation {
  // 1. Determine applicable FOIR Limit (Modelling assumption)
  let foirLimit = FINANCIAL_ASSUMPTIONS.FOIR_LIMITS.SELF_EMPLOYED_STABLE;
  if (profile.incomeType === 'salaried') {
    foirLimit = effectiveHouseholdIncome >= 100000 
      ? FINANCIAL_ASSUMPTIONS.FOIR_LIMITS.SALARIED_HIGH_INCOME 
      : FINANCIAL_ASSUMPTIONS.FOIR_LIMITS.SALARIED_PRIME;
  } else if (profile.incomeType === 'self_employed') {
    foirLimit = profile.incomeStability === 'variable' 
      ? FINANCIAL_ASSUMPTIONS.FOIR_LIMITS.SELF_EMPLOYED_CASH 
      : FINANCIAL_ASSUMPTIONS.FOIR_LIMITS.SELF_EMPLOYED_STABLE;
  } else if (profile.incomeType === 'informal_gig') {
    foirLimit = FINANCIAL_ASSUMPTIONS.FOIR_LIMITS.INFORMAL_GIG;
  }

  const maxTotalMonthlyDebtCapacity = Math.round(effectiveHouseholdIncome * foirLimit);
  const currentExistingEmi = Math.max(0, profile.existingEmi || 0);
  const currentFoirPercent = effectiveHouseholdIncome > 0 
    ? +((currentExistingEmi / effectiveHouseholdIncome) * 100).toFixed(1) 
    : 0;

  // Headroom based purely on debt burden ratio
  const rawFoirEmiHeadroom = Math.max(0, maxTotalMonthlyDebtCapacity - currentExistingEmi);

  // 2. Residual Household Cash Buffer Check
  // Total essential expenses = Non-rent living expenses + Rent
  const nonRentEssentialExpenses = Math.max(0, profile.monthlyEssentialExpenses || 0);
  const rentExpenses = Math.max(0, profile.rent || 0);
  const totalEssentialHouseholdExpenses = nonRentEssentialExpenses + rentExpenses;

  const dependents = Math.max(0, profile.dependentsCount || 0);
  const minimumLivingBufferRequired = FINANCIAL_ASSUMPTIONS.STRESS_TEST.MINIMUM_BASE_LIVING_CUSHION +
    (dependents * FINANCIAL_ASSUMPTIONS.STRESS_TEST.MINIMUM_RESIDUAL_CASH_PER_DEPENDENT);

  const netCashRemaining = effectiveHouseholdIncome - currentExistingEmi - totalEssentialHouseholdExpenses;
  
  // Safe buffer headroom: net cash remaining minus a 15% safety reserve for discretionary emergencies
  const cashBufferHeadroom = Math.max(0, Math.round(netCashRemaining * 0.85));

  // The true safe EMI ceiling is the MINIMUM of FOIR headroom and Cash Buffer headroom
  let safeNewEmiCeiling = Math.min(rawFoirEmiHeadroom, cashBufferHeadroom);

  // Critical debt flag
  const isDebtBurdenCritical = currentFoirPercent > (FINANCIAL_ASSUMPTIONS.RISK_THRESHOLDS.MAX_UNSUSTAINABLE_FOIR * 100) ||
    netCashRemaining <= 0;

  if (isDebtBurdenCritical) {
    safeNewEmiCeiling = 0;
  }

  // Construct clear one-sentence explanation
  let affordabilityReason = '';
  if (isDebtBurdenCritical) {
    affordabilityReason = `Existing obligations take ${currentFoirPercent}% of income and leave little residual cash after ₹${totalEssentialHouseholdExpenses.toLocaleString('en-IN')} essential expenses, leaving zero safe room for additional monthly EMIs.`;
  } else if (cashBufferHeadroom < rawFoirEmiHeadroom) {
    affordabilityReason = `Your monthly EMI ceiling is capped at ₹${safeNewEmiCeiling.toLocaleString('en-IN')} to safeguard your ₹${totalEssentialHouseholdExpenses.toLocaleString('en-IN')} essential living and rent expenses.`;
  } else {
    affordabilityReason = `A monthly EMI of ₹${safeNewEmiCeiling.toLocaleString('en-IN')} keeps your total debt burden within a comfortable ${Math.round(foirLimit * 100)}% of income.`;
  }

  return {
    maxPermissibleFoirPercent: Math.round(foirLimit * 100),
    maxTotalMonthlyDebtCapacity,
    currentExistingEmi,
    currentFoirPercent,
    rawFoirEmiHeadroom,
    nonRentEssentialExpenses,
    rentExpenses,
    totalEssentialHouseholdExpenses,
    minimumLivingBufferRequired,
    residualCashAfterExpenses: netCashRemaining,
    safeNewEmiCeiling: Math.round(safeNewEmiCeiling),
    isDebtBurdenCritical,
    affordabilityReason,
  };
}
