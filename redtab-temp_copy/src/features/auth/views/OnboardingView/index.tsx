/**
 * Refactored Auth Onboarding View - Modular component-based design
 */

import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { onboardingSchema, OnboardingFormData } from './onboardingSchema';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { useToastContext } from '@/components/common/ToastContainer';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import { useCreateMerchant } from '@/features/merchants';
import { CreditTier, Currency, CurrencySymbol, MerchantStatus } from '@/types';
import { OnboardingHeader } from '@/components/common';
import { OnboardingSidebar } from './components';
import {
  Step1EntityProfile,
  Step2FinancialCapacity,
  Step3Obligations,
  Step4Behavior,
  Step5KYCSubmission,
} from './steps';

const OnboardingView: React.FC = () => {
  const navigate = useNavigate();
  const { availableSegments } = useMarketSegment();
  const { show } = useToastContext();
  const createMerchant = useCreateMerchant();
  const [step, setStep] = useState(1);
  const totalSteps = 5;

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
    trigger,
  } = useForm<OnboardingFormData>({
    resolver: zodResolver(onboardingSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      category: '',
      registrationNumber: '',
      vatPan: '',
      contactPerson: '',
      email: '',
      phone: '',
      regionId: 'REG-NP',
      bankFlows: 0,
      posSales: 0,
      inventoryTurnover: 12,
      profitMargin: 15,
      liquidAssets: 0,
      growthTrend: 5,
      employeeArrears: 0,
      householdDebt: 0,
      outsideLoans: 0,
      rentLease: 0,
      taxDues: 0,
      tenureMonths: 1,
      refundRate: 0,
      fulfillmentRate: 95,
      socialReputation: 80,
      responsiveness: 90,
      docs: [],
    },
  });

  const watchedValues = watch();
  const activeRegion = availableSegments.find((r) => r.id === watchedValues.regionId);

  const predictedScore = useMemo(() => {
    let base = 65;
    if (watchedValues.bankFlows > 500000) base += 10;
    if (watchedValues.tenureMonths > 12) base += 5;
    if (watchedValues.employeeArrears > 0) base -= 15;
    if (watchedValues.socialReputation > 90) base += 5;
    return Math.min(100, Math.max(0, base));
  }, [watchedValues]);

  const handleNext = async () => {
    const fields: Record<number, (keyof OnboardingFormData)[]> = {
      1: ['name', 'category', 'registrationNumber', 'contactPerson', 'email', 'phone', 'regionId'],
      2: ['bankFlows', 'posSales', 'inventoryTurnover', 'profitMargin', 'liquidAssets', 'growthTrend'],
      3: ['employeeArrears', 'householdDebt', 'outsideLoans', 'rentLease', 'taxDues'],
      4: ['tenureMonths', 'refundRate', 'fulfillmentRate', 'socialReputation', 'responsiveness'],
    };

    const isValid = await trigger(fields[step] || []);
    if (isValid) setStep((prev) => Math.min(prev + 1, totalSteps));
  };

  const handleBack = () => setStep((prev) => Math.max(prev - 1, 1));

  const onSubmit: SubmitHandler<OnboardingFormData> = async (data) => {
    try {
      let score = 65;
      if (data.bankFlows > 500000) score += 10;
      if (data.tenureMonths > 12) score += 5;
      if (data.employeeArrears > 0) score -= 15;
      if (data.socialReputation > 90) score += 5;
      score = Math.min(100, Math.max(0, score));

      let tier = CreditTier.T3;
      if (score >= 85) tier = CreditTier.T1;
      else if (score >= 70) tier = CreditTier.T2;

      const merchantData = {
        name: data.name,
        category: data.category,
        contactPerson: data.contactPerson,
        email: data.email,
        phone: data.phone,
        registrationNumber: data.registrationNumber,
        status: MerchantStatus.PENDING,
        ageMonths: data.tenureMonths,
        kycDocuments: ['Business Registration', 'Tax Clearance'],
        creditScore: score,
        tier: tier,
      };

      await createMerchant.mutateAsync(merchantData);

      show({
        type: 'SUCCESS',
        title: 'Merchant Onboarded',
        message: `${data.name} has been successfully submitted for verification`,
      });

      setTimeout(() => navigate('/merchants'), 1500);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to onboard merchant';
      show({
        type: 'DANGER',
        title: 'Onboarding Failed',
        message: errorMessage,
      });
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <OnboardingHeader step={step} totalSteps={totalSteps} title="Merchant Onboarding" subtitle="Global Underwriting Intake & KYC Vault" />

      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50">
              {step === 1 && <Step1EntityProfile control={control} errors={errors} />}
              {step === 2 && (
                <Step2FinancialCapacity control={control} errors={errors} currency={activeRegion?.currency} />
              )}
              {step === 3 && (
                <Step3Obligations control={control} errors={errors} currency={activeRegion?.currency} />
              )}
              {step === 4 && <Step4Behavior control={control} errors={errors} />}
              {step === 5 && <Step5KYCSubmission merchantName={watchedValues.name} />}

              <div className="flex gap-4 mt-12 pt-10 border-t border-gray-50">
                {step > 1 && (
                  <button
                    type="button"
                    onClick={handleBack}
                    disabled={isSubmitting}
                    className="px-8 py-4 border-2 border-gray-100 text-gray-400 rounded-3xl font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:bg-gray-50 transition-all disabled:opacity-50"
                  >
                    <ChevronLeft size={18} /> Back
                  </button>
                )}
                <button
                  type={step === totalSteps ? 'submit' : 'button'}
                  onClick={step !== totalSteps ? handleNext : undefined}
                  disabled={isSubmitting}
                  className="flex-1 py-4 bg-redtab text-white rounded font-black text-sm uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-700 transition-all shadow-xl shadow-red-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isSubmitting
                    ? 'Processing...'
                    : step === totalSteps
                      ? 'Complete Enrollment'
                      : 'Continue Phase'}
                  {step !== totalSteps && !isSubmitting && <ChevronRight size={18} />}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4">
            <OnboardingSidebar
              predictedScore={predictedScore}
              merchantName={watchedValues.name}
              activeRegion={activeRegion}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default OnboardingView;
