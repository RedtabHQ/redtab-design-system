/**
 * Step 1: Entity Profile form
 */

import { Building2, Target, FileText, User, Mail } from 'lucide-react';
import { Controller, FieldErrors, Control } from 'react-hook-form';
import RegionSelection from '@/features/admin/components/RegionSelection';
import type { OnboardingFormData } from '../onboardingSchema';
import { TextInput, RegionSelectionWithError } from '../components';

interface Step1EntityProfileProps {
  control: Control<OnboardingFormData>;
  errors: FieldErrors<OnboardingFormData>;
}

export const Step1EntityProfile = ({ control, errors }: Step1EntityProfileProps) => (
  <div className="space-y-10 animate-in fade-in slide-in-from-right-4">
    <div className="flex items-center gap-4 text-gray-900">
      <Building2 size={32} className="text-redtab" />
      <h2 className="text-2xl font-black tracking-tight uppercase">Entity Profile</h2>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <Controller
        name="name"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Legal Business Name"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.name?.message}
            placeholder="e.g. Kathmandu Coffee Co."
            icon={<Building2 size={16} />}
          />
        )}
      />
      <Controller
        name="regionId"
        control={control}
        render={({ field }) => (
          <RegionSelectionWithError
            value={field.value || 'REG-NP'}
            onChange={field.onChange}
            error={errors.regionId?.message}
          />
        )}
      />
      <Controller
        name="category"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Business Category"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.category?.message}
            placeholder="e.g. F&B, Retail, Pharma"
            icon={<Target size={16} />}
          />
        )}
      />
      <Controller
        name="registrationNumber"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Registration Number"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.registrationNumber?.message}
            placeholder="REG-123456"
            icon={<FileText size={16} />}
          />
        )}
      />
      <Controller
        name="contactPerson"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Contact Person"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.contactPerson?.message}
            placeholder="Principal Director"
            icon={<User size={16} />}
          />
        )}
      />
      <Controller
        name="email"
        control={control}
        render={({ field }) => (
          <TextInput
            label="Email Address"
            value={field.value || ''}
            onChange={field.onChange}
            error={errors.email?.message}
            placeholder="admin@business.com"
            type="email"
            icon={<Mail size={16} />}
          />
        )}
      />
    </div>
  </div>
);
