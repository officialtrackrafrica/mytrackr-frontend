// src/pages/dashboard/components/settings/PasswordTab.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '../../../../components/ui/Button';
import { toast } from 'sonner';
import { useChangePassword } from '../api/useChangePassword';
import { Input } from '../../../../components/ui/Input';

const passwordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "Your new password must be more than 8 characters."),
  confirmPassword: z.string().min(1, "Please confirm your new password"),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

type PasswordFormValues = z.infer<typeof passwordSchema>;

export const PasswordTab = () => {
  const { register, handleSubmit, reset, formState: { errors, isDirty } } = useForm<PasswordFormValues>({
    resolver: zodResolver(passwordSchema),
  });

 // Initialize the mutation hook
  const { mutate: changePassword, isPending } = useChangePassword();

  const onSubmit = (formData: PasswordFormValues) => {
    // Map the form data to match the exact backend payload requirements
    changePassword(
      {
        oldPassword: formData.currentPassword, 
        newPassword: formData.newPassword
      },
      {
        onSuccess: () => {
          toast.success("Password updated successfully!");
          reset(); // Clears the form and resets isDirty
        },
        onError: () => {
          // You can extract the exact error message from your backend response here if you want to be more specific!
          toast.error("Failed to update password. Please check your current password.");
        }
      }
    );
  };

 

  const rowClass = "flex flex-col md:flex-row md:items-start justify-between py-5 border-b border-slate-100 gap-2 md:gap-8";
  const labelClass = "text-sm font-semibold text-slate-700 md:w-64 shrink-0 pt-2";
  const inputClass = "w-full max-w-xl px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-400 shadow-xs";

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      
      {/* SECTION 1: Password Update Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex justify-between items-start border-b border-slate-100 pb-5">
          <div>
            <h3 className="text-base font-bold text-slate-900">Password</h3>
            <p className="text-xs text-slate-400 mt-0.5">Please enter your current password to change your password.</p>
          </div>
          <div className="flex items-center gap-2">
            <Button type="button" variant="outline" className="w-auto py-2 text-xs" onClick={() => reset()}>Cancel</Button>
            <Button type="submit" disabled={!isDirty} className="w-auto py-2 bg-brand-blue text-xs font-semibold disabled:opacity-60">
              {isPending ? "Updating..." : "Update password"}
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          {/* Current Password */}
          <div className={rowClass}>
            <label className={labelClass}>Current password</label>
            <div className="w-full max-w-xl">
              <Input type="password" {...register('currentPassword')} disabled={isPending} className={inputClass} placeholder="••••••••" />
              {errors.currentPassword && <span className="text-[10px] text-red-500 block mt-1">{errors.currentPassword.message}</span>}
            </div>
          </div>

          {/* New Password */}
          <div className={rowClass}>
            <label className={labelClass}>New password</label>
            <div className="w-full max-w-xl">
              <Input type="password" {...register('newPassword')} disabled={isPending} className={inputClass} placeholder="••••••••" />
              <p className="text-xs text-slate-400 mt-1.5">Your new password must be more than 8 characters.</p>
              {errors.newPassword && <span className="text-[10px] text-red-500 block mt-1">{errors.newPassword.message}</span>}
            </div>
          </div>

          {/* Confirm New Password */}
          <div className={rowClass}>
            <label className={labelClass}>Confirm new password</label>
            <div className="w-full max-w-xl">
              <Input type="password" {...register('confirmPassword')} className={inputClass} placeholder="••••••••" />
              {errors.confirmPassword && <span className="text-[10px] text-red-500 block mt-1">{errors.confirmPassword.message}</span>}
            </div>
          </div>
        </div>
      </form>

      {/* SECTION 2: Active Telemetry Login Sessions list */}
      {/* <div className="pt-4">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h4 className="text-sm font-bold text-slate-900">Where you're logged in</h4>
            <p className="text-xs text-slate-400 mt-0.5">We'll alert you via user email if there is any unusual activity on your account.</p>
          </div>
          <button type="button" className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
            View all
          </button>
        </div>

        <div className="divide-y divide-slate-100 border-t border-b border-slate-100">
          {activeSessions.map((session) => (
            <div key={session.id} className="flex items-start gap-4 py-4 px-2 hover:bg-slate-50/40 rounded-xl transition-colors">
              <div className="p-2 bg-slate-50 text-slate-400 rounded-lg shrink-0">
                <Monitor size="20" className="text-slate-500" />
              </div>
              <div className="space-y-0.5">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-sm font-bold text-slate-800">{session.device}</span>
                  {session.isActiveNow && (
                    <span className="bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-100 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active now
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-400 font-medium">
                  {session.location} • <span className="text-slate-400/80">{session.time}</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </div> */}

    </div>
  );
};