import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Input } from '../../../components/ui/Input';
import { Button } from '../../../components/ui/Button';
import Logo from "../../../assets/Logo.png";
import { useResetPassword } from '../hooks/useForgotPassword';

export const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const { state } = useLocation(); // Retrieve email/token from OTP step
  const [passwords, setPasswords] = useState({ newPassword: '', confirmPassword: '' });
  const { mutate: resetPassword, isPending } = useResetPassword();

 const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      return alert("Passwords do not match");
    }

    // Matching the exact Swagger request structure
    resetPassword({
      email: state?.email,
      token: state?.token, // This is the OTP code from the previous screen
      newPassword: passwords.newPassword
    }, {
      onSuccess: () => navigate('/password-success')
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      <div className="w-full max-w-sm space-y-8">
        <div className="flex flex-col items-center text-center">
          <img src={Logo} alt="Logo" className='w-24 mb-6'/>
          <h1 className="text-3xl font-bold text-slate-900">Set new password</h1>
          <p className="text-slate-500 mt-2">Your new password must be different to previously used passwords.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <Input label="Password" type="password" placeholder="••••••••" 
            onChange={(e) => setPasswords({...passwords, newPassword: e.target.value})} />
          <Input label="Confirm Password" type="password" placeholder="••••••••" 
            onChange={(e) => setPasswords({...passwords, confirmPassword: e.target.value})} />
          <p className="text-xs text-slate-400">Must be at least 8 characters.</p>
          <Button type="submit" isLoading={isPending}>Reset password</Button>
        </form>
      </div>
    </div>
  );
};