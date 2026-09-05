export type LoanPurpose = 
  | 'wedding'
  | 'business_expansion'
  | 'productive_asset'
  | 'home_purchase_renovation'
  | 'medical_emergency'
  | 'debt_consolidation'
  | 'education'
  | 'consumption_lifestyle'
  | 'other';

export type LoanType = 
  | 'personal'
  | 'business_unsecured'
  | 'lap_secured'
  | 'two_wheeler'
  | 'gold'
  | 'home';

export type IncomeType = 
  | 'salaried'
  | 'self_employed'
  | 'informal_gig';

export type IncomeStability = 
  | 'highly_stable' // e.g. MNC / Govt employee
  | 'moderate'      // e.g. Established business, regular private firm
  | 'variable'      // e.g. Kirana / Seasonal business
  | 'unpredictable';// e.g. Gig / Daily wage

export type CreditScoreTier = 
  | 'prime_750_plus'
  | 'good_700_749'
  | 'average_650_699'
  | 'poor_below_650'
  | 'unknown';

export type CollateralType = 
  | 'none'
  | 'property_residential_commercial'
  | 'gold'
  | 'vehicle';

export type RepaymentHistory = 
  | 'clean_no_issues'
  | 'minor_delay_past'
  | 'recent_bounce_or_default'
  | 'no_prior_loans'; // New to credit / no prior formal loans

export type PrimaryVerdict = 
  | 'BORROW'
  | 'BORROW_LESS'
  | 'DONT_BORROW'
  | 'CHANGE_PRODUCT_FIRST';

export type ConfidenceLevel = 'HIGH' | 'MEDIUM' | 'LOW';

export interface BorrowerProfile {
  // Loan Context
  loanPurpose: LoanPurpose;
  loanType: LoanType;
  requestedAmount: number;

  // Income Profile
  incomeType: IncomeType;
  monthlyIncome: number; // Borrower's individual net monthly take-home income
  lowMonthIncome?: number | null; // For informal / variable
  incomeStability: IncomeStability;
  employmentOrBusinessTenureYears?: number | null;
  declaredAnnualIncomeITR?: number | null; // For self-employed
  spouseOrCoApplicantIncome?: number | null; // Distinct co-applicant / spouse income

  // Existing Debt Profile
  existingEmi: number;
  existingLoanCount?: number | null;
  highCostDebtOutstanding?: number | null; // >24% APR loans
  hasHighCostDebt?: boolean | null;
  recentPaymentIssue: RepaymentHistory;

  // Household Affordability (Separated non-rent expenses and rent)
  monthlyEssentialExpenses: number; // Non-rent essential living costs (food, schooling, utilities, medical, transport)
  rent?: number | null; // House rent
  dependentsCount?: number | null;

  // Credit & Safety Net
  creditScoreTier: CreditScoreTier;
  creditScoreExact?: number | null;
  emergencySavingsMonths?: number | null;

  // Collateral & Productive Uplift
  collateralType?: CollateralType;
  collateralValue?: number | null;
  collateralEncumbered?: boolean | null;
  expectedMonthlyIncomeBenefit?: number | null; // Potential earning boost (not treated as guaranteed current cashflow)

  // Existing Lender Offer (Optional for negotiation check)
  hasExistingOffer?: boolean;
  offeredInterestRate?: number | null;
  offeredProcessingFeePercent?: number | null;
  offeredTenureMonths?: number | null;
  offeredEmi?: number | null;
}

export interface TenureOption {
  tenureMonths: number;
  tenureYears: number;
  monthlyEmi: number;
  totalInterest: number;
  totalRepayment: number;
  isRecommended: boolean;
  recommendationNote: string;
}

export interface StressScenarioResult {
  scenarioName: string;
  description: string;
  baseScenario: string;
  stressedIncomeOrRate: string;
  stressedEmiCeiling: number;
  stressedResidualCash: number;
  stressedFoir: number;
  impactVerdict: 'SAFE' | 'TIGHT' | 'UNSUSTAINABLE';
  impactExplanation: string;
}

export interface DecisionResult {
  // O1: Verdict
  verdict: PrimaryVerdict;
  verdictTitle: string;
  verdictSummary: string;
  verdictRationale: string[];

  // Income Accounting (Individual vs Household/Co-applicant)
  borrowerIndividualIncome: number;
  householdIncomeConsidered: number;
  hasCoApplicantIncome: boolean;
  coApplicantIncomeAmount: number;

  // O2: Estimated Lender Capacity vs Safe Borrower Amount
  likelyLenderSanctionMin: number;
  likelyLenderSanctionMax: number;
  likelyLenderSanctionReason: string;

  safeBorrowerAmountMin: number;
  safeBorrowerAmountMax: number;
  safeBorrowerAmountReason: string;
  amountRecommendation: 'USE_SAFE_AMOUNT' | 'CAP_TO_PURPOSE' | 'RESTRUCTURE_FIRST';

  // O3: Fair Interest Rate & All-in APR
  fairRateLow: number;
  fairRateHigh: number;
  fairRateBenchmarkReason: string;

  estimatedAprLow: number;
  estimatedAprHigh: number;
  aprComponentsReason: string;
  standardProcessingFeePercent: number;

  // O4: EMI Ceiling & Tenure
  safeEmiCeiling: number;
  emiCeilingReason: string;
  currentRecognizedIncome: number;
  totalEssentialHouseholdExpenses: number;
  currentFoirPercent: number;
  projectedFoirPercent: number;
  maxPermissibleFoirPercent: number;
  residualMonthlyCash: number;

  tenureOptions: TenureOption[];
  stressScenarios: StressScenarioResult[];

  // Product Recommendation / Routing
  recommendedProduct: LoanType;
  recommendedProductLabel: string;
  productRoutingReason?: string;
  isProductRouted: boolean;

  // Model Confidence & Uncertainty
  confidence: ConfidenceLevel;
  confidenceScore: number; // 0 - 100
  confidenceReasons: string[];
  uncertaintyDisclosures: string[];

  // Negotiation Ammunition
  negotiationPoints: {
    title: string;
    description: string;
    category: 'STRENGTH' | 'RISK_MITIGATION' | 'TACTICAL_QUESTION';
  }[];

  // Offer Comparison (if borrower provided an existing quote)
  offerComparison?: {
    offeredRate: number;
    fairRateMidpoint: number;
    differenceBps: number;
    verdict: 'FAIR' | 'HIGH' | 'PREDATORY';
    verdictText: string;
    potentialSavingsTotal: number;
  };
}

export interface PersonaPreset {
  id: string;
  name: string;
  age: number;
  city: string;
  personaType: 'salaried' | 'self_employed' | 'informal';
  tagline: string;
  avatarInitials: string;
  description: string;
  profile: BorrowerProfile;
  expectedHighlights: {
    verdict: string;
    keyRecommendation: string;
    fairRate: string;
    negotiationFocus: string;
  };
}
