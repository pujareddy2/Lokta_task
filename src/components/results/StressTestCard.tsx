import React from 'react';
import { Activity, ShieldCheck, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import { StressScenarioResult } from '../../types/borrower';
import { formatINR } from '../../utils/currency';

interface StressTestCardProps {
  scenarios: StressScenarioResult[];
}

export const StressTestCard: React.FC<StressTestCardProps> = ({ scenarios }) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-card">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Activity className="w-5 h-5 text-brand-400" />
            <span>Stress Test: What If Your Situation Worsens?</span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            We simulate adverse modelling scenarios to test whether your loan repayment remains resilient.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {scenarios.map((sc, idx) => {
          let badgeColor = 'bg-emerald-950 text-emerald-400 border-emerald-700';
          let icon = <ShieldCheck className="w-4 h-4 text-emerald-400" />;

          if (sc.impactVerdict === 'UNSUSTAINABLE') {
            badgeColor = 'bg-rose-950 text-rose-400 border-rose-700';
            icon = <AlertOctagon className="w-4 h-4 text-rose-400" />;
          } else if (sc.impactVerdict === 'TIGHT') {
            badgeColor = 'bg-amber-950 text-amber-400 border-amber-700';
            icon = <AlertTriangle className="w-4 h-4 text-amber-400" />;
          }

          return (
            <div
              key={idx}
              className="bg-slate-900/90 border border-slate-700/60 rounded-xl p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <h3 className="font-bold text-sm text-slate-200">{sc.scenarioName}</h3>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded border flex items-center gap-1 ${badgeColor}`}
                  >
                    {icon}
                    <span>{sc.impactVerdict}</span>
                  </span>
                </div>
                <div className="text-[11px] text-slate-400 mb-2">
                  {sc.description} ({sc.baseScenario} → <strong>{sc.stressedIncomeOrRate}</strong>)
                </div>
                <div className="p-3 bg-slate-950/60 rounded-lg border border-slate-800 text-xs text-slate-300 leading-relaxed">
                  {sc.impactExplanation}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between text-[11px] text-slate-400">
                <span>Stressed Safe EMI: <strong className="text-slate-200">{formatINR(sc.stressedEmiCeiling)}/mo</strong></span>
                <span>Stressed Debt Ratio: <strong className="text-slate-200">{sc.stressedFoir}%</strong></span>
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-4 pt-3 border-t border-slate-700/60 text-[11px] text-slate-400 flex items-center gap-1.5">
        <Info className="w-3.5 h-3.5 text-brand-400 shrink-0" />
        <span>Stress test figures are conservative analytical simulations used for decision support.</span>
      </div>
    </div>
  );
};
