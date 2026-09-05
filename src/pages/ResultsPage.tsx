import React from 'react';
import { Sparkles, FileText, ArrowLeft, RefreshCw } from 'lucide-react';
import { DecisionResult, BorrowerProfile } from '../types/borrower';
import { VerdictBanner } from '../components/results/VerdictBanner';
import { AmountSplitCard } from '../components/results/AmountSplitCard';
import { FairRateCard } from '../components/results/FairRateCard';
import { EmiCeilingCard } from '../components/results/EmiCeilingCard';
import { StressTestCard } from '../components/results/StressTestCard';
import { WhyThisResult } from '../components/results/WhyThisResult';

interface ResultsPageProps {
  decision: DecisionResult;
  profile: BorrowerProfile;
  onOpenNegotiationCard: () => void;
  onEditAnswers: () => void;
  onRestart: () => void;
}

export const ResultsPage: React.FC<ResultsPageProps> = ({
  decision,
  profile,
  onOpenNegotiationCard,
  onEditAnswers,
  onRestart,
}) => {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-10 space-y-8">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-400 bg-brand-950 px-2 py-0.5 rounded border border-brand-800">
              Assessment Results
            </span>
            <span className="text-xs text-slate-400">• All 4 Decisions Generated</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight mt-1">
            Your Loan Decision Blueprint
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onEditAnswers}
            className="px-3.5 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 text-xs font-semibold transition-all border border-slate-700 flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Edit Answers
          </button>

          <button
            type="button"
            onClick={onOpenNegotiationCard}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 text-xs font-bold transition-all shadow-md shadow-emerald-900/30 flex items-center gap-2"
          >
            <FileText className="w-4 h-4" />
            <span>Open Negotiation Card</span>
          </button>
        </div>
      </div>

      {/* Output 1: Verdict */}
      <VerdictBanner
        verdict={decision.verdict}
        title={decision.verdictTitle}
        summary={decision.verdictSummary}
        rationale={decision.verdictRationale}
        productRoutingReason={decision.productRoutingReason}
      />

      {/* Output 2: Maximum Amount (Lender vs Safe) */}
      <AmountSplitCard
        lenderMin={decision.likelyLenderSanctionMin}
        lenderMax={decision.likelyLenderSanctionMax}
        lenderReason={decision.likelyLenderSanctionReason}
        safeMin={decision.safeBorrowerAmountMin}
        safeMax={decision.safeBorrowerAmountMax}
        safeReason={decision.safeBorrowerAmountReason}
        requestedAmount={profile.requestedAmount}
      />

      {/* Output 3: Fair Interest Rate & True APR */}
      <FairRateCard
        fairRateLow={decision.fairRateLow}
        fairRateHigh={decision.fairRateHigh}
        estimatedAprLow={decision.estimatedAprLow}
        estimatedAprHigh={decision.estimatedAprHigh}
        rateReason={decision.fairRateBenchmarkReason}
        aprReason={decision.aprComponentsReason}
        processingFeePercent={decision.standardProcessingFeePercent}
      />

      {/* Output 4: Monthly Outflow Ceiling & Multi-Tenure Table */}
      <EmiCeilingCard
        safeEmiCeiling={decision.safeEmiCeiling}
        emiReason={decision.emiCeilingReason}
        borrowerIndividualIncome={decision.borrowerIndividualIncome}
        householdIncomeConsidered={decision.householdIncomeConsidered}
        hasCoApplicantIncome={decision.hasCoApplicantIncome}
        coApplicantIncomeAmount={decision.coApplicantIncomeAmount}
        totalEssentialExpenses={decision.totalEssentialHouseholdExpenses}
        currentFoirPercent={decision.currentFoirPercent}
        maxFoirPercent={decision.maxPermissibleFoirPercent}
        residualMonthlyCash={decision.residualMonthlyCash}
        tenureOptions={decision.tenureOptions}
      />

      {/* Stress Testing Section */}
      <StressTestCard scenarios={decision.stressScenarios} />

      {/* Explainability & Confidence Deep-Dive */}
      <WhyThisResult decision={decision} />

      {/* Bottom CTA */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-slate-900 to-brand-950 border border-brand-800/80 text-center space-y-4">
        <h3 className="text-xl font-bold text-white tracking-tight">
          Ready to Walk into the Branch?
        </h3>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          Open your 1-page Negotiation Card to hold up your verified fair-rate band, fee caps, and exact negotiation talking points.
        </p>
        <button
          type="button"
          onClick={onOpenNegotiationCard}
          className="px-8 py-3.5 rounded-xl bg-brand-600 text-white font-bold text-sm hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/40 inline-flex items-center gap-2"
        >
          <FileText className="w-4 h-4" />
          <span>Generate Negotiation Card</span>
        </button>
      </div>
    </div>
  );
};
