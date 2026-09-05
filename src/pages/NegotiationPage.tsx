import React from 'react';
import { DecisionResult, BorrowerProfile } from '../types/borrower';
import { NegotiationCard } from '../components/negotiation/NegotiationCard';

interface NegotiationPageProps {
  decision: DecisionResult;
  profile: BorrowerProfile;
  onBackToResults: () => void;
}

export const NegotiationPage: React.FC<NegotiationPageProps> = ({
  decision,
  profile,
  onBackToResults,
}) => {
  return (
    <div className="max-w-5xl mx-auto w-full px-4 sm:px-6 py-6 sm:py-10">
      <NegotiationCard
        decision={decision}
        profile={profile}
        onBack={onBackToResults}
      />
    </div>
  );
};
