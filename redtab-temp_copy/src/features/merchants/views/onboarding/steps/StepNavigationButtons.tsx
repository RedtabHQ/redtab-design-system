/**
 * Navigation buttons for onboarding steps
 */

import { ChevronLeft, ChevronRight } from 'lucide-react';
import { InlineSpinner } from '@/components/common';

interface StepNavigationButtonsProps {
  step: number;
  totalSteps: number;
  isSubmitting: boolean;
  uploadedFile: File | null | undefined;
  onBack: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export const StepNavigationButtons = ({
  step,
  totalSteps,
  isSubmitting,
  uploadedFile,
  onBack,
  onNext,
  onSubmit,
}: StepNavigationButtonsProps) => {
  const isLastStep = step === totalSteps;
  const isKYCStep = step === 5;
  const isDisabled = isSubmitting || (isKYCStep && !uploadedFile);

  return (
    <div className="flex gap-4 mt-12 pt-10 border-t border-gray-50">
      {step > 1 && (
        <button
          type="button"
          onClick={onBack}
          disabled={isSubmitting}
          className="px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50"
        >
          <ChevronLeft size={18} /> Back
        </button>
      )}
      <button
        type={isLastStep ? 'submit' : 'button'}
        onClick={isLastStep ? onSubmit : onNext}
        disabled={isDisabled}
        className="flex-1 py-4 bg-red-600 text-white rounded font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-600/20 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? (
          <>
            <InlineSpinner size="md" variant="white" />
            Creating...
          </>
        ) : (
          <>
            {isLastStep ? 'Complete Enrollment' : 'Continue Phase'}
            {!isLastStep && <ChevronRight size={18} />}
          </>
        )}
      </button>
    </div>
  );
};
