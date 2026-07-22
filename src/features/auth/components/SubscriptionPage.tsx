// src/pages/auth/SubscriptionPage.tsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUpgradePlan } from '../../../pages/Dashboard/Settings/api/useBilling';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { SubscriptionStep } from './SubscriptionStep';
import { ArrowLeft } from 'iconsax-react';


export const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { mutate: subscribe, isPending: isSubscribing } = useUpgradePlan();

  const handlePlanSelection = (planSlug: string) => {
    subscribe(
      { planSlug, interval: 'monthly' }, 
      {
        onSuccess: (response) => {
          if (response?.authorizationUrl) {
            toast.loading("Redirecting to secure checkout...");
            window.location.href = response.authorizationUrl;
          } else {
            // No payment required (e.g., Free Plan)
            toast.success("Account setup complete!");
            navigate('/dashboard'); 
          }
        },
        onError: () => {
          toast.error("Failed to initiate subscription. Please try again.");
        }
      }
    );
  };

  return (
    <AuthLayout currentStep={3}>
      <div className=""> 
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors cursor-pointer"
        >
          <ArrowLeft size="18" color='#1A1A1A'/>
          Back
        </button>
        <SubscriptionStep 
          onSelectPlan={handlePlanSelection} 
          isProcessing={isSubscribing} 
        />
      </div>
    </AuthLayout>
  );
};