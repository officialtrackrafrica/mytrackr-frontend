import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useBusinessTypes, useUpdateBusinessDetails } from '../hooks/useBusiness';
import { Input } from './ui/Input';
import { Dropdown } from './ui/Dropdown';
import { Button } from './ui/Button';
import { useQueryClient } from '@tanstack/react-query';

interface GoogleOnboardingModalProps {
  isOpen: boolean;
}

interface BusinessFormData {
  name: string;
  businessType: string;
}

export const GoogleOnboardingModal = ({ isOpen }: GoogleOnboardingModalProps) => {
  const { register, handleSubmit, control, formState: { errors } } = useForm<BusinessFormData>();
  const { data: businessTypes, isLoading: loadingTypes } = useBusinessTypes();
  const { mutate: updateBusiness, isPending } = useUpdateBusinessDetails();
const queryClient = useQueryClient();

  if (!isOpen) return null;

  const onSubmit = (data: BusinessFormData) => {
    updateBusiness(data, {
      onSuccess: () => {
        toast.success("Business details saved successfully!");
        queryClient.invalidateQueries({ queryKey: ['user'] }); 
        queryClient.invalidateQueries({ queryKey: ['googleSignupStatus'] });
      },
      onError: () => {
        toast.error("Failed to save details. Please try again.");
      }
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-8 shadow-xl animate-in zoom-in-95 duration-300">
        
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold text-slate-900">Welcome to MyTrackr!</h2>
          <p className="text-slate-500 text-sm mt-2">
            Since you signed up with Google, we just need a couple of details about your business to set up your dashboard.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <Input 
            label="Business name*" 
            placeholder="e.g. Acme Ventures Ltd" 
            error={errors.name?.message} 
            {...register("name", { required: "Business name is required" })} 
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Business type*</label>
            <Controller
              name="businessType"
              control={control}
              rules={{ required: "Business type is required" }}
              render={({ field: { onChange, value } }) => (
                <Dropdown 
                  options={businessTypes || []} 
                  value={value || ""} 
                  onChange={onChange} 
                  disabled={loadingTypes || isPending} 
                  placeholder="Select a business type..." 
                />
              )}
            />
            {errors.businessType && (
              <p className="text-red-500 text-xs mt-1">{errors.businessType.message}</p>
            )}
          </div>

          <Button type="submit" className="w-full mt-4" isLoading={isPending}>
            Complete Setup
          </Button>
        </form>

      </div>
    </div>
  );
};