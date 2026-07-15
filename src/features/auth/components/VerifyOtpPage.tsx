import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useResendOTP, useVerifyOTP } from '../hooks/useVerifyOtp';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Button } from '../../../components/ui/Button';
import { OtpInput } from './OtpInput';
import { toast } from 'sonner';
import Logo from "../../../assets/Logo.png";


export const VerifyOTPPage = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [otp, setOtp] = useState("");
  const { mutate, isPending } = useVerifyOTP();
const { mutate: resendOtp, isPending: isResending } = useResendOTP();
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

  const handleResend = () => {
    if (!email || email === "your email") {
      toast.error("Email not found. Please try logging in again.");
      return;
    }

    resendOtp(email, {
      onSuccess: () => toast.success("Verification code resent successfully!"),
      onError: () => toast.error("Failed to resend code. Please try again later.")
    });
  };
  return (
    <AuthLayout currentStep={2}>
      <div className="flex flex-col items-center w-full max-w-sm mx-auto text-center">
<div className="flex flex-col items-center text-center mb-8">
          <img src={Logo} alt="MyTrackr Logo" className="w-24" />
          <h2 className="text-2xl font-bold text-slate-800">Check your email</h2>
          <p>We sent a verification link to {email}</p>
        </div>        
        <form onSubmit={onSubmit} className="w-full space-y-8">
          <OtpInput length={6} value={otp} onChange={setOtp} />

          <Button type="submit" isLoading={isPending}>Verify Code</Button>
          
          <p className="text-sm text-slate-500">
            Didn't receive the code? <button type="button" onClick={handleResend}
              disabled={isResending} className="text-blue-600 font-bold cursor-pointer">{isResending ? 'Resending...' : 'Resend'}</button>
          </p>
          
          <button type="button" onClick={() => navigate('/login')} className="text-sm font-bold text-slate-400">
            ← Back to log in
          </button>
        </form>
      </div>
    </AuthLayout>
  );
};