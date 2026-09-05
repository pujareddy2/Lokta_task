import React from 'react';
import { Shield, Printer, ArrowLeft, CheckCircle2, AlertTriangle, HelpCircle, FileText, Sparkles } from 'lucide-react';
import { DecisionResult, BorrowerProfile } from '../../types/borrower';
import { formatINR } from '../../utils/currency';
import { ConfidenceBadge } from '../common/ConfidenceBadge';

interface NegotiationCardProps {
  decision: DecisionResult;
  profile: BorrowerProfile;
  onBack: () => void;
}

export const NegotiationCard: React.FC<NegotiationCardProps> = ({ decision, profile, onBack }) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-3xl mx-auto w-full pb-12">
      {/* Top Action Bar */}
      <div className="no-print flex items-center justify-between gap-4 mb-6">
        <button
          type="button"
          onClick={onBack}
          className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 border border-slate-700 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Full Analysis
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="px-4 py-2 rounded-xl bg-brand-600 text-white hover:bg-brand-500 shadow-md shadow-brand-900/30 text-xs font-semibold flex items-center gap-2 transition-all"
        >
          <Printer className="w-4 h-4" /> Print / Save PDF Card
        </button>
      </div>

      {/* The Printable 1-Page Negotiation Card Container */}
      <div className="negotiation-card-container bg-slate-900 border-2 border-brand-500/80 rounded-2xl p-6 sm:p-8 shadow-float text-slate-100 print:bg-white print:text-slate-900 print:border-slate-300">
        {/* Card Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800 print:border-slate-300">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold shadow-md">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-extrabold tracking-tight text-white print:text-slate-900">
                  BORROWER NEGOTIATION CARD
                </h1>
                <span className="text-[10px] font-bold uppercase tracking-wider bg-brand-950 text-brand-300 border border-brand-800 px-2 py-0.5 rounded print:bg-slate-100 print:text-slate-700 print:border-slate-400">
                  Verified Summary
                </span>
              </div>
              <p className="text-xs text-slate-400 print:text-slate-600 font-medium">
                Self-Assessment Decision Support • Indian Retail Lending Benchmark
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ConfidenceBadge level={decision.confidence} score={decision.confidenceScore} showScore />
          </div>
        </div>

        {/* Loan Meta Details */}
        <div className="py-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs border-b border-slate-800 print:border-slate-300">
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Product:</span>
            <strong className="text-white print:text-slate-900">{decision.recommendedProductLabel}</strong>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Target Need:</span>
            <strong className="text-white print:text-slate-900">{formatINR(profile.requestedAmount)}</strong>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Borrower Profile:</span>
            <strong className="text-white print:text-slate-900 capitalize">{profile.incomeType.replace('_', ' ')}</strong>
          </div>
          <div>
            <span className="text-slate-400 print:text-slate-600 block">Primary Verdict:</span>
            <strong className={`font-bold ${decision.verdict === 'DONT_BORROW' ? 'text-rose-400 print:text-rose-600' : 'text-emerald-400 print:text-emerald-700'}`}>
              {decision.verdictTitle}
            </strong>
          </div>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="my-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Box 1: Safe Amount */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
              1. Recommended Safe Principal
            </span>
            <div className="text-2xl font-extrabold text-white print:text-slate-900 mt-1">
              {decision.safeBorrowerAmountMax === 0
                ? '₹0 (Stabilize Debt First)'
                : `${formatINR(decision.safeBorrowerAmountMin)} – ${formatINR(decision.safeBorrowerAmountMax)}`}
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
              Lenders may model capacity up to {formatINR(decision.likelyLenderSanctionMax)}, but anchor on safe capacity.
            </p>
          </div>

          {/* Box 2: Fair Rate Band */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
              2. Fair Interest Rate Band
            </span>
            <div className="text-2xl font-extrabold text-brand-400 print:text-brand-700 mt-1">
              {decision.fairRateLow.toFixed(2)}% – {decision.fairRateHigh.toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
              Reducing balance benchmark for your profile risk tier.
            </p>
          </div>

          {/* Box 3: True APR */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
              3. Estimated All-In APR
            </span>
            <div className="text-2xl font-extrabold text-emerald-400 print:text-emerald-700 mt-1">
              {decision.estimatedAprLow.toFixed(2)}% – {decision.estimatedAprHigh.toFixed(2)}%
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
              Includes ~{decision.standardProcessingFeePercent}% processing fee + 18% GST amortized.
            </p>
          </div>

          {/* Box 4: EMI Ceiling */}
          <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 print:bg-slate-50 print:border-slate-300">
            <span className="text-[11px] font-semibold text-slate-400 print:text-slate-600 uppercase tracking-wider block">
              4. Safe Monthly EMI Ceiling
            </span>
            <div className="text-2xl font-extrabold text-white print:text-slate-900 mt-1">
              Do Not Cross {formatINR(decision.safeEmiCeiling)}
              <span className="text-xs font-normal text-slate-400">/mo</span>
            </div>
            <p className="text-[11px] text-slate-400 print:text-slate-600 mt-1">
              Guarantees household living expenses and debt buffer are preserved.
            </p>
          </div>
        </div>

        {/* Existing Offer Audit (If provided) */}
        {decision.offerComparison && (
          <div className="mb-6 p-4 rounded-xl bg-slate-950 border border-brand-500/50 print:bg-slate-50 print:border-slate-400">
            <div className="flex items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold uppercase tracking-wider text-brand-300 print:text-brand-800 flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" /> Lender Quote Audit vs Fair Benchmark
              </span>
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${decision.offerComparison.verdict === 'PREDATORY' ? 'bg-rose-950 text-rose-400 border border-rose-800' : decision.offerComparison.verdict === 'HIGH' ? 'bg-amber-950 text-amber-400 border border-amber-800' : 'bg-emerald-950 text-emerald-400 border border-emerald-800'}`}>
                {decision.offerComparison.verdict === 'PREDATORY' ? 'SIGNIFICANTLY ABOVE BENCHMARK' : decision.offerComparison.verdict === 'HIGH' ? 'ABOVE BENCHMARK' : 'IN BENCHMARK RANGE'}
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2 text-xs text-center py-2 bg-slate-900/80 rounded-lg print:bg-white print:border print:border-slate-200">
              <div>
                <span className="text-slate-400 block text-[10px]">Lender Quoted:</span>
                <strong className="text-rose-400 text-sm">{decision.offerComparison.offeredRate}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Your Fair Midpoint:</span>
                <strong className="text-emerald-400 text-sm">{decision.offerComparison.fairRateMidpoint}%</strong>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px]">Negotiation Gap:</span>
                <strong className="text-amber-400 text-sm">+{decision.offerComparison.differenceBps} bps</strong>
              </div>
            </div>
            <p className="text-xs text-slate-300 print:text-slate-700 mt-2 font-medium">
              {decision.offerComparison.verdictText} Potential total interest savings if negotiated: <strong>{formatINR(decision.offerComparison.potentialSavingsTotal)}</strong>.
            </p>
          </div>
        )}

        {/* Branch Negotiation Ammunition */}
        <div className="mb-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300 print:text-slate-800 mb-3 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-brand-400" />
            <span>Branch Negotiation Leverage Points (Hold this up to the lender)</span>
          </h3>

          <div className="space-y-2">
            {decision.negotiationPoints.map((pt, i) => (
              <div
                key={i}
                className="p-3 rounded-lg bg-slate-950/60 border border-slate-800/80 print:bg-slate-50 print:border-slate-200 flex items-start gap-2.5 text-xs"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0 mt-1.5" />
                <div className="flex-1">
                  <strong className="text-slate-200 print:text-slate-900 font-semibold">{pt.title}: </strong>
                  <span className="text-slate-300 print:text-slate-700">{pt.description}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* What to Demand From the Lender */}
        <div className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 print:bg-slate-100 print:border-slate-300 text-xs">
          <h4 className="font-bold text-slate-200 print:text-slate-900 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-emerald-400" />
            <span>Direct Questions to Ask the Loan Officer:</span>
          </h4>
          <ul className="space-y-1.5 text-slate-300 print:text-slate-700 list-disc pl-5">
            <li>"Can you provide a quote within my assessed fair-rate range of {decision.fairRateLow.toFixed(2)}% – {decision.fairRateHigh.toFixed(2)}%?"</li>
            <li>"Can you provide the written Key Fact Statement (KFS) showing the complete all-in APR including all fees?"</li>
            <li>"What is the total fee breakup including processing charges, insurance, documentation, and GST?"</li>
            <li>"Can you cap the processing fee to {decision.standardProcessingFeePercent}% or lower?"</li>
            <li>"Will there be any foreclosure charges or prepayment penalties if I close this loan early?"</li>
            <li>"Is this quote on a fixed or reducing floating interest rate?"</li>
          </ul>
        </div>

        {/* Card Footer */}
        <div className="mt-6 pt-4 border-t border-slate-800 print:border-slate-300 flex items-center justify-between text-[10px] text-slate-400 print:text-slate-500">
          <span>Borrower Copilot • Client-Side Confidential Assessment</span>
          <span>Decision support guidance; not a binding credit sanction.</span>
        </div>
      </div>
    </div>
  );
};
