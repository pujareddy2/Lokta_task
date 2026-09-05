import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, ShieldCheck, AlertCircle } from 'lucide-react';
import { DecisionResult } from '../../types/borrower';
import { ConfidenceBadge } from '../common/ConfidenceBadge';
import { formatINR } from '../../utils/currency';

interface WhyThisResultProps {
  decision: DecisionResult;
}

export const WhyThisResult: React.FC<WhyThisResultProps> = ({ decision }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 shadow-card">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between gap-4 text-left focus:outline-none group"
      >
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-brand-950 text-brand-400 border border-brand-800/60">
            <HelpCircle className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white group-hover:text-brand-300 transition-colors">
              Explainability: How Was Every Number Calculated?
            </h3>
            <p className="text-xs text-slate-400">
              Complete traceable breakdown of rules, FOIR debt headroom, rate spreads, and model confidence.
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <ConfidenceBadge level={decision.confidence} score={decision.confidenceScore} showScore />
          {isOpen ? (
            <ChevronUp className="w-5 h-5 text-slate-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-slate-400" />
          )}
        </div>
      </button>

      {isOpen && (
        <div className="mt-6 pt-6 border-t border-slate-700/80 space-y-6 text-xs text-slate-300 animate-fadeIn">
          {/* Output 1 Rationale */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1 text-brand-400">
              1. Decision Verdict Rationale
            </h4>
            <ul className="list-disc pl-5 space-y-1 text-slate-300">
              {decision.verdictRationale.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          {/* Output 2 Amount Logic */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1 text-brand-400">
              2. Borrowing Amount Separation (Lender-Facing vs Safe Capacity)
            </h4>
            <p className="leading-relaxed">
              <strong>Estimated Lender-Facing Capacity:</strong> {decision.likelyLenderSanctionReason}
            </p>
            <p className="leading-relaxed mt-1">
              <strong>Safe Borrower Carrying Capacity:</strong> {decision.safeBorrowerAmountReason}
            </p>
          </div>

          {/* Output 3 Rate Benchmark */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1 text-brand-400">
              3. Fair Interest Rate & True APR Benchmark
            </h4>
            <p className="leading-relaxed">{decision.fairRateBenchmarkReason}</p>
            <p className="leading-relaxed mt-1">{decision.aprComponentsReason}</p>
          </div>

          {/* Output 4 EMI Ceiling */}
          <div>
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-1 text-brand-400">
              4. Safe EMI & Cashflow Constraints
            </h4>
            <p className="leading-relaxed">{decision.emiCeilingReason}</p>
            <p className="leading-relaxed mt-1">
              <strong>Household Cash Accounting:</strong> Recognized income ({formatINR(decision.householdIncomeConsidered)}) minus existing debt and ₹{decision.totalEssentialHouseholdExpenses.toLocaleString('en-IN')} essential expenses leaves ₹{decision.residualMonthlyCash.toLocaleString('en-IN')}/mo residual cash buffer.
            </p>
          </div>

          {/* Confidence & Disclosures */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <h4 className="font-bold text-slate-200 uppercase tracking-wider text-[11px] mb-2 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-brand-400" />
              <span>Model Confidence Breakdown ({decision.confidence})</span>
            </h4>
            {decision.confidenceReasons.length > 0 && (
              <div className="mb-2">
                <span className="text-slate-400 font-semibold">Supporting Predictability Factors:</span>
                <ul className="list-disc pl-5 space-y-0.5 text-slate-300 mt-1">
                  {decision.confidenceReasons.map((r, i) => (
                    <li key={i}>{r}</li>
                  ))}
                </ul>
              </div>
            )}
            {decision.uncertaintyDisclosures.length > 0 && (
              <div>
                <span className="text-amber-400 font-semibold flex items-center gap-1">
                  <AlertCircle className="w-3.5 h-3.5" /> Uncertainty & Range-Widening Disclosures:
                </span>
                <ul className="list-disc pl-5 space-y-0.5 text-amber-200/90 mt-1">
                  {decision.uncertaintyDisclosures.map((d, i) => (
                    <li key={i}>{d}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
