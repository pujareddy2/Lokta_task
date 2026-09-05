import React from 'react';
import { ShieldAlert, Lock, BookOpen } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-800/80 bg-slate-950 py-8 px-4 sm:px-6 text-xs text-slate-400 mt-auto">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-start gap-3 max-w-2xl">
          <ShieldAlert className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <p className="leading-relaxed text-slate-400">
            <strong className="text-slate-300">Decision-Support Notice:</strong> Borrower Copilot provides analytical guidance based on your self-reported numbers, standard Indian FOIR affordability models, and benchmark lending rates. It does not constitute formal loan approval, underwriting, or a binding credit offer.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-400 text-xs">
          <div className="flex items-center gap-1.5 text-emerald-400">
            <Lock className="w-3.5 h-3.5" />
            <span>Zero server storage</span>
          </div>
          <div className="flex items-center gap-1.5 text-slate-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>RBI Fair Practices Aligned</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
