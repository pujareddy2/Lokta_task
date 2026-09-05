/**
 * Reducing Balance EMI Calculation Engine
 * Formula: EMI = [P * r * (1 + r)^n] / [(1 + r)^n - 1]
 * where:
 *   P = Loan Principal
 *   r = Monthly Interest Rate (Annual Rate / 12 / 100)
 *   n = Tenure in Months
 */

import { TenureOption } from '../types/borrower';

export function calculateMonthlyEmi(principal: number, annualRatePercent: number, tenureMonths: number): number {
  if (principal <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) return Math.round(principal / tenureMonths);

  const monthlyRate = annualRatePercent / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const emi = (principal * monthlyRate * growthFactor) / (growthFactor - 1);

  return Math.round(emi);
}

/**
 * Inverse calculation: Given a safe monthly EMI ceiling, compute maximum supported principal
 * Formula: P = [EMI * ((1 + r)^n - 1)] / [r * (1 + r)^n]
 */
export function calculatePrincipalFromEmi(safeEmi: number, annualRatePercent: number, tenureMonths: number): number {
  if (safeEmi <= 0 || tenureMonths <= 0) return 0;
  if (annualRatePercent <= 0) return safeEmi * tenureMonths;

  const monthlyRate = annualRatePercent / 12 / 100;
  const growthFactor = Math.pow(1 + monthlyRate, tenureMonths);
  const principal = (safeEmi * (growthFactor - 1)) / (monthlyRate * growthFactor);

  return Math.round(principal);
}

/**
 * Total interest and repayment summary
 */
export function calculateLoanSummary(principal: number, annualRatePercent: number, tenureMonths: number) {
  const emi = calculateMonthlyEmi(principal, annualRatePercent, tenureMonths);
  const totalRepayment = emi * tenureMonths;
  const totalInterest = Math.max(0, totalRepayment - principal);

  return {
    emi,
    totalRepayment,
    totalInterest,
    interestRatio: principal > 0 ? (totalInterest / principal) * 100 : 0,
  };
}

/**
 * Generates multi-tenure breakdown (e.g. 12, 24, 36, 48, 60, 84 months)
 */
export function generateTenureOptions(
  principal: number,
  annualRatePercent: number,
  maxRecommendedTenureMonths: number = 48,
  preferredTenureMonths?: number
): TenureOption[] {
  // Determine relevant tenure points
  const candidateTenures = [12, 24, 36, 48, 60, 84, 120].filter(
    (t) => t <= Math.max(maxRecommendedTenureMonths, 60)
  );

  if (preferredTenureMonths && !candidateTenures.includes(preferredTenureMonths)) {
    candidateTenures.push(preferredTenureMonths);
    candidateTenures.sort((a, b) => a - b);
  }

  // Recommended is typically balanced (36 to 48 months for consumption, up to 84 for secured)
  const idealTenure = Math.min(maxRecommendedTenureMonths, 36);

  return candidateTenures.map((tenureMonths) => {
    const summary = calculateLoanSummary(principal, annualRatePercent, tenureMonths);
    const tenureYears = +(tenureMonths / 12).toFixed(1);
    const isRecommended = tenureMonths === idealTenure;

    let note = '';
    if (tenureMonths <= 24) {
      note = 'Higher EMI, but saves massive total interest.';
    } else if (isRecommended) {
      note = 'Balanced: manageable EMI with controlled total interest cost.';
    } else if (tenureMonths <= 60) {
      note = 'Lower EMI, but total interest increases significantly.';
    } else {
      note = 'Long tenure: only recommended for large secured asset loans.';
    }

    return {
      tenureMonths,
      tenureYears,
      monthlyEmi: summary.emi,
      totalInterest: summary.totalInterest,
      totalRepayment: summary.totalRepayment,
      isRecommended,
      recommendationNote: note,
    };
  });
}
