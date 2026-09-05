import React from 'react';
import { CheckCircle, AlertTriangle, XCircle, ArrowRightLeft, Shield } from 'lucide-react';
import { PrimaryVerdict } from '../../types/borrower';

interface VerdictBannerProps {
  verdict: PrimaryVerdict;
  title: string;
  summary: string;
  rationale: string[];
  productRoutingReason?: string;
}

export const VerdictBanner: React.FC<VerdictBannerProps> = ({
  verdict,
  title,
  summary,
  rationale,
  productRoutingReason,
}) => {
  let config = {
    bg: 'bg-emerald-950/40 border-emerald-700/60 text-emerald-300',
    badgeBg: 'bg-emerald-900/80 text-emerald-300 border-emerald-600/60',
    icon: <CheckCircle className="w-8 h-8 text-emerald-400 shrink-0" />,
    label: 'SHOULD YOU BORROW?',
  };

  if (verdict === 'DONT_BORROW') {
    config = {
      bg: 'bg-rose-950/40 border-rose-700/60 text-rose-300',
      badgeBg: 'bg-rose-900/80 text-rose-300 border-rose-600/60',
      icon: <XCircle className="w-8 h-8 text-rose-400 shrink-0" />,
      label: 'SHOULD YOU BORROW?',
    };
  } else if (verdict === 'BORROW_LESS') {
    config = {
      bg: 'bg-amber-950/40 border-amber-700/60 text-amber-300',
      badgeBg: 'bg-amber-900/80 text-amber-300 border-amber-600/60',
      icon: <AlertTriangle className="w-8 h-8 text-amber-400 shrink-0" />,
      label: 'SHOULD YOU BORROW?',
    };
  } else if (verdict === 'CHANGE_PRODUCT_FIRST') {
    config = {
      bg: 'bg-cyan-950/40 border-cyan-700/60 text-cyan-300',
      badgeBg: 'bg-cyan-900/80 text-cyan-300 border-cyan-600/60',
      icon: <ArrowRightLeft className="w-8 h-8 text-cyan-400 shrink-0" />,
      label: 'BETTER PRODUCT ROUTE AVAILABLE',
    };
  }

  return (
    <div className={`p-6 sm:p-8 rounded-2xl border backdrop-blur-sm ${config.bg} shadow-card`}>
      <div className="flex flex-col sm:flex-row items-start gap-5">
        <div className="p-3 rounded-2xl bg-slate-900/60 border border-slate-700/50 shadow-inner">
          {config.icon}
        </div>
        <div className="flex-1">
          <div className="flex flex-wrap items-center gap-2 mb-2">
            <span className={`text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${config.badgeBg}`}>
              {config.label}
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Output 1 of 4 • Final Verdict
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-tight">
            {title}
          </h1>

          <p className="mt-2 text-base text-slate-200 leading-relaxed font-medium">
            {summary}
          </p>

          {/* Rationale Bullet Points */}
          {rationale && rationale.length > 0 && (
            <div className="mt-4 pt-4 border-t border-slate-700/40 space-y-2">
              {rationale.map((r, i) => (
                <div key={i} className="flex items-start gap-2 text-xs sm:text-sm text-slate-300">
                  <span className="w-1.5 h-1.5 rounded-full bg-slate-400 shrink-0 mt-2" />
                  <span className="leading-relaxed">{r}</span>
                </div>
              ))}
            </div>
          )}

          {productRoutingReason && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900/70 border border-cyan-700/50 text-xs text-cyan-200 flex items-start gap-2.5">
              <Shield className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
              <span>{productRoutingReason}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
