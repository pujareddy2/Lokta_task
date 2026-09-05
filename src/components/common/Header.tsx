import React from 'react';
import { Shield, Sparkles, User, RefreshCw, FileText } from 'lucide-react';
import { TEST_PERSONAS } from '../../data/personas';
import { PersonaPreset } from '../../types/borrower';

interface HeaderProps {
  currentPage: 'landing' | 'assessment' | 'results' | 'negotiation';
  onNavigate: (page: 'landing' | 'assessment' | 'results' | 'negotiation') => void;
  onSelectPersona?: (persona: PersonaPreset) => void;
  onReset?: () => void;
  hasActiveAssessment?: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  onNavigate,
  onSelectPersona,
  onReset,
  hasActiveAssessment,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-slate-900/90 backdrop-blur-md border-b border-slate-800 transition-all">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        {/* Logo */}
        <button
          onClick={() => onNavigate('landing')}
          className="flex items-center gap-2.5 text-left group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-brand-600 to-brand-400 flex items-center justify-center text-white shadow-md shadow-brand-500/20 group-hover:scale-105 transition-transform">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg tracking-tight text-white group-hover:text-brand-300 transition-colors">
                Borrower Copilot
              </span>
              <span className="text-[10px] font-semibold uppercase tracking-wider bg-brand-950 text-brand-400 border border-brand-800/80 px-1.5 py-0.5 rounded">
                India
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
              Know your numbers before the lender does
            </p>
          </div>
        </button>

        {/* Center: Privacy by Design Tag */}
        <div className="hidden md:flex items-center gap-2 text-xs text-emerald-400 bg-emerald-950/40 border border-emerald-800/50 px-3 py-1.5 rounded-full">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>100% Client-Side Privacy • Zero Data Sent</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Persona Quick Switcher Dropdown / Buttons */}
          {onSelectPersona && (
            <div className="hidden lg:flex items-center gap-1.5 bg-slate-800/70 border border-slate-700/60 p-1 rounded-lg">
              <span className="text-[11px] text-slate-400 font-medium px-2 flex items-center gap-1">
                <User className="w-3.5 h-3.5 text-slate-400" /> Presets:
              </span>
              {TEST_PERSONAS.map((p) => (
                <button
                  key={p.id}
                  onClick={() => onSelectPersona(p)}
                  className="px-2.5 py-1 text-xs font-medium rounded-md bg-slate-700/50 text-slate-200 hover:bg-brand-600 hover:text-white transition-all"
                  title={`${p.name}: ${p.tagline}`}
                >
                  {p.name}
                </button>
              ))}
            </div>
          )}

          {/* Action Links */}
          {hasActiveAssessment && currentPage !== 'results' && currentPage !== 'landing' && (
            <button
              onClick={() => onNavigate('results')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-brand-600/20 text-brand-300 border border-brand-500/30 hover:bg-brand-600/30 transition-all flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" /> Results
            </button>
          )}

          {hasActiveAssessment && currentPage === 'results' && (
            <button
              onClick={() => onNavigate('negotiation')}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 text-white hover:bg-emerald-500 transition-all flex items-center gap-1.5 shadow-sm"
            >
              <FileText className="w-3.5 h-3.5" /> Negotiation Card
            </button>
          )}

          {onReset && hasActiveAssessment && (
            <button
              onClick={onReset}
              className="p-1.5 text-slate-400 hover:text-slate-200 hover:bg-slate-800 rounded-lg transition-colors"
              title="Start New Assessment"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
