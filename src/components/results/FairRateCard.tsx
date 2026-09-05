import React from 'react';
import { Percent, Info, HelpCircle } from 'lucide-react';
import { formatPercent } from '../../utils/formatting';

interface FairRateCardProps {
  fairRateLow: number;
  fairRateHigh: number;
  estimatedAprLow: number;
  estimatedAprHigh: number;
  rateReason: string;
  aprReason: string;
  processingFeePercent: number;
}

export const FairRateCard: React.FC<FairRateCardProps> = ({
  fairRateLow,
  fairRateHigh,
  estimatedAprLow,
  estimatedAprHigh,
  rateReason,
  aprReason,
  processingFeePercent,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 border border-brand-800/60 px-2.5 py-0.5 rounded-full">
          Output 3 of 4
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
          What is a Fair Interest Rate & True APR for You?
        </h2>
        <p className="text-xs text-slate-400 mt-1">
          Always evaluate the all-in APR (including fees & GST) rather than just the headline interest rate.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Nominal Rate Band */}
        <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Percent className="w-4 h-4 text-brand-400" />
              <span>Fair Nominal Interest Rate</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
              {fairRateLow.toFixed(2)}% – {fairRateHigh.toFixed(2)}%
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {rateReason}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 text-brand-400 shrink-0" />
            <span>Reducing balance benchmark for your profile.</span>
          </div>
        </div>

        {/* All-In APR Band */}
        <div className="bg-slate-900/90 border border-brand-500/50 rounded-xl p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center gap-2 text-brand-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <HelpCircle className="w-4 h-4 text-brand-400" />
              <span>Estimated All-In APR (True Cost)</span>
            </div>
            <div className="text-3xl sm:text-4xl font-extrabold text-brand-300 tracking-tight">
              {estimatedAprLow.toFixed(2)}% – {estimatedAprHigh.toFixed(2)}%
            </div>
            <p className="text-xs text-slate-300 mt-2.5 leading-relaxed">
              {aprReason}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-brand-400/90 flex items-center gap-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>Includes ~{processingFeePercent}% processing fee + 18% GST amortized.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
