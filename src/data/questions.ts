import { BorrowerProfile, LoanPurpose, LoanType, IncomeType, IncomeStability, CreditScoreTier, CollateralType, RepaymentHistory } from '../types/borrower';

export type QuestionSection = 
  | 'loan_context'
  | 'income'
  | 'existing_debt'
  | 'household'
  | 'credit_safety'
  | 'collateral_asset'
  | 'existing_offer';

export interface QuestionOption<T = string | number | boolean> {
  label: string;
  value: T;
  subtitle?: string;
  badge?: string;
}

export interface QuestionDefinition {
  id: keyof BorrowerProfile | string;
  section: QuestionSection;
  title: string;
  subtitle?: string;
  whyWeAsk: string;
  type: 'select' | 'currency' | 'number' | 'radio' | 'boolean';
  options?: QuestionOption<any>[];
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
  unit?: string;
  defaultValue?: any;
  // Adaptive condition: If returns false, question is skipped
  condition?: (profile: Partial<BorrowerProfile>) => boolean;
  // Which outputs this question influences (for transparency)
  affects: ('verdict' | 'safeAmount' | 'lenderAmount' | 'fairRate' | 'emiCeiling' | 'stressTest' | 'confidence' | 'productRouting')[];
  isMustQuestion: boolean;
}

export const QUESTION_SECTIONS: { id: QuestionSection; title: string; subtitle: string; icon: string }[] = [
  { id: 'loan_context', title: 'Loan Intent', subtitle: 'What are you looking to borrow and why?', icon: 'Target' },
  { id: 'income', title: 'Income & Cashflow', subtitle: 'How money comes into your household', icon: 'TrendingUp' },
  { id: 'existing_debt', title: 'Existing Obligations', subtitle: 'Current active EMIs & credit history', icon: 'CreditCard' },
  { id: 'household', title: 'Living Affordability', subtitle: 'Essential non-negotiable living costs', icon: 'Home' },
  { id: 'credit_safety', title: 'Credit & Safety Net', subtitle: 'Bureau awareness & emergency reserve', icon: 'ShieldCheck' },
  { id: 'collateral_asset', title: 'Collateral & Productivity', subtitle: 'Assets you can pledge or prospective boost', icon: 'Coins' },
  { id: 'existing_offer', title: 'Existing Quote (Optional)', subtitle: 'Compare an offer you already received', icon: 'FileText' },
];

export const QUESTIONS_CATALOG: QuestionDefinition[] = [
  // ==========================================
  // SECTION 1: LOAN CONTEXT
  // ==========================================
  {
    id: 'loanPurpose',
    section: 'loan_context',
    title: 'What is the primary purpose of this loan?',
    subtitle: 'Helps distinguish between productive investments and one-off consumption spending.',
    whyWeAsk: 'Consumption loans (like weddings) create no future cash flow, so we recommend stricter tenure limits to avoid compounding interest.',
    type: 'select',
    isMustQuestion: true,
    affects: ['verdict', 'safeAmount', 'productRouting'],
    options: [
      { label: 'Wedding / Family Event', value: 'wedding', subtitle: 'One-off consumption milestone' },
      { label: 'Business Working Capital / Expansion', value: 'business_expansion', subtitle: 'Stock, inventory, shop renovation' },
      { label: 'Productive Asset Purchase', value: 'productive_asset', subtitle: 'Vehicle, machinery, equipment for income' },
      { label: 'Home Purchase or Construction', value: 'home_purchase_renovation', subtitle: 'Long-term secured real estate asset' },
      { label: 'Debt Consolidation / Refinancing', value: 'debt_consolidation', subtitle: 'Clearing high-cost loans with single lower-cost loan' },
      { label: 'Medical or Personal Emergency', value: 'medical_emergency', subtitle: 'Urgent unplanned expense' },
      { label: 'Other Personal / Lifestyle Needs', value: 'consumption_lifestyle', subtitle: 'Travel, consumer electronics, etc.' },
    ],
  },
  {
    id: 'requestedAmount',
    section: 'loan_context',
    title: 'How much money do you need to borrow?',
    subtitle: 'Enter your approximate target amount in Rupees.',
    whyWeAsk: 'We compare this against your safe carrying capacity to advise whether to borrow the full amount or scale back.',
    type: 'currency',
    placeholder: 'e.g. 5,00,000',
    min: 10000,
    max: 50000000,
    step: 10000,
    isMustQuestion: true,
    affects: ['verdict', 'safeAmount', 'lenderAmount', 'emiCeiling'],
  },
  {
    id: 'loanType',
    section: 'loan_context',
    title: 'Which loan product are you planning to apply for?',
    subtitle: 'Pick what you have in mind; we will indicate if a more economical product route exists.',
    whyWeAsk: 'Determines the baseline interest rate benchmark, statutory FOIR caps, and maximum tenure.',
    type: 'select',
    isMustQuestion: true,
    affects: ['fairRate', 'lenderAmount', 'safeAmount', 'productRouting'],
    options: [
      { label: 'Personal Loan (Unsecured)', value: 'personal', subtitle: 'No collateral needed; quick sanction; higher interest (10.5%–16%)' },
      { label: 'Unsecured Business Loan', value: 'business_unsecured', subtitle: 'Working capital without pledging property (14%–24%)' },
      { label: 'Loan Against Property (LAP / MSME)', value: 'lap_secured', subtitle: 'Pledge house/shop for lower interest & 7-10 yr tenure (9%–11.5%)' },
      { label: 'Two-Wheeler / Vehicle Loan', value: 'two_wheeler', subtitle: 'Vehicle is hypothecated as security (11.5%–17.5%)' },
      { label: 'Gold Loan', value: 'gold', subtitle: 'Pledge gold jewelry for instant disbursal (8.5%–13%)' },
      { label: 'Home Loan', value: 'home', subtitle: 'Long-term residential property mortgage (8.4%–9.75%)' },
    ],
  },

  // ==========================================
  // SECTION 2: INCOME PROFILE
  // ==========================================
  {
    id: 'incomeType',
    section: 'income',
    title: 'What is your primary source of income?',
    subtitle: 'Different income types have different volatility profiles.',
    whyWeAsk: 'Income stability affects how conservatively we estimate your repayment capacity to protect against cash flow dips.',
    type: 'select',
    isMustQuestion: true,
    affects: ['lenderAmount', 'fairRate', 'confidence', 'safeAmount'],
    options: [
      { label: 'Salaried (Formal Employment)', value: 'salaried', subtitle: 'Regular salary credited to bank account with payslips / Form 16' },
      { label: 'Self-Employed (Business / Professional / Shop)', value: 'self_employed', subtitle: 'Kirana, trade, MSME, or independent consulting' },
      { label: 'Informal / Gig Economy / Daily Earner', value: 'informal_gig', subtitle: 'Platform delivery, tailoring, driver, freelance' },
    ],
  },
  {
    id: 'monthlyIncome',
    section: 'income',
    title: 'What is your typical net monthly take-home income?',
    subtitle: 'Your individual in-hand amount received per month after taxes and deductions.',
    whyWeAsk: 'The primary anchor number for calculating your monthly debt burden (FOIR) and safe EMI limit.',
    type: 'currency',
    placeholder: 'e.g. 75,000',
    min: 5000,
    max: 2000000,
    step: 5000,
    isMustQuestion: true,
    affects: ['safeAmount', 'lenderAmount', 'emiCeiling', 'stressTest'],
  },
  {
    id: 'incomeStability',
    section: 'income',
    title: 'How predictable is your monthly income?',
    subtitle: 'Be realistic — volatile income requires a larger cash buffer to prevent default.',
    whyWeAsk: 'Variable income uses a 10%–35% safety haircut so you don’t over-commit to fixed monthly obligations during lean months.',
    type: 'select',
    isMustQuestion: true,
    affects: ['safeAmount', 'confidence', 'stressTest'],
    options: [
      { label: 'Highly Stable (MNC / Govt / Large Corporate)', value: 'highly_stable', subtitle: 'Predictable on-time salary every month (0% haircut)' },
      { label: 'Moderate (Established Private Firm / Business)', value: 'moderate', subtitle: 'Generally steady with minor variance (10% haircut)' },
      { label: 'Variable (Seasonal Trade / Shop / Commission)', value: 'variable', subtitle: 'Good months and slow months (25% safety haircut)' },
      { label: 'Unpredictable (Daily / Gig / Inconsistent)', value: 'unpredictable', subtitle: 'Fluctuates significantly week to week (35% haircut)' },
    ],
  },
  {
    id: 'lowMonthIncome',
    section: 'income',
    title: 'In a slow or lean month, what is your minimum income?',
    subtitle: 'For informal or seasonal workers, your safe EMI must be serviceable even during your leanest month.',
    whyWeAsk: 'Protects you from default during seasonal dips or low-gig order periods.',
    type: 'currency',
    placeholder: 'e.g. 20,000',
    condition: (p) => p.incomeType === 'informal_gig' || p.incomeStability === 'variable' || p.incomeStability === 'unpredictable',
    isMustQuestion: false,
    affects: ['safeAmount', 'emiCeiling', 'stressTest'],
  },
  {
    id: 'declaredAnnualIncomeITR',
    section: 'income',
    title: 'What annual income do you declare on your Income Tax Return (ITR)?',
    subtitle: 'Commercial lenders evaluate ITR documentation when assessing formal eligibility.',
    whyWeAsk: 'Helps model formal lender eligibility versus cash-flow based safe affordability.',
    type: 'currency',
    placeholder: 'e.g. 4,20,000',
    condition: (p) => p.incomeType === 'self_employed',
    isMustQuestion: false,
    affects: ['lenderAmount', 'confidence'],
  },
  {
    id: 'spouseOrCoApplicantIncome',
    section: 'income',
    title: 'Does your spouse or family co-applicant have regular monthly income?',
    subtitle: 'Enter regular income of a co-applicant who can join the loan application.',
    whyWeAsk: 'Adding a earning co-applicant expands joint household capacity, though actual lenders require co-applicant eligibility and documentation.',
    type: 'currency',
    placeholder: 'e.g. 18,000 (leave 0 if none)',
    isMustQuestion: false,
    affects: ['lenderAmount', 'safeAmount', 'emiCeiling'],
  },
  {
    id: 'employmentOrBusinessTenureYears',
    section: 'income',
    title: 'How many years have you been in this job / business?',
    subtitle: 'Approximate vintage in your current field.',
    whyWeAsk: 'Longer income history can make cash flow easier to assess and is typically associated with better pricing eligibility.',
    type: 'number',
    placeholder: 'e.g. 5',
    min: 0,
    max: 50,
    isMustQuestion: false,
    affects: ['fairRate', 'lenderAmount'],
  },

  // ==========================================
  // SECTION 3: EXISTING DEBT & REPAYMENT
  // ==========================================
  {
    id: 'existingEmi',
    section: 'existing_debt',
    title: 'What total EMI are you currently paying every month?',
    subtitle: 'Include all active car, home, two-wheeler, personal, or credit card EMIs. Enter 0 if none.',
    whyWeAsk: 'Subtracted directly from your maximum debt capacity to find your available headroom for new borrowing.',
    type: 'currency',
    placeholder: 'e.g. 14,000 (enter 0 if no active loans)',
    min: 0,
    max: 1000000,
    isMustQuestion: true,
    affects: ['verdict', 'safeAmount', 'lenderAmount', 'emiCeiling'],
  },
  {
    id: 'hasHighCostDebt',
    section: 'existing_debt',
    title: 'Do you have active loans with interest rates above 24% (e.g. instant mobile apps, informal lenders)?',
    subtitle: 'High-cost short-term debt can trigger compounding repayment pressure.',
    whyWeAsk: 'Borrowing new money while carrying 30%+ high-cost debt risks compounding financial strain; restructuring is advised first.',
    type: 'boolean',
    isMustQuestion: true,
    affects: ['verdict', 'safeAmount', 'confidence'],
  },
  {
    id: 'highCostDebtOutstanding',
    section: 'existing_debt',
    title: 'What is the total outstanding balance on these high-cost app/informal loans?',
    subtitle: 'Approximate total principal remaining.',
    whyWeAsk: 'We check whether part of your borrowing should be prioritized to eliminate this high-cost debt first.',
    type: 'currency',
    placeholder: 'e.g. 35,000',
    condition: (p) => !!p.hasHighCostDebt,
    isMustQuestion: false,
    affects: ['verdict', 'safeAmount'],
  },
  {
    id: 'recentPaymentIssue',
    section: 'existing_debt',
    title: 'Have you had any missed or bounced loan/credit card payments in the last 6 months?',
    subtitle: 'Recent repayment history reflects current cash flow stress.',
    whyWeAsk: 'A recent missed payment is a strong warning sign of current repayment stress that warrants caution before adding new debt.',
    type: 'select',
    isMustQuestion: true,
    affects: ['verdict', 'fairRate', 'confidence'],
    options: [
      { label: 'Clean track record (All paid on time)', value: 'clean_no_issues', subtitle: 'Consistent on-time repayments' },
      { label: 'Minor delay once (Paid within 30 days)', value: 'minor_delay_past', subtitle: 'Single isolated delay' },
      { label: 'Recent bounce / Missed payment in last 6 months', value: 'recent_bounce_or_default', subtitle: 'Active repayment strain' },
      { label: 'Never taken a formal loan before (New to Credit)', value: 'no_prior_loans', subtitle: 'No prior formal credit bureau record' },
    ],
  },

  // ==========================================
  // SECTION 4: HOUSEHOLD AFFORDABILITY
  // ==========================================
  {
    id: 'monthlyEssentialExpenses',
    section: 'household',
    title: 'What are your monthly essential household expenses, excluding rent?',
    subtitle: 'Food, groceries, children’s school fees, utilities, medical, and transport. Do not include rent here.',
    whyWeAsk: 'We protect your non-negotiable living costs so that loan EMIs never force your family into hardship.',
    type: 'currency',
    placeholder: 'e.g. 20,000',
    min: 2000,
    max: 1000000,
    isMustQuestion: true,
    affects: ['verdict', 'safeAmount', 'emiCeiling', 'stressTest'],
  },
  {
    id: 'rent',
    section: 'household',
    title: 'How much do you pay in monthly house rent?',
    subtitle: 'Enter 0 if you own your home.',
    whyWeAsk: 'Rent is a fixed monthly obligation that directly reduces your available discretionary cash buffer.',
    type: 'currency',
    placeholder: 'e.g. 25,000 (0 if you own your home)',
    isMustQuestion: false,
    affects: ['safeAmount', 'stressTest'],
  },
  {
    id: 'dependentsCount',
    section: 'household',
    title: 'How many financial dependents rely on your income?',
    subtitle: 'Children, non-working spouse, or dependent parents.',
    whyWeAsk: 'Each dependent adds ₹4,000/mo to your estimated living cushion requirements.',
    type: 'number',
    placeholder: 'e.g. 2',
    min: 0,
    max: 20,
    isMustQuestion: false,
    affects: ['safeAmount', 'stressTest'],
  },

  // ==========================================
  // SECTION 5: CREDIT SCORE & SAFETY NET
  // ==========================================
  {
    id: 'creditScoreTier',
    section: 'credit_safety',
    title: 'Do you know your credit score?',
    subtitle: 'If unknown, choose "I don’t know". Unknown is NOT zero — we simply widen the rate band.',
    whyWeAsk: 'Known scores narrow your fair rate band; unverified scores widen the band to account for uncertainty without penalizing you.',
    type: 'select',
    isMustQuestion: true,
    affects: ['fairRate', 'lenderAmount', 'confidence'],
    options: [
      { label: 'Prime (750 or above)', value: 'prime_750_plus', subtitle: 'Typically associated with stronger pricing eligibility' },
      { label: 'Good (700 – 749)', value: 'good_700_749', subtitle: 'Generally qualifies for standard benchmark rates' },
      { label: 'Average (650 – 699)', value: 'average_650_699', subtitle: 'Often carries an additional risk spread' },
      { label: 'Below 650', value: 'poor_below_650', subtitle: 'Sub-prime or distressed credit history' },
      { label: "I don't know my credit score", value: 'unknown', subtitle: 'We widen the rate range and note verification uncertainty' },
    ],
  },
  {
    id: 'emergencySavingsMonths',
    section: 'credit_safety',
    title: 'How many months of living expenses do you have in emergency savings?',
    subtitle: 'Money in savings accounts, fixed deposits, or liquid funds. Enter 0 if none.',
    whyWeAsk: 'A smaller emergency buffer leaves less room to absorb an unexpected expense or income interruption without missing an EMI.',
    type: 'number',
    placeholder: 'e.g. 3 (enter 0 if none)',
    min: 0,
    max: 36,
    isMustQuestion: false,
    affects: ['verdict', 'confidence', 'stressTest'],
  },

  // ==========================================
  // SECTION 6: COLLATERAL & PRODUCTIVITY
  // ==========================================
  {
    id: 'collateralType',
    section: 'collateral_asset',
    title: 'Do you own unencumbered assets you could potentially pledge as collateral?',
    subtitle: 'Pledging property or gold can significantly lower your interest rate compared to personal loans.',
    whyWeAsk: 'Enables evaluation of secured loan options (like LAP/MSME) which typically offer lower interest and longer, comfortable repayment tenures.',
    type: 'select',
    isMustQuestion: false,
    affects: ['fairRate', 'lenderAmount', 'productRouting'],
    options: [
      { label: 'Residential or Commercial Property (Unencumbered)', value: 'property_residential_commercial', subtitle: 'House, flat, or shop you own fully' },
      { label: 'Physical Gold Jewelry', value: 'gold', subtitle: 'Instant collateral for gold loan' },
      { label: 'Vehicle / Commercial Machine', value: 'vehicle', subtitle: 'Hypothecated asset' },
      { label: 'No Collateral Available (Unsecured only)', value: 'none', subtitle: 'Rely purely on income profile' },
    ],
  },
  {
    id: 'collateralValue',
    section: 'collateral_asset',
    title: 'What is the approximate market value of this property / asset?',
    subtitle: 'Estimated market value in Rupees.',
    whyWeAsk: 'Allows estimating potential collateral-backed borrowing capacity (e.g. up to 60% LTV on property).',
    type: 'currency',
    placeholder: 'e.g. 45,00,000',
    condition: (p) => p.collateralType === 'property_residential_commercial' || p.collateralType === 'gold',
    isMustQuestion: false,
    affects: ['lenderAmount', 'fairRate', 'productRouting'],
  },
  {
    id: 'expectedMonthlyIncomeBenefit',
    section: 'collateral_asset',
    title: 'Will this loan increase your monthly income (e.g. delivery runs, machinery)?',
    subtitle: 'Estimated prospective monthly cash flow increase.',
    whyWeAsk: 'A productive asset may generate future cash flow, but this assessment does not treat unproven future income as guaranteed repayment capacity.',
    type: 'currency',
    placeholder: 'e.g. 8,000 (0 if pure consumption)',
    condition: (p) => p.loanPurpose === 'productive_asset' || p.loanPurpose === 'business_expansion',
    isMustQuestion: false,
    affects: ['safeAmount', 'emiCeiling'],
  },

  // ==========================================
  // SECTION 7: EXISTING LENDER OFFER (OPTIONAL)
  // ==========================================
  {
    id: 'hasExistingOffer',
    section: 'existing_offer',
    title: 'Have you already received a loan quote from a bank, agent, or app?',
    subtitle: 'If yes, enter the details and we will audit the quote against your fair profile range.',
    whyWeAsk: 'Allows us to generate a side-by-side audit and negotiation gap analysis on your Negotiation Card.',
    type: 'boolean',
    isMustQuestion: false,
    affects: ['confidence'],
  },
  {
    id: 'offeredInterestRate',
    section: 'existing_offer',
    title: 'What interest rate did the lender quote you?',
    subtitle: 'Annual nominal interest rate (%).',
    whyWeAsk: 'We compare this against your fair rate band to assess if the quote carries an above-market spread.',
    type: 'number',
    placeholder: 'e.g. 14.5',
    min: 5,
    max: 60,
    step: 0.1,
    condition: (p) => !!p.hasExistingOffer,
    isMustQuestion: false,
    affects: ['confidence'],
  },
  {
    id: 'offeredProcessingFeePercent',
    section: 'existing_offer',
    title: 'What processing fee did they quote?',
    subtitle: 'Percentage of loan amount (e.g. 2.0% or 3.0%).',
    whyWeAsk: 'Processing fees increase your effective all-in APR; we give you talking points to negotiate fee caps.',
    type: 'number',
    placeholder: 'e.g. 2.0',
    min: 0,
    max: 10,
    step: 0.1,
    condition: (p) => !!p.hasExistingOffer,
    isMustQuestion: false,
    affects: ['confidence'],
  },
];
