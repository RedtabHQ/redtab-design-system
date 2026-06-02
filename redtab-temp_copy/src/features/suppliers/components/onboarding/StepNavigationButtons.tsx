import React from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { InlineSpinner } from '@/components/common';

interface StepNavigationButtonsProps {
  step: number;
  totalSteps: number;
  isSubmitting: boolean;
  onBack: () => void;
  onNext?: () => void;
  isLastStep?: boolean;
}

const StepNavigationButtons: React.FC<StepNavigationButtonsProps> = ({
  step,
  totalSteps,
  isSubmitting,
  onBack,
  onNext,
  isLastStep = false,
}) => {
  return (
    <div className="flex gap-4 mt-12 pt-10 border-t border-gray-50">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={18} /> Back
        </button>
      )}
      <button
        type={isLastStep ? 'submit' : 'button'}
        onClick={!isLastStep ? onNext : undefined}
        disabled={isSubmitting}
        className="flex-1 py-4 bg-redtab text-white rounded font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <InlineSpinner size="md" variant="white" />
            Creating...
          </>
        ) : (
          <>
            {isLastStep ? 'Complete Onboarding' : 'Proceed to Setup'}
            {!isLastStep && <ChevronRight size={18} />}
          </>
        )}
      </button>
    </div>
  );
};

export default StepNavigationButtons;
