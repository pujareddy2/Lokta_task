/**
 * Centralized Financial Assumptions & Benchmark Configuration
 * 
 * NOTE: These values represent conservative modelling assumptions and illustrative
 * retail benchmarks used by Borrower Copilot for decision-support guidance.
 * They do not constitute universal lender underwriting policies or statutory rules.
 */

export interface ProductRateConfig {
  name: string;
  category: 'unsecured' | 'secured';
  baseRateMin: number; // Benchmark prime rate (%)
  baseRateMax: number; // Standard retail upper band (%)
  standardProcessingFeePercent: number; // Typical upfront fee (%)
  maxStandardTenureMonths: number;
  typicalMaxLtvPercent?: number;
  typicalMaxFoirPercent: number;
}

export const FINANCIAL_ASSUMPTIONS = {
  // Product Rate Benchmark Matrices (Illustrative Indian Retail Lending Environment)
  PRODUCTS: {
    personal: {
      name: 'Personal Loan',
      category: 'unsecured',
      baseRateMin: 10.50,
      baseRateMax: 16.00,
      standardProcessingFeePercent: 1.50,
      maxStandardTenureMonths: 60,
      typicalMaxFoirPercent: 50,
    },
    business_unsecured: {
      name: 'Unsecured Business Loan',
      category: 'unsecured',
      baseRateMin: 14.00,
      baseRateMax: 24.00,
      standardProcessingFeePercent: 2.00,
      maxStandardTenureMonths: 48,
      typicalMaxFoirPercent: 50,
    },
    lap_secured: {
      name: 'Loan Against Property (LAP / MSME Secured)',
      category: 'secured',
      baseRateMin: 9.00,
      baseRateMax: 11.50,
      standardProcessingFeePercent: 1.00,
      maxStandardTenureMonths: 120, // 10 years
      typicalMaxLtvPercent: 60, // 60% of unencumbered market value
      typicalMaxFoirPercent: 60,
    },
    two_wheeler: {
      name: 'Two-Wheeler / EV Loan (Asset Hypothecated)',
      category: 'secured',
      baseRateMin: 11.50,
      baseRateMax: 17.50,
      standardProcessingFeePercent: 2.00,
      maxStandardTenureMonths: 36,
      typicalMaxLtvPercent: 85,
      typicalMaxFoirPercent: 45,
    },
    gold: {
      name: 'Gold Loan',
      category: 'secured',
      baseRateMin: 8.50,
      baseRateMax: 13.00,
      standardProcessingFeePercent: 0.50,
      maxStandardTenureMonths: 24,
      typicalMaxLtvPercent: 75,
      typicalMaxFoirPercent: 65,
    },
    home: {
      name: 'Home Loan',
      category: 'secured',
      baseRateMin: 8.40,
      baseRateMax: 9.75,
      standardProcessingFeePercent: 0.50,
      maxStandardTenureMonths: 240, // 20 years
      typicalMaxLtvPercent: 80,
      typicalMaxFoirPercent: 60,
    },
  } as Record<string, ProductRateConfig>,

  // Affordability & FOIR (Fixed Obligation to Income Ratio) Modelling Caps
  FOIR_LIMITS: {
    // Conservative modelling caps on debt burden
    SALARIED_PRIME: 0.50,       // 50% modelled cap for salaried
    SALARIED_HIGH_INCOME: 0.55, // > ₹1.0L/mo take-home allows 55% discretionary allowance
    SELF_EMPLOYED_STABLE: 0.45, // 45% for established self-employed
    SELF_EMPLOYED_CASH: 0.40,   // 40% for cash-heavy / seasonal business
    INFORMAL_GIG: 0.35,         // 35% conservative cap for volatile gig income
  },

  // Income Haircuts & Stability Recognitions (Modelling assumptions)
  INCOME_HAIRCUTS: {
    highly_stable: 0.00,   // 100% recognized
    moderate: 0.10,        // 90% recognized (10% conservative volatility reserve)
    variable: 0.25,        // 75% recognized (25% buffer for seasonal trade cycles)
    unpredictable: 0.35,   // 65% recognized (35% buffer for gig volatility)
  },

  // Credit Score Risk Adjustments (Illustrative spread adjustments in percentage points)
  CREDIT_SCORE_ADJUSTMENTS: {
    prime_750_plus: {
      spreadOffsetLow: -0.75,
      spreadOffsetHigh: -0.50,
      confidenceImpact: 15,
      note: 'Prime credit standing (750+) is typically associated with lower pricing eligibility.',
    },
    good_700_749: {
      spreadOffsetLow: 0.00,
      spreadOffsetHigh: 0.50,
      confidenceImpact: 10,
      note: 'Good credit standing (700-749) generally qualifies for standard benchmark rates.',
    },
    average_650_699: {
      spreadOffsetLow: 1.50,
      spreadOffsetHigh: 2.50,
      confidenceImpact: 5,
      note: 'Average credit history often carries an additional risk spread from lenders.',
    },
    poor_below_650: {
      spreadOffsetLow: 3.50,
      spreadOffsetHigh: 6.00,
      confidenceImpact: -10,
      note: 'Sub-prime or distressed credit history typically faces high risk pricing.',
    },
    unknown: {
      spreadOffsetLow: 0.00,
      spreadOffsetHigh: 3.00, // Widens the band without artificially penalizing
      confidenceImpact: -15,
      note: 'Credit score is unverified; fair rate range is widened to reflect uncertainty without penalizing you.',
    },
  },

  // Statutory Tax Assumptions
  TAX: {
    GST_ON_PROCESSING_FEE: 0.18, // 18% GST applicable on processing and administrative charges
  },

  // Stress Testing Parameters (Conservative modelling shocks)
  STRESS_TEST: {
    INCOME_DROP_PERCENT: 0.20, // 20% income reduction scenario
    RATE_HIKE_PERCENT: 2.00,   // +200 bps interest rate shock for floating rate contracts
    MINIMUM_RESIDUAL_CASH_PER_DEPENDENT: 4000, // ₹4,000/mo per dependent reserved cushion
    MINIMUM_BASE_LIVING_CUSHION: 12000, // ₹12,000 base household living reserve
  },

  // Risk Indicators
  RISK_THRESHOLDS: {
    HIGH_COST_DEBT_RATE_THRESHOLD: 24.00, // >24% APR loans (e.g. instant loan apps)
    MAX_UNSUSTAINABLE_FOIR: 0.65, // >65% debt servicing indicates severe debt strain
    MIN_EMERGENCY_MONTHS_RECOMMENDED: 3,
  },
};
