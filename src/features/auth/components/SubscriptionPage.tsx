// src/pages/auth/SubscriptionPage.tsx
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useUpgradePlan } from '../../../pages/Dashboard/Settings/api/useBilling';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { SubscriptionStep } from './SubscriptionStep';


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
        <SubscriptionStep 
          onSelectPlan={handlePlanSelection} 
          isProcessing={isSubscribing} 
        />
      </div>
    </AuthLayout>
  );
};