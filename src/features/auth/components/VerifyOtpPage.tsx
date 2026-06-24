import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { useVerifyOTP } from '../hooks/useVerifyOtp';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Button } from '../../../components/ui/Button';


export const VerifyOTPPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { handleSubmit, setValue, watch } = useForm({
    defaultValues: { otp: ["", "", "", "", "", ""] }
  });
  const { mutate, isPending } = useVerifyOTP();

  const email = state?.email || "your email";
  const otpValues = watch("otp");

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) return; // Only 1 digit per box
    setValue(`otp.${index}`, value);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const onSubmit = () => {
    mutate({ email, code: otpValues.join("") });
  };

  return (
    <AuthLayout currentStep={2}>
      <div className="flex flex-col items-center w-full max-w-sm mx-auto text-center">
        <div className="bg-blue-600 w-12 h-12 rounded-full mb-6 flex items-center justify-center">
           <div className="w-6 h-6 border-4 border-white rounded-full border-t-transparent" />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900">Verify your email</h2>
        <p className="text-slate-500 mt-2 mb-8">
          We sent a 6-digit code to <span className="font-semibold text-slate-800">{email}</span>
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="w-full space-y-8">
          <div className="flex justify-between gap-2">
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <input
                key={index}
                id={`otp-${index}`}
                type="text"
                maxLength={1}
                className="w-12 h-14 text-center text-2xl font-bold border-2 rounded-xl focus:border-blue-600 focus:ring-4 focus:ring-blue-100 outline-none transition-all"
                value={otpValues[index]}
                onChange={(e) => handleChange(index, e.target.value)}
              />
            ))}
          </div>

          <Button type="submit" isLoading={isPending}>Verify Code</Button>

          <p className="text-sm text-slate-500">
            Didn't receive the code? <button type="button" className="text-blue-600 font-bold">Resend</button>
          </p>
          
          <button onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400">
            ← Back to log in
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};