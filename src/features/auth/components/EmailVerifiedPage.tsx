// src/pages/auth/EmailVerifiedPage.tsx
import { useNavigate } from 'react-router-dom';
import { TickCircle } from 'iconsax-react';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { Button } from '../../../components/ui/Button';

export const EmailVerifiedPage = () => {
  const navigate = useNavigate();

  return (
    <AuthLayout currentStep={2}>
      <div className="flex flex-col items-center w-full max-w-sm mx-auto text-center animate-in fade-in zoom-in-95 duration-500">
        
        {/* Success Icon */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mb-6">
          <TickCircle size="40" color="#10b981" variant="Bold" />
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900">Email verified</h2>
        <p className="text-slate-500 mt-2 mb-8 px-4">
          Your account has been successfully verified. Click below to log in.
        </p>

        <div className="w-full space-y-4">
          <Button 
            className="w-full" 
            onClick={() => navigate('/all-setup')}
          >
            Continue
          </Button>
          
          <button 
            onClick={() => navigate('/login')} 
            className="text-sm font-bold text-slate-400 hover:text-slate-600 transition-colors"
          >
            ← Back to log in
          </button>
        </div>

      </div>
    </AuthLayout>
  );
};