import React from 'react';
import { ShieldCheck, ShieldAlert, AlertCircle } from 'lucide-react';
import { ConfidenceLevel } from '../../types/borrower';

interface ConfidenceBadgeProps {
  level: ConfidenceLevel;
  score?: number;
  showScore?: boolean;
}

export const ConfidenceBadge: React.FC<ConfidenceBadgeProps> = ({ level, score, showScore }) => {
  if (level === 'HIGH') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-950/80 text-emerald-400 border border-emerald-700/60 shadow-sm">
        <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
        <span>High Confidence</span>
        {showScore && score !== undefined && <span className="opacity-75">({score}/100)</span>}
      </span>
    );
  }

  if (level === 'MEDIUM') {
    return (
      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-950/80 text-amber-400 border border-amber-700/60 shadow-sm">
        <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
        <span>Medium Confidence (Wide Band)</span>
        {showScore && score !== undefined && <span className="opacity-75">({score}/100)</span>}
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-950/80 text-rose-400 border border-rose-700/60 shadow-sm">
      <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
      <span>Low Confidence (High Variance)</span>
      {showScore && score !== undefined && <span className="opacity-75">({score}/100)</span>}
    </span>
  );
};
