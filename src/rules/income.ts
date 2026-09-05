/**
 * Income Recognition Rules Engine
 * Evaluates reliable baseline income by adjusting for volatility and business/gig nature.
 * Clearly separates individual borrower income from co-applicant / household capacity.
 */

import { BorrowerProfile } from '../types/borrower';
import { FINANCIAL_ASSUMPTIONS } from '../data/assumptions';

export interface IncomeEvaluation {
  rawBorrowerIncome: number;
  borrowerIndividualIncome: number;
  coApplicantIncome: number;
  hasCoApplicantIncome: boolean;
  effectiveHouseholdIncome: number;
  haircutPercent: number;
  stabilityNote: string;
}

export function evaluateRecognizedIncome(profile: BorrowerProfile): IncomeEvaluation {
  const rawBorrowerIncome = profile.monthlyIncome || 0;
  const stability = profile.incomeStability || 'moderate';

  // Haircut based on income stability category (modelling assumption)
  const haircutPercent = (FINANCIAL_ASSUMPTIONS.INCOME_HAIRCUTS[stability] ?? 0.15) * 100;
  let individualIncome = rawBorrowerIncome * (1 - haircutPercent / 100);

  // If gig/informal has provided a low-month floor, anchor recognized income conservatively
  if (profile.incomeType === 'informal_gig' && profile.lowMonthIncome && profile.lowMonthIncome > 0) {
    // 70% weight on low-month income to protect against seasonal gig troughs
    individualIncome = profile.lowMonthIncome * 0.70 + rawBorrowerIncome * 0.30;
  }

  // If self-employed with ITR declared income:
  // Lenders evaluate ITR / 12, but we recognize conservative cash flow + ITR average
  if (profile.incomeType === 'self_employed' && profile.declaredAnnualIncomeITR && profile.declaredAnnualIncomeITR > 0) {
    const monthlyITR = profile.declaredAnnualIncomeITR / 12;
    // Blend ITR baseline with stated cash income (e.g. 50% ITR + 50% recognized cash)
    individualIncome = Math.min(rawBorrowerIncome, (monthlyITR + rawBorrowerIncome) / 2);
  }

  // Distinct co-applicant / spouse income
  const coApplicantIncome = profile.spouseOrCoApplicantIncome || 0;
  const hasCoApplicantIncome = coApplicantIncome > 0;
  const effectiveHouseholdIncome = individualIncome + coApplicantIncome;

  let stabilityNote = '';
  switch (stability) {
    case 'highly_stable':
      stabilityNote = 'Salaried income with high stability: 100% of individual take-home is recognized.';
      break;
    case 'moderate':
      stabilityNote = 'Established income: recognized at 90% to maintain a modest volatility reserve.';
      break;
    case 'variable':
      stabilityNote = 'Variable business income: recognized with a 25% safety buffer to absorb slower trading months.';
      break;
    case 'unpredictable':
      stabilityNote = 'Informal/gig income: recognized conservatively with low-month anchoring to prevent default.';
      break;
  }

  return {
    rawBorrowerIncome,
    borrowerIndividualIncome: Math.round(individualIncome),
    coApplicantIncome: Math.round(coApplicantIncome),
    hasCoApplicantIncome,
    effectiveHouseholdIncome: Math.round(effectiveHouseholdIncome),
    haircutPercent,
    stabilityNote,
  };
}
