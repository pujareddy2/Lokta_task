import React from 'react';
import { Calendar, Info } from 'lucide-react';
import { TenureOption } from '../../types/borrower';
import { formatINR } from '../../utils/currency';

interface EmiCeilingCardProps {
  safeEmiCeiling: number;
  emiReason: string;
  borrowerIndividualIncome: number;
  householdIncomeConsidered: number;
  hasCoApplicantIncome: boolean;
  coApplicantIncomeAmount: number;
  totalEssentialExpenses: number;
  currentFoirPercent: number;
  maxFoirPercent: number;
  residualMonthlyCash: number;
  tenureOptions: TenureOption[];
}

export const EmiCeilingCard: React.FC<EmiCeilingCardProps> = ({
  safeEmiCeiling,
  emiReason,
  borrowerIndividualIncome,
  householdIncomeConsidered,
  hasCoApplicantIncome,
  coApplicantIncomeAmount,
  totalEssentialExpenses,
  currentFoirPercent,
  maxFoirPercent,
  residualMonthlyCash,
  tenureOptions,
}) => {
  return (
    <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-card">
      <div className="mb-6">
        <span className="text-[11px] font-bold uppercase tracking-wider text-brand-400 bg-brand-950/80 border border-brand-800/60 px-2.5 py-0.5 rounded-full">
          Output 4 of 4
        </span>
        <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight mt-1.5">
          What Monthly EMI Should You Agree To?
        </h2>
      </div>

      {/* Ceiling Hero Box */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-brand-950/40 border border-slate-700/80 rounded-xl p-6 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
              Maximum Recommended Monthly Outflow
            </span>
            <div className="text-3xl sm:text-4xl font-extrabold text-white mt-1">
              Do not agree to more than{' '}
              <span className="text-brand-400">{formatINR(safeEmiCeiling)}</span>
              <span className="text-base font-normal text-slate-400">/month</span>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
              {emiReason}
            </p>
          </div>

          <div className="sm:border-l sm:border-slate-800 sm:pl-6 shrink-0 flex flex-col gap-1.5 text-xs">
            <div className="text-slate-400">
              Individual Recognized Income: <strong className="text-slate-200">{formatINR(borrowerIndividualIncome)}/mo</strong>
            </div>
            {hasCoApplicantIncome && (
              <div className="text-brand-400">
                Joint Household Considered: <strong className="text-brand-300">{formatINR(householdIncomeConsidered)}/mo</strong> (incl. {formatINR(coApplicantIncomeAmount)} co-applicant)
              </div>
            )}
            <div className="text-slate-400">
              Essential Costs (Living + Rent): <strong className="text-slate-200">{formatINR(totalEssentialExpenses)}/mo</strong>
            </div>
            <div className="text-slate-400">
              Current Debt Burden: <strong className="text-slate-200">{currentFoirPercent}%</strong>
            </div>
            <div className="text-slate-400">
              Comfortable FOIR Cap: <strong className="text-emerald-400">{maxFoirPercent}%</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Multi-Tenure Tradeoff Comparison Table */}
      {tenureOptions && tenureOptions.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-brand-400" />
            <span>Tenure Trade-off Comparison (Monthly Payment vs Total Interest)</span>
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-slate-700 bg-slate-900/60 text-slate-400 font-semibold">
                  <th className="py-2.5 px-3">Tenure</th>
                  <th className="py-2.5 px-3">Monthly EMI</th>
                  <th className="py-2.5 px-3">Total Interest</th>
                  <th className="py-2.5 px-3">Total Repaid</th>
                  <th className="py-2.5 px-3">Trade-off Guidance</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {tenureOptions.map((opt) => {
                  const isOverCeiling = safeEmiCeiling > 0 && opt.monthlyEmi > safeEmiCeiling;
                  return (
                    <tr
                      key={opt.tenureMonths}
                      className={`transition-colors ${
                        opt.isRecommended
                          ? 'bg-brand-950/40 font-medium text-white'
                          : 'hover:bg-slate-900/40 text-slate-300'
                      }`}
                    >
                      <td className="py-3 px-3 flex items-center gap-1.5">
                        <span>{opt.tenureMonths} mo ({opt.tenureYears}y)</span>
                        {opt.isRecommended && (
                          <span className="text-[10px] bg-brand-600 text-white font-bold px-1.5 py-0.2 rounded">
                            Balanced
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-3">
                        <span className={`font-bold ${isOverCeiling ? 'text-amber-400' : 'text-slate-200'}`}>
                          {formatINR(opt.monthlyEmi)}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-slate-400">{formatINR(opt.totalInterest)}</td>
                      <td className="py-3 px-3 text-slate-400">{formatINR(opt.totalRepayment)}</td>
                      <td className="py-3 px-3 text-slate-400 text-[11px]">
                        {opt.recommendationNote}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
