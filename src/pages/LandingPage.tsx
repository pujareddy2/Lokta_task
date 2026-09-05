import React from 'react';
import { ArrowRight, ShieldCheck, Sparkles, User, Zap, BookOpen, AlertCircle, CheckCircle2 } from 'lucide-react';
import { TEST_PERSONAS } from '../data/personas';
import { PersonaPreset } from '../types/borrower';

interface LandingPageProps {
  onStartFresh: () => void;
  onSelectPersona: (persona: PersonaPreset) => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onStartFresh, onSelectPersona }) => {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12 space-y-12">
      {/* Hero Section */}
      <div className="text-center max-w-3xl mx-auto space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold bg-brand-950/80 text-brand-300 border border-brand-800/80 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-400" />
          <span>Borrower-First Intelligence for Indian Retail Loans</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-white tracking-tight leading-tight">
          Never Walk Into a Bank Blind.
        </h1>

        <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-medium">
          Every lender has an underwriting algorithm to maximize their profit. <br className="hidden sm:block" />
          <strong className="text-white">Borrower Copilot</strong> gives you the mathematical leverage to answer 4 vital questions before you talk to any loan officer.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={onStartFresh}
            className="w-full sm:w-auto px-8 py-4 rounded-xl bg-brand-600 text-white font-bold text-base hover:bg-brand-500 transition-all shadow-lg shadow-brand-900/40 flex items-center justify-center gap-2 group"
          >
            <span>Start Free Assessment</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        <div className="flex flex-wrap items-center justify-center gap-6 pt-2 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> No Login or Phone Number
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> No Credit Bureau Hard Pull
          </span>
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-400" /> 100% Client-Side Computation
          </span>
        </div>
      </div>

      {/* The 4 Outputs Grid */}
      <div className="bg-slate-800/60 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-card">
        <h2 className="text-lg font-bold text-white mb-6 text-center uppercase tracking-wider text-xs text-brand-400">
          The 4 Decisions You Get in Under 3 Minutes
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="w-8 h-8 rounded-lg bg-emerald-950 text-emerald-400 border border-emerald-800 flex items-center justify-center font-bold text-xs mb-3">
              O1
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Borrow or Don't</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Unbiased verdict based on debt-to-income and cash cushion. "Don't borrow" is always reachable.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="w-8 h-8 rounded-lg bg-brand-950 text-brand-400 border border-brand-800 flex items-center justify-center font-bold text-xs mb-3">
              O2
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Maximum Safe Limit</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Separates what a lender will sanction from what you can safely carry without risking default.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="w-8 h-8 rounded-lg bg-amber-950 text-amber-400 border border-amber-800 flex items-center justify-center font-bold text-xs mb-3">
              O3
            </div>
            <h3 className="font-bold text-sm text-white mb-1">Fair Rate & All-in APR</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A risk-adjusted interest band + true APR including processing fees and GST so you aren't fooled.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60">
            <div className="w-8 h-8 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-800 flex items-center justify-center font-bold text-xs mb-3">
              O4
            </div>
            <h3 className="font-bold text-sm text-white mb-1">EMI Ceiling & Stress Test</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              A hard monthly ceiling you should never cross, stress-tested against a 20% income drop.
            </p>
          </div>
        </div>
      </div>

      {/* Preset Test Personas Showcase */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Test With Benchmark Borrowers
            </h2>
            <p className="text-xs text-slate-400">
              Click any profile below to instantly run the rules engine and inspect the adaptive reasoning.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {TEST_PERSONAS.map((persona) => (
            <div
              key={persona.id}
              className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-5 hover:border-brand-500/70 transition-all flex flex-col justify-between group shadow-card"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-slate-700 text-brand-300 font-bold flex items-center justify-center text-sm border border-slate-600">
                      {persona.avatarInitials}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-white group-hover:text-brand-300 transition-colors">
                        {persona.name}, {persona.age}
                      </h3>
                      <span className="text-xs text-slate-400">{persona.city}</span>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-700">
                    {persona.personaType.replace('_', ' ')}
                  </span>
                </div>

                <p className="text-xs text-slate-300 mb-4 leading-relaxed">
                  {persona.description}
                </p>

                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800 space-y-1.5 text-[11px] mb-4">
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Target: </strong>
                    ₹{(persona.profile.requestedAmount / 100000).toFixed(1)}L ({persona.profile.loanPurpose.replace('_', ' ')})
                  </div>
                  <div className="text-slate-400">
                    <strong className="text-slate-300">Expected Outcome: </strong>
                    <span className="text-emerald-400 font-medium">{persona.expectedHighlights.verdict}</span>
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => onSelectPersona(persona)}
                className="w-full py-2.5 rounded-xl bg-slate-700/60 hover:bg-brand-600 text-white font-semibold text-xs transition-all flex items-center justify-center gap-1.5 border border-slate-600/60 hover:border-brand-500"
              >
                <span>Run {persona.name}'s Evaluation</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
