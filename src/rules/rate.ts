/**
 * Fair Rate Range Rules Engine
 * 
 * Determines an illustrative fair rate band based on an explainable chain:
 * 1. Product benchmark baseline
 * 2. Credit profile adjustment (unverified score widens the range instead of scoring as poor)
 * 3. Employment & income stability profile
 * 4. Collateral security backing
 */

import { BorrowerProfile, LoanType } from '../types/borrower';
import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';

export interface FairRateEvaluation {
  fairRateLow: number;
  fairRateHigh: number;
  fairRateMidpoint: number;
  benchmarkBaseLow: number;
  benchmarkBaseHigh: number;
  rateSpreadAdjustments: {
    factor: string;
    lowAdjustmentBps: number;
    highAdjustmentBps: number;
    description: string;
  }[];
  standardProcessingFeePercent: number;
  rateRationale: string;
}

export function evaluateFairRate(profile: BorrowerProfile, activeLoanType?: LoanType): FairRateEvaluation {
  const targetProductType = activeLoanType || profile.loanType;
  const productConfig = FINANCIAL_ASSUMPTIONS.PRODUCTS[targetProductType] || FINANCIAL_ASSUMPTIONS.PRODUCTS.personal;

  let baseLow = productConfig.baseRateMin;
  let baseHigh = productConfig.baseRateMax;

  const adjustments: FairRateEvaluation['rateSpreadAdjustments'] = [];

  // 1. Credit Score Adjustment
  const creditTier = profile.creditScoreTier || 'unknown';
  const creditConfig = FINANCIAL_ASSUMPTIONS.CREDIT_SCORE_ADJUSTMENTS[creditTier] || 
    FINANCIAL_ASSUMPTIONS.CREDIT_SCORE_ADJUSTMENTS.unknown;

  baseLow += creditConfig.spreadOffsetLow;
  baseHigh += creditConfig.spreadOffsetHigh;

  adjustments.push({
    factor: 'Credit Profile',
    lowAdjustmentBps: Math.round(creditConfig.spreadOffsetLow * 100),
    highAdjustmentBps: Math.round(creditConfig.spreadOffsetHigh * 100),
    description: creditConfig.note,
  });

  // 2. Income Stability Adjustment
  if (profile.incomeType === 'salaried' && profile.incomeStability === 'highly_stable') {
    // Stable salaried profile pricing allowance
    baseLow -= 0.50;
    baseHigh -= 1.00;
    adjustments.push({
      factor: 'Stable Salaried Profile',
      lowAdjustmentBps: -50,
      highAdjustmentBps: -100,
      description: 'Predictable salaried income is typically eligible for prime retail rate tiers.',
    });
  } else if (profile.incomeType === 'informal_gig') {
    baseLow += 1.50;
    baseHigh += 3.00;
    adjustments.push({
      factor: 'Informal/Gig Profile Spread',
      lowAdjustmentBps: 150,
      highAdjustmentBps: 300,
      description: 'Informal cash flow is typically underwritten with an additional risk spread.',
    });
  }

  // 3. Collateral Security Backing (e.g. Unencumbered Property)
  if (profile.collateralType === 'property_residential_commercial' && profile.collateralValue && profile.collateralValue > 1000000) {
    if (targetProductType === 'lap_secured') {
      // Already accounted in LAP base rate
    } else {
      adjustments.push({
        factor: 'Pledgeable Collateral',
        lowAdjustmentBps: -200,
        highAdjustmentBps: -300,
        description: 'Pledging unencumbered property can secure 4%–6% lower interest if converted to LAP.',
      });
    }
  }

  // Ensure logical rate boundaries
  const fairRateLow = +Math.max(8.00, baseLow).toFixed(2);
  const fairRateHigh = +Math.max(fairRateLow + 0.75, baseHigh).toFixed(2);
  const fairRateMidpoint = +((fairRateLow + fairRateHigh) / 2).toFixed(2);

  // Construct clear one-sentence explanation
  let rateRationale = '';
  if (creditTier === 'unknown') {
    rateRationale = `Because your credit score is unverified, your fair-rate range (${fairRateLow}% – ${fairRateHigh}%) is wider than standard.`;
  } else if (targetProductType === 'lap_secured') {
    rateRationale = `Pledging unencumbered property qualifies for secured MSME rate benchmarks of ${fairRateLow}% – ${fairRateHigh}%, significantly lower than unsecured borrowing.`;
  } else if (creditTier === 'prime_750_plus' && profile.incomeType === 'salaried') {
    rateRationale = `Your prime credit score and stable salaried profile justify competitive bank rate tiers between ${fairRateLow}% and ${fairRateHigh}%.`;
  } else {
    rateRationale = `Based on product type and cash flow risk, competitive quotes should sit within ${fairRateLow}% – ${fairRateHigh}%.`;
  }

  return {
    fairRateLow,
    fairRateHigh,
    fairRateMidpoint,
    benchmarkBaseLow: productConfig.baseRateMin,
    benchmarkBaseHigh: productConfig.baseRateMax,
    rateSpreadAdjustments: adjustments,
    standardProcessingFeePercent: productConfig.standardProcessingFeePercent,
    rateRationale,
  };
}
