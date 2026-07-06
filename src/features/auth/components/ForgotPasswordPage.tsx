import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Logo from "../../../assets/Logo.png";
import { useForgotPassword } from '../hooks/useForgotPassword';

export const ForgotPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
const { mutate: requestReset, isPending } = useForgotPassword();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Call the actual API endpoint
    requestReset(email, {
      onSuccess: () => {
        // Only navigate if the request succeeds
        navigate('/verify-otp', { state: { email, purpose: 'reset' } });
      },
      onError: (error: any) => {
        // You could add a toast notification here
        console.error("Password reset request failed", error);
      }
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <img src={Logo} alt="Logo" className='w-24 mb-6'/>
          <h1 className="text-3xl font-bold text-slate-900">Reset your password</h1>
          <p className="text-slate-500 mt-2">
            Enter the email you use to login to MyTrackr and we will send you the link to recover your account.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input 
            label="Email" 
            type="email" 
            placeholder="Enter your email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          
          <Button type="submit" isLoading={isPending}>
            Send Code
          </Button>
        </form>

        <div className="text-center">
          <Link to="/login" className="text-sm font-bold text-slate-600 hover:text-slate-900">
             ← Back to log in
          </Link>
        </div>
      </div>
    </div>
  );
};