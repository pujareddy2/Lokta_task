import React, { useState, useMemo } from 'react';
import { BorrowerProfile, DecisionResult, PersonaPreset } from './types/borrower';
import { Header } from './components/common/Header';
import { Footer } from './components/common/Footer';
import { LandingPage } from './pages/LandingPage';
import { AssessmentPage } from './pages/AssessmentPage';
import { ResultsPage } from './pages/ResultsPage';
import { NegotiationPage } from './pages/NegotiationPage';
import { evaluateBorrower } from './rules/decision';

const DEFAULT_PROFILE: Partial<BorrowerProfile> = {
  loanPurpose: 'consumption_lifestyle',
  loanType: 'personal',
  requestedAmount: 500000,
  incomeType: 'salaried',
  monthlyIncome: 60000,
  incomeStability: 'moderate',
  existingEmi: 0,
  hasHighCostDebt: false,
  recentPaymentIssue: 'clean_no_issues',
  monthlyEssentialExpenses: 25000,
  creditScoreTier: 'unknown',
  collateralType: 'none',
  hasExistingOffer: false,
};

export const App: React.FC = () => {
  const [currentPage, setCurrentPage] = useState<'landing' | 'assessment' | 'results' | 'negotiation'>('landing');
  const [profile, setProfile] = useState<Partial<BorrowerProfile>>(DEFAULT_PROFILE);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [activePersona, setActivePersona] = useState<PersonaPreset | null>(null);

  // Compute live decision object whenever profile is complete
  const decision: DecisionResult | null = useMemo(() => {
    // Fill any missing optional fields with safe defaults before rules evaluation
    const completeProfile: BorrowerProfile = {
      loanPurpose: profile.loanPurpose || 'consumption_lifestyle',
      loanType: profile.loanType || 'personal',
      requestedAmount: profile.requestedAmount || 100000,
      incomeType: profile.incomeType || 'salaried',
      monthlyIncome: profile.monthlyIncome || 30000,
      lowMonthIncome: profile.lowMonthIncome,
      incomeStability: profile.incomeStability || 'moderate',
      employmentOrBusinessTenureYears: profile.employmentOrBusinessTenureYears,
      declaredAnnualIncomeITR: profile.declaredAnnualIncomeITR,
      spouseOrCoApplicantIncome: profile.spouseOrCoApplicantIncome,
      existingEmi: profile.existingEmi || 0,
      existingLoanCount: profile.existingLoanCount,
      hasHighCostDebt: profile.hasHighCostDebt || false,
      highCostDebtOutstanding: profile.highCostDebtOutstanding,
      recentPaymentIssue: profile.recentPaymentIssue || 'clean_no_issues',
      monthlyEssentialExpenses: profile.monthlyEssentialExpenses || 15000,
      rent: profile.rent,
      dependentsCount: profile.dependentsCount,
      creditScoreTier: profile.creditScoreTier || 'unknown',
      creditScoreExact: profile.creditScoreExact,
      emergencySavingsMonths: profile.emergencySavingsMonths,
      collateralType: profile.collateralType || 'none',
      collateralValue: profile.collateralValue,
      collateralEncumbered: profile.collateralEncumbered,
      expectedMonthlyIncomeBenefit: profile.expectedMonthlyIncomeBenefit,
      hasExistingOffer: profile.hasExistingOffer || false,
      offeredInterestRate: profile.offeredInterestRate,
      offeredProcessingFeePercent: profile.offeredProcessingFeePercent,
      offeredTenureMonths: profile.offeredTenureMonths,
      offeredEmi: profile.offeredEmi,
    };

    return evaluateBorrower(completeProfile);
  }, [profile]);

  const handleUpdateAnswer = (field: keyof BorrowerProfile, value: any) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSelectPersona = (persona: PersonaPreset) => {
    setActivePersona(persona);
    setProfile(persona.profile);
    setCurrentQuestionIndex(0);
    setCurrentPage('results');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleStartFresh = () => {
    setActivePersona(null);
    setProfile(DEFAULT_PROFILE);
    setCurrentQuestionIndex(0);
    setCurrentPage('assessment');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    setActivePersona(null);
    setProfile(DEFAULT_PROFILE);
    setCurrentQuestionIndex(0);
    setCurrentPage('landing');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-900 text-slate-100 selection:bg-brand-500/30 selection:text-white">
      <Header
        currentPage={currentPage}
        onNavigate={(page) => {
          setCurrentPage(page);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onSelectPersona={handleSelectPersona}
        onReset={handleRestart}
        hasActiveAssessment={currentPage !== 'landing'}
      />

      <main className="flex-1 flex flex-col">
        {currentPage === 'landing' && (
          <LandingPage
            onStartFresh={handleStartFresh}
            onSelectPersona={handleSelectPersona}
          />
        )}

        {currentPage === 'assessment' && (
          <AssessmentPage
            profile={profile}
            onUpdateAnswer={handleUpdateAnswer}
            currentQuestionIndex={currentQuestionIndex}
            onSetQuestionIndex={setCurrentQuestionIndex}
            onComplete={() => {
              setCurrentPage('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {currentPage === 'results' && decision && (
          <ResultsPage
            decision={decision}
            profile={profile as BorrowerProfile}
            onOpenNegotiationCard={() => {
              setCurrentPage('negotiation');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onEditAnswers={() => {
              setCurrentPage('assessment');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onRestart={handleRestart}
          />
        )}

        {currentPage === 'negotiation' && decision && (
          <NegotiationPage
            decision={decision}
            profile={profile as BorrowerProfile}
            onBackToResults={() => {
              setCurrentPage('results');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default App;
