import React, { useMemo } from 'react';
import { BorrowerProfile } from '../types/borrower';
import { QUESTIONS_CATALOG, QuestionDefinition } from '../data/questions';
import { QuestionView } from '../components/assessment/QuestionView';

interface AssessmentPageProps {
  profile: Partial<BorrowerProfile>;
  onUpdateAnswer: (field: keyof BorrowerProfile, value: any) => void;
  currentQuestionIndex: number;
  onSetQuestionIndex: (idx: number) => void;
  onComplete: () => void;
}

export const AssessmentPage: React.FC<AssessmentPageProps> = ({
  profile,
  onUpdateAnswer,
  currentQuestionIndex,
  onSetQuestionIndex,
  onComplete,
}) => {
  // Dynamically compute active questions list based on conditional branching
  const activeQuestions: QuestionDefinition[] = useMemo(() => {
    return QUESTIONS_CATALOG.filter((q) => {
      if (!q.condition) return true;
      return q.condition(profile);
    });
  }, [profile]);

  // Ensure current question index is in valid range
  const safeIndex = Math.min(currentQuestionIndex, Math.max(0, activeQuestions.length - 1));
  const currentQuestion = activeQuestions[safeIndex];

  const handleNext = () => {
    if (safeIndex < activeQuestions.length - 1) {
      onSetQuestionIndex(safeIndex + 1);
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      onSetQuestionIndex(safeIndex - 1);
    }
  };

  if (!currentQuestion) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">Loading questions...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
      <QuestionView
        question={currentQuestion}
        profile={profile}
        onUpdateAnswer={onUpdateAnswer}
        onNext={handleNext}
        onPrev={handlePrev}
        currentIndex={safeIndex}
        totalQuestions={activeQuestions.length}
        isFirst={safeIndex === 0}
        isLast={safeIndex === activeQuestions.length - 1}
      />
    </div>
  );
};
