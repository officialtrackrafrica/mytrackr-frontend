import { Button } from '../../../components/ui/Button';
import { useNavigate } from 'react-router-dom';
import { TickCircle } from 'iconsax-react';

export const PasswordSuccessPage = () => {
  const navigate = useNavigate();
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
<div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
        <TickCircle size="40" color="#10b981" variant="Bold" />
      </div>
            <h1 className="text-3xl font-bold text-slate-900">Password reset</h1>
      <p className="text-slate-500 mt-2 mb-8">Your password has been successfully reset. Click below to log in.</p>
      <Button className="w-full max-w-sm" onClick={() => navigate('/login')}>Continue</Button>
    </div>
  );
};