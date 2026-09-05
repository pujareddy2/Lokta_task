import React from 'react';
import { Building2, ShieldCheck, AlertCircle } from 'lucide-react';
import { formatINR } from '../../utils/currency';

interface AmountSplitCardProps {
  lenderMin: number;
  lenderMax: number;
  lenderReason: string;
  safeMin: number;
  safeMax: number;
  safeReason: string;
  requestedAmount: number;
}

export const AmountSplitCard: React.FC<AmountSplitCardProps> = ({
  lenderMin,
  lenderMax,
  lenderReason,
  safeMin,
  safeMax,
  safeReason,
  requestedAmount,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-card">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <div>
          <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 border border-brand-800/60 px-2.5 py-0.5 rounded-full">
            Output 2 of 4
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
            How Much Are You Really Eligible For?
          </h2>
        </div>
        <div className="text-right">
          <span className="text-xs text-slate-400">Target Requested:</span>
          <p className="text-base font-bold text-white">{formatINR(requestedAmount)}</p>
        </div>
      </div>

      {/* Two Column Split Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Card 1: Estimated Lender-Facing Capacity */}
        <div className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="absolute top-0 right-0 w-24 h-24 bg-slate-800/20 rounded-full blur-xl pointer-events-none" />
          <div>
            <div className="flex items-center gap-2 text-slate-400 text-xs font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4 text-slate-400" />
              <span>Estimated Lender-Facing Borrowing Range</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-slate-200 tracking-tight">
              {formatINR(lenderMin)} – {formatINR(lenderMax)}
            </div>
            <p className="text-xs text-slate-400 mt-2 leading-relaxed">
              {lenderReason}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-slate-800 text-[11px] text-slate-400 flex items-start gap-1.5">
            <AlertCircle className="w-3.5 h-3.5 shrink-0 text-slate-400 mt-0.5" />
            <span className="leading-snug">
              Illustrative estimate based on standard commercial lending models. Actual approval depends on lender underwriting and policy.
            </span>
          </div>
        </div>

        {/* Card 2: Safe Borrower Amount (Highlighted) */}
        <div className="bg-emerald-950/40 border-2 border-emerald-500/80 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between shadow-lg shadow-emerald-950/20">
          <div className="absolute top-3 right-3">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-emerald-500 text-slate-950 px-2 py-0.5 rounded-full shadow-sm">
              Recommended Target
            </span>
          </div>
          <div>
            <div className="flex items-center gap-2 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Safe Carrying Capacity for You</span>
            </div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {safeMax === 0 ? '₹0 (Stabilize Debt First)' : `${formatINR(safeMin)} – ${formatINR(safeMax)}`}
            </div>
            <p className="text-xs text-emerald-200/80 mt-2 leading-relaxed">
              {safeReason}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-emerald-800/40 text-[11px] text-emerald-300 font-medium flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 shrink-0 text-emerald-400" />
            <span>A lender may offer more than you should safely take. Anchor on this safe limit.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
