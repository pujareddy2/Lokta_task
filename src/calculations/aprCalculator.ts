/**
 * All-In APR (Annual Percentage Rate) Calculation Engine
 * 
 * True APR reflects the actual annualized cost of borrowing by accounting for:
 * 1. Stated nominal reducing interest rate
 * 2. Processing fees (typically 1.0% – 2.5%)
 * 3. 18% GST applicable on processing and administration fees
 * 4. Net disbursed amount = Principal - (Upfront Fees + GST)
 * 
 * Uses standard Newton-Raphson Internal Rate of Return (IRR) solver.
 */

import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';

export interface AprBreakdown {
  nominalRatePercent: number;
  processingFeePercent: number;
  processingFeeAmount: number;
  gstAmount: number;
  totalUpfrontCharges: number;
  netDisbursedAmount: number;
  allInAprPercent: number;
  differenceBps: number; // Basis points added by upfront charges
}

export function calculateAllInApr(
  principal: number,
  nominalAnnualRatePercent: number,
  tenureMonths: number,
  processingFeePercent: number = 1.5
): AprBreakdown {
  if (principal <= 0 || tenureMonths <= 0 || nominalAnnualRatePercent <= 0) {
    return {
      nominalRatePercent: nominalAnnualRatePercent,
      processingFeePercent,
      processingFeeAmount: 0,
      gstAmount: 0,
      totalUpfrontCharges: 0,
      netDisbursedAmount: principal,
      allInAprPercent: nominalAnnualRatePercent,
      differenceBps: 0,
    };
  }

  // Calculate upfront charges
  const processingFeeAmount = Math.round((principal * processingFeePercent) / 100);
  const gstAmount = Math.round(processingFeeAmount * FINANCIAL_ASSUMPTIONS.TAX.GST_ON_PROCESSING_FEE);
  const totalUpfrontCharges = processingFeeAmount + gstAmount;
  const netDisbursedAmount = principal - totalUpfrontCharges;

  // Monthly EMI based on nominal contract
  const monthlyRateNominal = nominalAnnualRatePercent / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRateNominal, tenureMonths);
  const emi = (principal * monthlyRateNominal * growthFactor) / (growthFactor - 1);

  // Solve for monthly IRR where NPV = -netDisbursedAmount + sum(emi / (1+r)^t) = 0
  // Initial guess: nominal monthly rate + upfront fee amortized
  let r = monthlyRateNominal + (totalUpfrontCharges / principal) / tenureMonths;
  const maxIterations = 50;
  const precision = 0.000001;

  for (let i = 0; i < maxIterations; i++) {
    // f(r) = -NetDisbursed + EMI * [(1 - (1+r)^-n) / r]
    const term = Math.pow(1 + r, -tenureMonths);
    const f_r = -netDisbursedAmount + emi * ((1 - term) / r);

    // Derivative f'(r)
    // d/dr [(1 - (1+r)^-n) / r] = [r * n*(1+r)^(-n-1) - (1 - (1+r)^-n)] / r^2
    const numerator = r * tenureMonths * Math.pow(1 + r, -tenureMonths - 1) - (1 - term);
    const f_prime_r = emi * (numerator / (r * r));

    if (Math.abs(f_prime_r) < 1e-12) break;

    const next_r = r - f_r / f_prime_r;
    if (Math.abs(next_r - r) < precision) {
      r = next_r;
      break;
    }
    r = next_r;
  }

  const allInAprPercent = +(r * 12 * 100).toFixed(2);
  const differenceBps = Math.round((allInAprPercent - nominalAnnualRatePercent) * 100);

  return {
    nominalRatePercent: nominalAnnualRatePercent,
    processingFeePercent,
    processingFeeAmount,
    gstAmount,
    totalUpfrontCharges,
    netDisbursedAmount,
    allInAprPercent: Math.max(nominalAnnualRatePercent, allInAprPercent),
    differenceBps: Math.max(0, differenceBps),
  };
}
