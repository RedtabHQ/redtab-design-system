/**
 * Refactored Merchant Onboarding View
 * Orchestrates the 5-step onboarding process
 */

import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormProvider } from 'react-hook-form';
import { useCreateMerchant } from '../hooks';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useToastContext } from '@/components/common/ToastContainer';
import { MerchantStatus } from '@types';
import type { OnboardingFormData } from './onboarding/utils/onboardingValidation';
import { useOnboardingForm } from './onboarding/hooks/useOnboardingForm';
import { calculatePredictedScore } from './onboarding/utils/scoringCalculator';
import { OnboardingHeader } from '@/components/common';
import { OnboardingSidebar } from './onboarding/components/OnboardingSidebar';
import { Step1EntityProfile } from './onboarding/steps/Step1EntityProfile';
import { Step2FinancialCapacity } from './onboarding/steps/Step2FinancialCapacity';
import { Step3Obligations } from './onboarding/steps/Step3Obligations';
import { Step4Behavior } from './onboarding/steps/Step4Behavior';
import { Step5KYCSubmission } from './onboarding/steps/Step5KYCSubmission';
import { StepNavigationButtons } from './onboarding/steps/StepNavigationButtons';

const MerchantOnboardingView: React.FC = () => {
  const navigate = useNavigate();
  const createMerchant = useCreateMerchant();
  const { show } = useToastContext();
  const { selectedSegment, isGlobalView } = useMarketSegment();

  const [step, setStep] = useState(1);
  const totalSteps = 5;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [fileError, setFileError] = useState<string>('');

  const methods = useOnboardingForm();
  const { handleSubmit, trigger, getValues, watch, setValue, formState: { isSubmitting } } = methods;
  const formValues = watch();

  // Auto-set marketSegmentId when header market segment is selected
  useEffect(() => {
    if (!isGlobalView && selectedSegment?.id) {
      setValue('marketSegmentId', selectedSegment.id);
    }
  }, [selectedSegment, isGlobalView, setValue]);

  const predictedScore = useMemo(() => calculatePredictedScore(formValues), [formValues]);

  const handleNext = async () => {
    try {
      const fieldsByStep: Record<number, (keyof OnboardingFormData)[]> = {
        1: ['name', 'categoryId', 'marketSegmentId', 'contactPerson', 'email', 'phone', 'address'],
        2: ['bankFlows', 'posSales', 'inventoryTurnover', 'profitMargin', 'liquidAssets', 'growthTrend'],
        3: ['employeeArrears', 'householdDebt', 'outsideLoans', 'rentLease', 'taxDues'],
        4: ['tenureMonths', 'refundRate', 'fulfillmentRate', 'socialReputation', 'responsiveness'],
      };

      const isValid = await trigger(fieldsByStep[step]);
      if (!isValid) return;

      setCompletedSteps((prev) => new Set(prev).add(step));
      setStep(step + 1);
    } catch (error) {
      console.error('Navigation validation error:', error);
      show({
        type: 'DANGER',
        title: 'Validation Error',
        message: 'Please check your inputs and try again',
      });
    }
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setFileError('');

    if (file) {
      const validTypes = ['application/pdf', 'image/png', 'image/jpeg'];
      if (!validTypes.includes(file.type)) {
        setFileError('Please upload a PDF, PNG, or JPG file');
        show({
          type: 'DANGER',
          title: 'Invalid File Type',
          message: 'Please upload a PDF, PNG, or JPG file',
        });
        return;
      }
      if (file.size > 25 * 1024 * 1024) {
        setFileError('File size must be less than 25MB');
        show({
          type: 'DANGER',
          title: 'File Too Large',
          message: 'File size must be less than 25MB',
        });
        return;
      }
      setUploadedFile(file);
      show({
        type: 'SUCCESS',
        title: 'File Uploaded',
        message: `${file.name} uploaded successfully`,
      });
    }
  };

  const onSubmitForm = async (data: OnboardingFormData) => {
    if (!completedSteps.has(1) || !completedSteps.has(2) || !completedSteps.has(3) || !completedSteps.has(4)) {
      show({
        type: 'DANGER',
        title: 'Incomplete Form',
        message: 'Please complete all steps before submitting',
      });
      setStep(1);
      return;
    }

    if (!uploadedFile) {
      show({
        type: 'DANGER',
        title: 'Missing Documents',
        message: 'Please upload KYC documents before proceeding',
      });
      setStep(5);
      return;
    }

    try {
      const merchantData = {
        name: data.name.trim(),
        businessName: data.businessName?.trim() || data.name.trim(),
        email: data.email.trim(),
        phone: data.phone.trim(),
        categoryId: data.categoryId,
        marketSegmentId: data.marketSegmentId,
        contactPerson: data.contactPerson.trim(),
        address: data.address?.trim() || '',
        registrationNumber: data.registrationNumber?.trim() || '',
        panNumber: data.panNumber?.trim() || '',
        status: MerchantStatus.PENDING,
        bankFlows: data.bankFlows,
        posSales: data.posSales,
        inventoryTurnover: data.inventoryTurnover,
        profitMargin: data.profitMargin,
        liquidAssets: data.liquidAssets,
        growthTrend: data.growthTrend,
        employeeArrears: data.employeeArrears,
        householdDebt: data.householdDebt,
        outsideLoans: data.outsideLoans,
        rentLease: data.rentLease,
        taxDues: data.taxDues,
        tenureMonths: data.tenureMonths,
        refundRate: data.refundRate,
        fulfillmentRate: data.fulfillmentRate,
        socialReputation: data.socialReputation,
        responsiveness: data.responsiveness,
      };

      createMerchant.mutate(merchantData, {
        onSuccess: (merchant) => {
          show({
            type: 'SUCCESS',
            title: 'Merchant Onboarded',
            message: `${merchant.name} has been successfully onboarded. ID: ${merchant.id}`,
          });

          setTimeout(() => {
            navigate(`/merchants/${merchant.id}`);
          }, 2000);
        },
        onError: (error: Error) => {
          console.error('Merchant onboarding failed:', error);
          show({
            type: 'DANGER',
            title: 'Onboarding Failed',
            message: error.message || 'Failed to onboard merchant. Please try again.',
          });
        },
      });
    } catch (error) {
      console.error('Unexpected error during submission:', error);
      show({
        type: 'DANGER',
        title: 'Submission Error',
        message: 'An unexpected error occurred. Please try again.',
      });
    }
  };

  return (
    <div className="mx-auto pb-20 animate-in fade-in duration-500">
      <OnboardingHeader step={step} totalSteps={totalSteps} title="Merchant Onboarding" subtitle="Global Payment Platform & Business Underwriting" />

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Form Content */}
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50">
              <FormProvider {...methods}>
                {step === 1 && <Step1EntityProfile />}
                {step === 2 && <Step2FinancialCapacity />}
                {step === 3 && <Step3Obligations />}
                {step === 4 && <Step4Behavior />}
                {step === 5 && (
                  <Step5KYCSubmission
                    uploadedFile={uploadedFile}
                    fileError={fileError}
                    onFileUpload={handleFileUpload}
                  />
                )}

                <StepNavigationButtons
                  step={step}
                  totalSteps={totalSteps}
                  isSubmitting={isSubmitting}
                  uploadedFile={uploadedFile}
                  onBack={handleBack}
                  onNext={handleNext}
                  onSubmit={handleSubmit(onSubmitForm)}
                />
              </FormProvider>
            </div>
          </div>

          {/* Right: Summary Sidebar */}
          <div className="lg:col-span-4">
            <OnboardingSidebar
              predictedScore={predictedScore}
              completedSteps={completedSteps}
              merchantName={getValues('name')}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default MerchantOnboardingView;
