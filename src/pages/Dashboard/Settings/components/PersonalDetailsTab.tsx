// src/pages/dashboard/components/settings/PersonalDetailsTab.tsx
import { useForm } from 'react-hook-form';
import { Button } from '../../../../components/ui/Button';
import { useUser } from '../../../../hooks/useUser';
import { Sms } from 'iconsax-react';
import { cn } from '../../../../utils/cn';
import { toast } from 'sonner';
import { useBusiness } from '../../../../hooks/useBusiness';
import { useUpdateProfile } from '../api/updateProfile';

interface PersonalFormValues {
  firstName: string;
  lastName: string;
  businessName: string;
  businessType: string;
  email: string;
  country: string;
  timezone: string;
}

export const PersonalDetailsTab = () => {
  const { user, isLoading: loadingProfile } = useUser();
  const { business, isLoading: loadingBusiness } = useBusiness();
const { mutate: updateProfile, isPending: isUpdating } = useUpdateProfile();

  const { register, handleSubmit, reset, formState: { isDirty } } = useForm<PersonalFormValues>({
    values: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
      businessName: business?.name || '',
      businessType: business?.businessType || 'Sole proprietorship',
      email: user?.email || '',
      country: 'Nigeria',
      timezone: 'West Africa Time (WAT) UTC+01:00'
    }
  });

const onSubmit = (formData: PersonalFormValues) => {
    // 2. Only send the fields authorized by your backend
    updateProfile(
      {
        firstName: formData.firstName,
        lastName: formData.lastName,
        country: formData.country,
        timezone: formData.timezone,
      },
      {
        onSuccess: () => {
          toast.success("Personal details updated successfully!");
          // Reset form to update isDirty state back to false
          reset(formData);
        },
        onError: () => {
          toast.error("Failed to update profile. Please try again.");
        }
      }
    );
  };

  const rowClass = "flex flex-col md:flex-row md:items-start justify-between py-5 border-b border-slate-100 gap-2 md:gap-8";
  const labelClass = "text-sm font-semibold text-slate-700 md:w-64 shrink-0 pt-2";
  const inputClass = "w-full max-w-xl px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-400 shadow-xs disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed";

  const isLoading = loadingProfile || loadingBusiness;
const isSaveDisabled = !isDirty || isUpdating;
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6 relative">
      {isLoading && (
        <div className="absolute inset-0 bg-white/60 backdrop-blur-xs flex items-center justify-center z-50 rounded-2xl" />
      )}

      <div className="flex justify-between items-start border-b border-slate-100 pb-5">
        <div>
          <h3 className="text-base font-bold text-slate-900">Personal details</h3>
          <p className="text-xs text-slate-400 mt-0.5">Update your photo and personal details here.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button type="button" variant="outline" className="w-auto py-2 text-xs" onClick={() => reset()}>Cancel</Button>
          <Button type="submit" disabled={isSaveDisabled} className="w-auto py-2 bg-brand-blue text-xs font-semibold">{isUpdating ? "Saving..." : "Save"}</Button>
        </div>
      </div>

      <div className="space-y-1">
        <div className={rowClass}>
          <label className={labelClass}>Name</label>
          <div className="w-full max-w-xl flex flex-col sm:flex-row gap-4">
            <input {...register('firstName')} placeholder="First name" className={inputClass} disabled={isUpdating} />
            <input {...register('lastName')} placeholder="Last name" className={inputClass} disabled={isUpdating} />
          </div>
        </div>

        <div className={rowClass}>
          <label className={labelClass}>Business name</label>
          <input {...register('businessName')} disabled className={inputClass} />
        </div>

        <div className={rowClass}>
          <label className={labelClass}>Business type</label>
          <input {...register('businessType')} disabled className={inputClass} />
        </div>

        <div className={rowClass}>
          <label className={labelClass}>Email address</label>
          <div className="w-full max-w-xl relative">
            <Sms size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input {...register('email')} type="email" disabled className={cn(inputClass, "pl-10")} />
          </div>
        </div>

        <div className={rowClass}>
          <label className={labelClass}>Country</label>
          <select {...register('country')} className={inputClass} disabled={isUpdating} value={user?.country}>
            <option value="Nigeria">🇳🇬 Nigeria</option>
            <option value="Australia">🇦🇺 Australia</option>
          </select>
        </div>

        <div className={rowClass}>
          <label className={labelClass}>Timezone</label>
          <select {...register('timezone')} className={inputClass} disabled={isUpdating}>
            <option value="West Africa Time (WAT) UTC+01:00">West Africa Time (WAT) UTC+01:00</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end items-center gap-2 pt-4">
        <Button type="button" variant="outline" className="w-auto py-2 text-xs" onClick={() => reset()}>Cancel</Button>
        <Button type="submit" disabled={isSaveDisabled} className="w-auto py-2 bg-brand-blue text-xs font-semibold">{isUpdating ? "Saving..." : "Save"}</Button>
      </div>
    </form>
  );
};