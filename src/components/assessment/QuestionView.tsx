import React, { useState } from 'react';
import { HelpCircle, ArrowLeft, ArrowRight, CheckCircle2, Sparkles, AlertTriangle } from 'lucide-react';
import { BorrowerProfile } from '../../types/borrower';
import { QuestionDefinition, QUESTION_SECTIONS } from '../../data/questions';
import { CurrencyInput } from '../common/CurrencyInput';
import { formatINR } from '../../utils/currency';

interface QuestionViewProps {
  question: QuestionDefinition;
  profile: Partial<BorrowerProfile>;
  onUpdateAnswer: (field: keyof BorrowerProfile, value: any) => void;
  onNext: () => void;
  onPrev: () => void;
  currentIndex: number;
  totalQuestions: number;
  isFirst: boolean;
  isLast: boolean;
}

const AFFECTS_LABELS: Record<string, string> = {
  verdict: 'Decision Verdict',
  safeAmount: 'Safe Borrowing Limit',
  lenderAmount: 'Indicative Lender Capacity',
  fairRate: 'Fair Rate Band',
  emiCeiling: 'Safe Monthly EMI',
  stressTest: 'Stress Resilience',
  confidence: 'Model Confidence',
  productRouting: 'Product Guidance',
};

export const QuestionView: React.FC<QuestionViewProps> = ({
  question,
  profile,
  onUpdateAnswer,
  onNext,
  onPrev,
  currentIndex,
  totalQuestions,
  isFirst,
  isLast,
}) => {
  const currentValue = (profile as any)[question.id];
  const sectionInfo = QUESTION_SECTIONS.find((s) => s.id === question.section);

  // Sanity check override state
  const [hasConfirmedHighValue, setHasConfirmedHighValue] = useState<boolean>(false);

  // Validation check: can user proceed?
  const isAnswered = () => {
    if (!question.isMustQuestion) return true;
    if (currentValue === undefined || currentValue === null) return false;
    if (question.type === 'currency' || question.type === 'number') {
      return typeof currentValue === 'number' && currentValue >= 0;
    }
    if (question.type === 'boolean') {
      return typeof currentValue === 'boolean';
    }
    return String(currentValue).trim().length > 0;
  };

  // Sanity Check Logic (Gentle non-blocking warnings)
  const getSanityWarning = (): string | null => {
    const income = profile.monthlyIncome || 0;

    if (question.id === 'rent' && typeof currentValue === 'number' && currentValue > 0 && income > 0) {
      if (currentValue > income * 0.70) {
        return `Your entered rent of ${formatINR(currentValue)} is over 70% of your stated monthly income (${formatINR(income)}). Please check if this is correct.`;
      }
    }

    if (question.id === 'monthlyEssentialExpenses' && typeof currentValue === 'number' && currentValue > 0 && income > 0) {
      if (currentValue > income * 0.90) {
        return `Your non-rent essential living expenses (${formatINR(currentValue)}) are over 90% of your stated monthly income (${formatINR(income)}).`;
      }
    }

    if (question.id === 'dependentsCount' && typeof currentValue === 'number' && currentValue > 10) {
      return `You entered ${currentValue} dependents. Please confirm if this is an accurate figure.`;
    }

    if (question.id === 'existingEmi' && typeof currentValue === 'number' && currentValue > 0 && income > 0) {
      if (currentValue > income * 0.80) {
        return `Your existing monthly EMI of ${formatINR(currentValue)} represents over 80% of your take-home pay.`;
      }
    }

    return null;
  };

  const sanityWarning = getSanityWarning();
  const needsSanityConfirmation = sanityWarning !== null && !hasConfirmedHighValue;

  const handleNextClick = () => {
    if (needsSanityConfirmation) {
      // Prompt user to confirm once
      setHasConfirmedHighValue(true);
      return;
    }
    setHasConfirmedHighValue(false);
    onNext();
  };

  const canProceed = isAnswered();

  return (
    <div className="max-w-2xl mx-auto w-full">
      {/* Progress Bar & Section Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-2">
          <span className="flex items-center gap-1.5 text-brand-400 font-semibold">
            <span>{sectionInfo?.title || 'Assessment'}</span>
          </span>
          <span>Question {currentIndex + 1} of {totalQuestions}</span>
        </div>
        <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
          <div
            className="bg-gradient-to-r from-brand-600 to-brand-400 h-full rounded-full transition-all duration-300 ease-out"
            style={{ width: `${((currentIndex + 1) / totalQuestions) * 100}%` }}
          />
        </div>
      </div>

      {/* Main Question Card */}
      <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-6 sm:p-8 shadow-card backdrop-blur-sm">
        {/* Question Header */}
        <div className="mb-6">
          <div className="flex items-start justify-between gap-4 mb-2">
            <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight leading-snug">
              {question.title}
            </h2>
            {question.isMustQuestion && (
              <span className="shrink-0 text-[10px] font-bold uppercase tracking-wider bg-brand-950 text-brand-400 border border-brand-800/60 px-2 py-0.5 rounded">
                Required
              </span>
            )}
          </div>
          {question.subtitle && (
            <p className="text-sm text-slate-400 leading-relaxed">
              {question.subtitle}
            </p>
          )}
        </div>

        {/* Input Controls */}
        <div className="my-6">
          {/* 1. SELECT / RADIO OPTIONS */}
          {question.type === 'select' && question.options && (
            <div className="grid grid-cols-1 gap-3">
              {question.options.map((opt) => {
                const isSelected = currentValue === opt.value;
                return (
                  <button
                    key={String(opt.value)}
                    type="button"
                    onClick={() => {
                      onUpdateAnswer(question.id as keyof BorrowerProfile, opt.value);
                      setHasConfirmedHighValue(false);
                    }}
                    className={`text-left p-4 rounded-xl border transition-all flex items-start justify-between gap-3 ${
                      isSelected
                        ? 'bg-brand-950/60 border-brand-500 text-white shadow-sm shadow-brand-500/10'
                        : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
                    }`}
                  >
                    <div className="flex-1">
                      <div className="font-semibold text-sm sm:text-base flex items-center gap-2">
                        <span>{opt.label}</span>
                        {opt.badge && (
                          <span className="text-[10px] bg-brand-900/60 text-brand-300 px-2 py-0.5 rounded border border-brand-700/50">
                            {opt.badge}
                          </span>
                        )}
                      </div>
                      {opt.subtitle && (
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                          {opt.subtitle}
                        </p>
                      )}
                    </div>
                    <div
                      className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 mt-0.5 transition-colors ${
                        isSelected
                          ? 'border-brand-500 bg-brand-500 text-white'
                          : 'border-slate-600 bg-slate-800'
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-4 h-4" />}
                    </div>
                  </button>
                );
              })}
            </div>
          )}

          {/* 2. CURRENCY INPUT */}
          {question.type === 'currency' && (
            <div className="max-w-md">
              <CurrencyInput
                value={currentValue}
                onChange={(val) => {
                  onUpdateAnswer(question.id as keyof BorrowerProfile, val);
                  setHasConfirmedHighValue(false);
                }}
                placeholder={question.placeholder}
                min={question.min ?? 0}
                max={question.max}
              />
            </div>
          )}

          {/* 3. NUMBER INPUT */}
          {question.type === 'number' && (
            <div className="max-w-xs">
              <input
                type="number"
                value={currentValue !== undefined && currentValue !== null ? currentValue : ''}
                onChange={(e) => {
                  const raw = e.target.value;
                  const val = raw === '' ? null : Math.max(question.min ?? 0, parseFloat(raw));
                  onUpdateAnswer(question.id as keyof BorrowerProfile, val);
                  setHasConfirmedHighValue(false);
                }}
                placeholder={question.placeholder}
                min={question.min ?? 0}
                max={question.max}
                step={question.step || 1}
                className="w-full px-4 py-3 bg-slate-900/90 border border-slate-700 rounded-xl text-white font-medium placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500 transition-all"
              />
            </div>
          )}

          {/* 4. BOOLEAN TOGGLE */}
          {question.type === 'boolean' && (
            <div className="grid grid-cols-2 gap-4 max-w-md">
              <button
                type="button"
                onClick={() => {
                  onUpdateAnswer(question.id as keyof BorrowerProfile, true);
                  setHasConfirmedHighValue(false);
                }}
                className={`p-4 rounded-xl border text-center font-semibold text-sm transition-all ${
                  currentValue === true
                    ? 'bg-brand-950/60 border-brand-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                Yes
              </button>
              <button
                type="button"
                onClick={() => {
                  onUpdateAnswer(question.id as keyof BorrowerProfile, false);
                  setHasConfirmedHighValue(false);
                }}
                className={`p-4 rounded-xl border text-center font-semibold text-sm transition-all ${
                  currentValue === false
                    ? 'bg-brand-950/60 border-brand-500 text-white shadow-sm'
                    : 'bg-slate-900/60 border-slate-700/60 text-slate-300 hover:border-slate-600'
                }`}
              >
                No
              </button>
            </div>
          )}
        </div>

        {/* Gentle Sanity Warning (Non-blocking) */}
        {sanityWarning && (
          <div className="my-4 p-3.5 rounded-xl bg-amber-950/60 border border-amber-700/60 text-amber-300 text-xs flex items-start gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="leading-relaxed">{sanityWarning}</p>
              {!hasConfirmedHighValue && (
                <div className="mt-2 flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setHasConfirmedHighValue(true)}
                    className="px-2.5 py-1 rounded bg-amber-900/80 hover:bg-amber-800 text-white font-semibold text-[11px] border border-amber-600"
                  >
                    Keep this amount & continue
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Why We Ask & Impact Disclosure */}
        <div className="mt-8 pt-4 border-t border-slate-700/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-start gap-2 text-slate-400">
            <HelpCircle className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
            <span>
              <strong className="text-slate-300">Why we ask: </strong>
              {question.whyWeAsk}
            </span>
          </div>
          {question.affects && question.affects.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0">
              <span className="text-slate-500 text-[11px]">Influences:</span>
              <div className="flex flex-wrap gap-1">
                {question.affects.slice(0, 3).map((a) => (
                  <span
                    key={a}
                    className="text-[10px] bg-slate-900 text-slate-300 px-2 py-0.5 rounded border border-slate-700/80"
                  >
                    {AFFECTS_LABELS[a] || a}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="mt-6 flex items-center justify-between gap-4">
        <button
          type="button"
          onClick={onPrev}
          disabled={isFirst}
          className={`px-5 py-2.5 rounded-xl font-medium text-sm flex items-center gap-2 transition-all ${
            isFirst
              ? 'opacity-0 pointer-events-none'
              : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
          }`}
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <button
          type="button"
          onClick={handleNextClick}
          disabled={!canProceed}
          className={`px-6 py-3 rounded-xl font-semibold text-sm flex items-center gap-2 transition-all shadow-md ${
            !canProceed
              ? 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
              : isLast
              ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-500 hover:to-teal-500 shadow-emerald-900/30'
              : 'bg-brand-600 text-white hover:bg-brand-500 shadow-brand-900/30'
          }`}
        >
          <span>{isLast ? 'Generate Decision & Card' : 'Continue'}</span>
          {isLast ? <Sparkles className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
};
