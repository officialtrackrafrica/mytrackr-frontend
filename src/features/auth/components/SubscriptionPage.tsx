// src/pages/auth/SubscriptionPage.tsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { useUpgradePlan } from '../../../pages/Dashboard/Settings/api/useBilling';
import { AuthLayout } from '../../../components/layout/AuthLayout';
import { SubscriptionStep } from './SubscriptionStep';
import { ArrowLeft } from 'iconsax-react';
import { SelectBankModal, type BankSelection } from '../../../components/SelectBankModal';
import { planRequiresBank, plans } from '../../../utils/plans';


export const SubscriptionPage = () => {
  const navigate = useNavigate();
  const { mutate: subscribe, isPending: isSubscribing } = useUpgradePlan();

  // Plan waiting on a bank selection before we can start checkout
  const [pendingPlanSlug, setPendingPlanSlug] = useState<string | null>(null);

  const startSubscription = (planSlug: string, bank?: BankSelection) => {
    subscribe(
      { planSlug, interval: 'monthly', ...bank }, 
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
        onError: (error) => {
          const message = isAxiosError(error) ? error.response?.data?.message : undefined;
          toast.error(message || "Failed to initiate subscription. Please try again.");
        }
      }
    );
  };

  const handlePlanSelection = (planSlug: string) => {
    if (planRequiresBank(planSlug)) {
      setPendingPlanSlug(planSlug);
    } else {
      startSubscription(planSlug);
    }
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

      {pendingPlanSlug && (
        <SelectBankModal
          planName={plans.find((plan) => plan.slug === pendingPlanSlug)?.name}
          isSubmitting={isSubscribing}
          onClose={() => setPendingPlanSlug(null)}
          onConfirm={(bank) => startSubscription(pendingPlanSlug, bank)}
        />
      )}
    </AuthLayout>
  );
};