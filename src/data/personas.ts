import { PersonaPreset } from '../types/borrower';

export const TEST_PERSONAS: PersonaPreset[] = [
  {
    id: 'priya',
    name: 'Priya',
    age: 29,
    city: 'Bengaluru',
    personaType: 'salaried',
    tagline: 'Software Engineer at large MNC (5 yrs)',
    avatarInitials: 'P',
    description: 'Net ₹1,10,000/mo. One car loan EMI ₹14,000 (2 yrs left). CIBIL 780. Rents at ₹28,000. Wants ₹8,00,000 personal loan for wedding.',
    profile: {
      loanPurpose: 'wedding',
      loanType: 'personal',
      requestedAmount: 800000,
      incomeType: 'salaried',
      monthlyIncome: 110000,
      incomeStability: 'highly_stable',
      employmentOrBusinessTenureYears: 5,
      existingEmi: 14000,
      existingLoanCount: 1,
      hasHighCostDebt: false,
      recentPaymentIssue: 'clean_no_issues',
      monthlyEssentialExpenses: 18000, // Non-rent living expenses
      rent: 28000, // Monthly house rent (Total essential = ₹46,000)
      dependentsCount: 0,
      creditScoreTier: 'prime_750_plus',
      creditScoreExact: 780,
      emergencySavingsMonths: 4,
      collateralType: 'none',
      hasExistingOffer: false,
    },
    expectedHighlights: {
      verdict: 'BORROW (Borrowing appears manageable)',
      keyRecommendation: 'Safe capacity is ₹8L–12L on 36–48m tenure. While lenders may sanction up to ₹16L+, keep loan capped to wedding need.',
      fairRate: '9.25% – 14.50% APR',
      negotiationFocus: 'Demand Tier-1 salaried MNC rate, zero foreclosure charges, and cap processing fee at 1%.',
    },
  },
  {
    id: 'ravi',
    name: 'Ravi',
    age: 42,
    city: 'Mysuru',
    personaType: 'self_employed',
    tagline: 'Kirana Store Owner (14 yrs)',
    avatarInitials: 'R',
    description: 'Kirana store for 14 yrs. Cash income ₹40k–80k/mo (ITR ₹4.2L/yr). Owns ₹45L unencumbered shop premises. No prior formal loans (no CIBIL). Wife earns ₹18k teaching. Wants ₹15,00,000 for stock + delivery vehicle.',
    profile: {
      loanPurpose: 'business_expansion',
      loanType: 'business_unsecured', // Initially requested unsecured, system routes to LAP
      requestedAmount: 1500000,
      incomeType: 'self_employed',
      monthlyIncome: 60000, // Midpoint of ₹40k-80k
      lowMonthIncome: 40000,
      incomeStability: 'variable',
      employmentOrBusinessTenureYears: 14,
      declaredAnnualIncomeITR: 420000, // ₹4.2L/yr
      spouseOrCoApplicantIncome: 18000, // Wife's teaching income (distinct co-applicant capacity)
      existingEmi: 0,
      existingLoanCount: 0,
      hasHighCostDebt: false,
      recentPaymentIssue: 'no_prior_loans',
      monthlyEssentialExpenses: 28000, // Non-rent living expenses
      rent: 0, // Owns shop and home
      dependentsCount: 2,
      creditScoreTier: 'unknown', // Never taken formal loan
      emergencySavingsMonths: 2,
      collateralType: 'property_residential_commercial',
      collateralValue: 4500000, // ₹45 Lakhs unencumbered
      collateralEncumbered: false,
      expectedMonthlyIncomeBenefit: 12000, // Prospective stock line boost (not treated as guaranteed current cashflow)
      hasExistingOffer: false,
    },
    expectedHighlights: {
      verdict: 'COMPARE SECURED LAP ROUTE',
      keyRecommendation: 'Do NOT take 22% unsecured business loan. Pledging unencumbered shop unlocks MSME LAP at 9.0–11.5% with spouse co-applicant.',
      fairRate: '9.00% – 14.50% APR (Secured LAP)',
      negotiationFocus: 'Leverage 14-year vintage, unencumbered commercial asset, and spouse teaching income for 7–10 year term.',
    },
  },
  {
    id: 'anita',
    name: 'Anita',
    age: 35,
    city: 'Hubballi',
    personaType: 'informal',
    tagline: 'Delivery Rider & Home Tailor (Informal Gig)',
    avatarInitials: 'A',
    description: 'Delivery rider + tailoring (₹26k–30k/mo). 2 children, husband unemployed 8 months. 3 instant app loans (₹35k outstanding at 30%+), 1 bounced EMI last month. Wants ₹1,50,000 for EV scooter to double delivery runs.',
    profile: {
      loanPurpose: 'productive_asset',
      loanType: 'two_wheeler',
      requestedAmount: 150000,
      incomeType: 'informal_gig',
      monthlyIncome: 28000, // Midpoint of ₹26k-30k
      lowMonthIncome: 24000,
      incomeStability: 'unpredictable',
      employmentOrBusinessTenureYears: 2,
      existingEmi: 4200, // Ongoing app loan repayments
      existingLoanCount: 3,
      hasHighCostDebt: true, // 30%+ app loans
      highCostDebtOutstanding: 35000,
      recentPaymentIssue: 'recent_bounce_or_default', // 1 bounce last month
      monthlyEssentialExpenses: 16000, // Non-rent living expenses (2 kids + unemployed spouse)
      rent: 6000, // Monthly house rent (Total essential = ₹22,000)
      dependentsCount: 3, // 2 kids + spouse
      creditScoreTier: 'poor_below_650', // Distressed
      emergencySavingsMonths: 0,
      collateralType: 'vehicle', // Intended asset
      collateralValue: 150000,
      collateralEncumbered: false,
      expectedMonthlyIncomeBenefit: 8000, // Prospective delivery runs boost
      hasExistingOffer: true,
      offeredInterestRate: 32.0, // Predatory app quote
      offeredProcessingFeePercent: 4.0,
      offeredTenureMonths: 12,
      offeredEmi: 15800,
    },
    expectedHighlights: {
      verdict: "DON'T BORROW / STABILIZE DEBT FIRST",
      keyRecommendation: 'High risk of debt distress. Stop borrowing from instant apps at 30%+. Pay off ₹35k overdue first, or seek formal EV priority sector financing.',
      fairRate: '16.50% – 26.50% APR (Asset-backed 2W Scheme only)',
      negotiationFocus: 'Reject 30%+ unsecured instant app offers. Require vehicle hypothecation on 3-year term.',
    },
  },
];
