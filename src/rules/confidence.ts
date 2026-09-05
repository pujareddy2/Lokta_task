/**
 * Model Confidence Engine
 * Evaluates the informational reliability and precision of the self-assessment:
 * Unknown / approximate information -> wider range + lower confidence + explicit explanation.
 */

import { BorrowerProfile, ConfidenceLevel } from '../types/borrower';

export interface ConfidenceEvaluation {
  level: ConfidenceLevel;
  score: number; // 0 - 100
  reasons: string[];
  uncertaintyDisclosures: string[];
}

export function evaluateConfidence(profile: BorrowerProfile): ConfidenceEvaluation {
  let score = 70; // baseline heuristic
  const reasons: string[] = [];
  const uncertaintyDisclosures: string[] = [];

  // 1. Credit Score Knowledge
  if (profile.creditScoreTier === 'unknown') {
    score -= 20;
    uncertaintyDisclosures.push('Credit score is unverified: actual lender quotes will hinge on your bureau record pull.');
  } else if (profile.creditScoreTier === 'prime_750_plus') {
    score += 15;
    reasons.push('Verified prime credit score (750+) enables narrower, institutional rate pricing.');
  }

  // 2. Income Predictability
  if (profile.incomeStability === 'highly_stable') {
    score += 15;
    reasons.push('Stable salaried employment provides high income predictability.');
  } else if (profile.incomeStability === 'variable') {
    score -= 10;
    uncertaintyDisclosures.push('Self-employed cash income has seasonal variance; safe capacity is anchored conservatively.');
  } else if (profile.incomeStability === 'unpredictable') {
    score -= 25;
    uncertaintyDisclosures.push('Informal/gig income is volatile; estimates rely heavily on minimum low-month baselines.');
  }

  // 3. Documentation (ITR / Formal Bank records)
  if (profile.incomeType === 'self_employed') {
    if (profile.declaredAnnualIncomeITR && profile.declaredAnnualIncomeITR > 0) {
      score += 10;
      reasons.push('ITR filings provide a solid documentary basis for lender capacity estimation.');
    } else {
      score -= 15;
      uncertaintyDisclosures.push('Without formal ITR filings, formal banks will require extensive banking surrogates.');
    }
  }

  // 4. Emergency Cushion
  if (profile.emergencySavingsMonths !== undefined && profile.emergencySavingsMonths !== null) {
    if (profile.emergencySavingsMonths >= 3) {
      score += 10;
      reasons.push('Adequate emergency savings cushion (3+ months) protects repayment certainty.');
    } else if (profile.emergencySavingsMonths === 0) {
      score -= 10;
      uncertaintyDisclosures.push('Zero emergency savings creates elevated repayment risk during unplanned income disruptions.');
    }
  }

  // Clamp score
  const finalScore = Math.min(100, Math.max(15, score));
  let level: ConfidenceLevel = 'MEDIUM';
  if (finalScore >= 80) level = 'HIGH';
  else if (finalScore < 50) level = 'LOW';

  return {
    level,
    score: finalScore,
    reasons,
    uncertaintyDisclosures,
  };
}
