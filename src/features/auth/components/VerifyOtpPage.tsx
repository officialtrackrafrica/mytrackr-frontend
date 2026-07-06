import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useVerifyOTP } from '../hooks/useVerifyOtp';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Button } from '../../../components/ui/Button';
import { OtpInput } from './OtpInput';

export const VerifyOTPPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useVerifyOTP();

  const email = state?.email || "your email";
  const purpose = state?.purpose || 'signup'; 

const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    //  Flow 1: If this is a password reset, just pass the OTP forward!
    if (purpose === 'reset') {
      navigate('/reset-password', { 
        state: { email, token: otp } 
      });
      return;
    }

    //  Flow 2: If this is a new signup, actually verify it with the API
    if (purpose === 'signup') {
      mutate({ email, code: otp }, {
        onSuccess: () => navigate('/email-verified') 
      });
    }
  };
  return (
    <AuthLayout currentStep={2}>
      <div className="flex flex-col items-center w-full max-w-sm mx-auto text-center">
        {/* ... header remains the same ... */}
        
        <form onSubmit={onSubmit} className="w-full space-y-8">
          <OtpInput length={6} value={otp} onChange={setOtp} />

          <Button type="submit" isLoading={isPending}>Verify Code</Button>
          
          <p className="text-sm text-slate-500">
            Didn't receive the code? <button type="button" className="text-blue-600 font-bold">Resend</button>
          </p>
          
          <button type="button" onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400">
            ← Back to log in
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};