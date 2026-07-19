// src/pages/dashboard/components/settings/UpgradePlanView.tsx
import { ArrowLeft, TickCircle } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import { toast } from 'sonner';
import { useAvailablePlans, useUpgradePlan } from '../api/useBilling';
import { useState } from 'react';
// import { plans } from '../../../../utils/plans';

interface UpgradePlanViewProps {
  onBack: () => void;
  currentPlanId?: string;
}

export const UpgradePlanView = ({ onBack, currentPlanId }: UpgradePlanViewProps) => {
  const { data: plans } = useAvailablePlans();
  const { mutate: upgradePlan, isPending } = useUpgradePlan();
  const [loadingPlanSlug, setLoadingPlanSlug] = useState<string | null>(null);

const handleUpgrade = (planSlug: string) => {
  setLoadingPlanSlug(planSlug);
    upgradePlan(
      { 
        planSlug: planSlug, 
        interval: 'monthly' // You can make this dynamic later if you add a Monthly/Yearly toggle!
      }, 
      {
        onSuccess: (response) => {
          if (response?.authorizationUrl) {
            toast.loading("Redirecting to secure checkout...");
            
            //  3. Redirect the user away from your app to Paystack
            window.location.href = response.authorizationUrl; 
          } else {
            // Fallback just in case it was a free plan or didn't need checkout
            toast.success("Successfully updated your subscription plan!");
            onBack(); 
          }
        },
        onError: () => {
          toast.error("Failed to upgrade plan. Please try again.");
        }
      }
    );
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
      
      {/* Header with Back Button */}
      <div>
        <button 
          onClick={onBack} 
          className="flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-blue-800 transition-colors mb-6"
        >
          <ArrowLeft size="18" /> Back to settings
        </button>
        <h3 className="text-xl font-bold text-slate-900">Account plans</h3>
        <p className="text-sm text-slate-500 mt-1">Pick an account plan that fits your workflow.</p>
      </div>

      {/* Plans List */}
      <div className="space-y-4">
        {plans?.map((plan: any) => {
            const isCurrent = plan.id === currentPlanId;
const isThisButtonLoading = isPending && loadingPlanSlug === plan.slug;
            return (
              <div 
                key={plan.id} 
                className={`border rounded-2xl p-6 flex flex-col md:flex-row gap-6 transition-all ${
                  isCurrent ? 'border-brand-blue bg-blue-50/30' : 'border-slate-200 hover:border-brand-blue bg-white'
                }`}
              >
                {/* Left Side: Pricing */}
                <div className="md:w-1/3 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="font-bold text-slate-900">{plan.name}</h4>
                      {plan.isPopular && (
                        <span className="px-2.5 py-0.5 bg-blue-100 text-brand-blue text-[10px] font-bold rounded-full">
                          Popular
                        </span>
                      )}
                    </div>
                    <div className="flex items-end gap-1 mb-2">
                      <span className="text-4xl font-black text-slate-900 tracking-tight">₦{plan.price}</span>
                      <span className="text-sm text-slate-500 font-medium pb-1">per month</span>
                    </div>
                    <p className="text-xs text-slate-500">{plan.description}</p>
                  </div>
                  
                  <Button 
                    className="w-full mt-6 bg-brand-blue text-sm font-semibold disabled:opacity-50"
                    disabled={isCurrent || isPending}
                    onClick={() => handleUpgrade(plan.slug)}
                  >
{isCurrent 
        ? "Current Plan" 
        : isThisButtonLoading 
          ? "Processing..." 
          : "Subscribe now"
      }
                        </Button>
                </div>

                {/* Right Side: Features */}
                <div className="md:w-2/3 md:border-l border-slate-100 md:pl-6">
                  <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Features</p>
                  {plan.basePlanName && (
                    <p className="text-sm text-slate-500 mb-4">
                      Everything in <span className="font-bold text-slate-700">{plan.basePlanName}</span> plus....
                    </p>
                  )}
                  <ul className="space-y-3">
                    {plan.features
                    ?.filter((feature: string) => !feature.includes('_'))
                    ?.map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-sm text-slate-600">
                        <TickCircle size="18" color='#135ED6' className="text-brand-blue shrink-0" variant="Bold" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })
        }
      </div>
    </div>
  );
};