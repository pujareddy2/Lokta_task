/**
 * Loan Capacity Engine: Estimated Lender-Facing Capacity vs Safe Carrying Capacity
 */

import { BorrowerProfile } from '../types/borrower';
import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';
import { calculatePrincipalFromEmi } from './emi';

export interface CapacityEvaluation {
  // Estimated Lender-Facing Capacity (Standard commercial underwriting assumptions)
  lenderSanctionMin: number;
  lenderSanctionMax: number;
  lenderMaxPermissibleEmi: number;
  lenderAssumedTenureMonths: number;
  lenderReason: string;

  // Safe Borrower Carrying Capacity (Cash flow & affordability constraints)
  safeBorrowerAmountMin: number;
  safeBorrowerAmountMax: number;
  safeBorrowerEmiCeiling: number;
  safeRecommendedTenureMonths: number;
  safeReason: string;
}

export function evaluateLoanCapacity(
  profile: BorrowerProfile,
  recognizedMonthlyIncome: number,
  safeEmiCeiling: number,
  fairRateMidpoint: number
): CapacityEvaluation {
  const productConfig = FINANCIAL_ASSUMPTIONS.PRODUCTS[profile.loanType] || FINANCIAL_ASSUMPTIONS.PRODUCTS.personal;

  // 1. ESTIMATED LENDER-FACING CAPACITY (Commercial underwriting model assumptions)
  // Lenders typically evaluate FOIR up to statutory / policy limits (50% - 60%) across maximum tenure
  const lenderFoir = (productConfig.typicalMaxFoirPercent || 50) / 100;
  
  // Total recognized household income
  const totalLenderIncome = recognizedMonthlyIncome;
  const lenderMaxTotalEmi = totalLenderIncome * lenderFoir;
  const lenderAvailableEmi = Math.max(0, lenderMaxTotalEmi - (profile.existingEmi || 0));

  // Maximum standard product tenure
  const lenderTenure = productConfig.maxStandardTenureMonths;
  const lenderMaxPrincipal = calculatePrincipalFromEmi(lenderAvailableEmi, fairRateMidpoint, lenderTenure);

  // If secured with collateral, check LTV cap
  let lenderSanctionMax = lenderMaxPrincipal;
  if (productConfig.category === 'secured' && profile.collateralValue && profile.collateralValue > 0) {
    const ltv = (productConfig.typicalMaxLtvPercent || 60) / 100;
    const collateralMax = profile.collateralValue * ltv;
    // For secured loans, sanction estimate is min(FOIR capacity, LTV cap)
    lenderSanctionMax = Math.min(lenderMaxPrincipal, collateralMax);
  }

  // Indicative lender band (min is ~80% of max sanction)
  const lenderSanctionMin = Math.round(lenderSanctionMax * 0.80);

  // 2. SAFE BORROWER CARRYING CAPACITY
  // Safe capacity is based on sustainable tenure (not stretched unnecessarily for consumption)
  let safeTenure = 36; // 3 years default for personal/consumption
  if (profile.loanType === 'lap_secured' || profile.loanType === 'home') {
    safeTenure = 84; // 7 years for long-term secured asset
  } else if (profile.loanType === 'two_wheeler' || profile.loanType === 'gold') {
    safeTenure = 24; // 2 years
  } else if (profile.loanType === 'business_unsecured') {
    safeTenure = 36; // 3 years
  }

  const safePrincipalAtIdealTenure = calculatePrincipalFromEmi(safeEmiCeiling, fairRateMidpoint, safeTenure);
  const safePrincipalShorter = calculatePrincipalFromEmi(safeEmiCeiling, fairRateMidpoint, Math.max(12, safeTenure - 12));

  // Round numbers to neat increments (e.g. ₹25,000 or ₹50,000)
  const roundToNearest = (val: number, step: number = 25000) => Math.max(0, Math.round(val / step) * step);

  const safeMin = roundToNearest(Math.min(safePrincipalShorter, safePrincipalAtIdealTenure));
  const safeMax = roundToNearest(Math.max(safePrincipalShorter, safePrincipalAtIdealTenure));

  const lenderReason = `Standard commercial models assume a ${Math.round(lenderFoir * 100)}% total debt burden over a maximum ${lenderTenure}-month tenure.`;
  const safeReason = `Calculated on a sustainable ${safeTenure}-month horizon ensuring your living expenses and debt buffer are preserved.`;

  return {
    lenderSanctionMin: roundToNearest(lenderSanctionMin, 50000),
    lenderSanctionMax: roundToNearest(lenderSanctionMax, 50000),
    lenderMaxPermissibleEmi: Math.round(lenderAvailableEmi),
    lenderAssumedTenureMonths: lenderTenure,
    lenderReason,

    safeBorrowerAmountMin: safeMin,
    safeBorrowerAmountMax: safeMax,
    safeBorrowerEmiCeiling: safeEmiCeiling,
    safeRecommendedTenureMonths: safeTenure,
    safeReason,
  };
}
