// src/pages/dashboard/PaymentSuccessPage.tsx
import { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { TickCircle } from 'iconsax-react';
import { Button } from '../../../components/ui/Button';

export const PaymentSuccessPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  
  // Extract the reference from the Paystack redirect URL
  const reference = searchParams.get('reference');

  useEffect(() => {
    if (reference) {
      // Optional: You could fire an API call here to your backend to double-verify 
      // the payment if your backend isn't already relying solely on webhooks.
      console.log("Payment successful for reference:", reference);
    }
  }, [reference]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-sm border border-slate-200 p-8 text-center">
        <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <TickCircle size="32" variant="Bold" />
        </div>
        
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Payment Successful!</h2>
        <p className="text-sm text-slate-500 mb-6">
          Your subscription has been upgraded successfully. Your transaction reference is <span className="font-mono bg-slate-100 px-1 rounded">{reference}</span>.
        </p>

        <Button 
          className="w-full py-3 bg-brand-blue text-white"
          onClick={() => navigate('/dashboard/settings')} // Adjust to your actual dashboard route
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};