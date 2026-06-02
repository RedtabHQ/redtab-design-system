import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useCreateSupplier } from '../hooks';
import { SettlementMode } from '@/types';
import { useToastContext } from '@/components/common/ToastContainer';
import { OnboardingHeader } from '@/components/common';
import OnboardingSummarySidebar from '@/features/auth/components/OnboardingSummarySidebar';
import { useMarketSegment } from '@/contexts/MarketSegmentContext';
import {
  Step1CorporateIdentity,
  Step2SettlementDetails,
  Step3CommercialTerms,
} from '../components/onboarding';
import { SupplierFormData } from '../types/supplier-form';

const SupplierOnboardingView: React.FC = () => {
  const navigate = useNavigate();
  const createSupplier = useCreateSupplier();
  const { show } = useToastContext();
  const [step, setStep] = useState(1);
  const totalSteps = 3;
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());
  const { selectedSegment, isGlobalView } = useMarketSegment();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setValue,
  } = useForm<SupplierFormData>({
    mode: 'onBlur',
    defaultValues: {
      name: '',
      businessName: '',
      supplierCategoryId: '',
      contactPerson: '',
      email: '',
      phone: '',
      marketSegmentId: '',
      bankProvider: '',
      bankName: '',
      bankAccount: '',
      preferredRailId: '',
      settlementMode: SettlementMode.REAL_TIME,
      paymentTermDays: 0,
      supplierFeeRate: 1.0,
    },
  });

  const formValues = watch();

  // Auto-set marketSegmentId when header market segment is selected (not HQ/Global view)
  useEffect(() => {
    if (!isGlobalView && selectedSegment?.id) {
      setValue('marketSegmentId', selectedSegment.id);
    }
  }, [selectedSegment, isGlobalView, setValue]);

  const handleNext = async () => {
    if (step === 1) {
      const isValid = await trigger(['name', 'businessName', 'supplierCategoryId', 'marketSegmentId', 'contactPerson', 'email', 'phone']);
      if (!isValid) {
        return;
      }
      setCompletedSteps(prev => new Set(prev).add(1));
      setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(['bankProvider', 'bankName', 'bankAccount']);
      if (!isValid) {
        return;
      }
      setCompletedSteps(prev => new Set(prev).add(2));
      setStep(3);
    }
  };

  const handleBack = () => setStep(prev => Math.max(prev - 1, 1));

  const onSubmitForm = (data: SupplierFormData) => {
    if (!completedSteps.has(1) || !completedSteps.has(2)) {
      show({
        type: 'DANGER',
        title: 'Incomplete Form',
        message: 'Please complete all previous steps before submitting',
      });
      setStep(1);
      return;
    }

    const supplierData = {
      name: data.name,
      businessName: data.businessName,
      supplierCategoryId: data.supplierCategoryId,
      marketSegmentId: data.marketSegmentId,
      contactPerson: data.contactPerson,
      email: data.email,
      phone: data.phone,
      bankName: data.bankName,
      bankAccount: data.bankAccount,
      settlementMode: data.settlementMode,
      paymentTermDays: data.paymentTermDays,
      supplierFeeRate: data.supplierFeeRate / 100,
      preferredRailId: data.preferredRailId || undefined
    };

    createSupplier.mutate(supplierData, {
      onSuccess: (supplier) => {
        show({
          type: 'SUCCESS',
          title: 'Supplier Created',
          message: `${supplier.name} has been successfully onboarded`,
        });
        setTimeout(() => {
          navigate('/suppliers');
        }, 1500);
      },
      onError: (error: Error) => {
        console.error('Failed to create supplier:', error);
        show({
          type: 'DANGER',
          title: 'Creation Failed',
          message: error.message || 'Failed to create supplier. Please try again.',
        });
      },
    });
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Step1CorporateIdentity
            register={register}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            onNext={handleNext}
            onBack={handleBack}
            step={step}
            totalSteps={totalSteps}
            isGlobalView={isGlobalView}
            selectedSegment={selectedSegment}
          />
        );
      case 2:
        return (
          <Step2SettlementDetails
            register={register}
            control={control}
            errors={errors}
            isSubmitting={isSubmitting}
            onNext={handleNext}
            onBack={handleBack}
            step={step}
            totalSteps={totalSteps}
            setValue={setValue}
            formValues={formValues}
          />
        );
      case 3:
        return (
          <Step3CommercialTerms
            register={register}
            errors={errors}
            isSubmitting={isSubmitting}
            onBack={handleBack}
            step={step}
            totalSteps={totalSteps}
            setValue={setValue}
            formValues={formValues}
            createSupplier={createSupplier}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-5xl mx-auto pb-20 animate-in fade-in duration-500">
      <OnboardingHeader
        step={step}
        totalSteps={totalSteps}
        title="Partner Onboarding"
        subtitle="Supply Chain Beneficiary Registration & Settlement Setup"
      />

      <form onSubmit={handleSubmit(onSubmitForm)}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-10 rounded-xl border border-gray-100 shadow-xl shadow-gray-200/50">
              {renderStep()}
            </div>
          </div>

          {/* Right: Summary Sidebar */}
          <OnboardingSummarySidebar
            marketSegmentId={formValues.marketSegmentId}
            completedSteps={completedSteps}
            step={step}
          />
        </div>
      </form>
    </div>
  );
};

export default SupplierOnboardingView;
