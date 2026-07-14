import { TickCircle } from 'iconsax-react';
import { Button } from '../../../components/ui/Button';
import { plans } from '../../../utils/plans';

interface SubscriptionStepProps {
  onSelectPlan: (planSlug: string) => void;
  isProcessing?: boolean;
}

export const SubscriptionStep = ({ onSelectPlan, isProcessing }: SubscriptionStepProps) => {
 

  return (
    <div className="w-full max-w-7xl px-4 py-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center mb-12 mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 mb-4">Choose your perfect plan</h2>
        <p className="text-slate-500">Select a plan to complete your MyTrackr account setup.</p>
      </div>

      <div className="grid lg:grid-cols-3 md:grid-cols-2 justify-between gap-6">
        {plans?.map((plan) => (  
          <div 
            key={plan.slug} 
            className="w-full bg-white border border-slate-200 rounded-xl p-8 flex flex-col hover:border-brand-blue/30 hover:shadow-lg transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <h3 className=" font-medium text-slate-700">{plan.name}</h3>
              {plan.isPopular && (
                <span className="px-3 py-1 bg-blue-50 text-brand-blue text-xs font-bold rounded-full">
                  Popular
                </span>
              )}
            </div>

            <div className="mb-4">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-slate-900 tracking-tight">₦{plan.price}</span>
                <span className="text-sm text-slate-500 font-medium">per month</span>
              </div>
            </div>

            <p className="text-sm text-slate-500 mb-8 h-10 line-clamp-2">
              {plan.description}
            </p>

            <Button 
              className="w-full bg-brand-blue text-white font-semibold rounded-xl mb-8 py-2"
              disabled={isProcessing}
              onClick={() => onSelectPlan(plan.slug)}
            >
              Get started
            </Button>

            <div className="flex-1">
              <p className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-6">Features</p>
              <ul className="space-y-4">
                {plan.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-sm text-slate-600">
                    <TickCircle size="16" color='#135ED6' className="text-brand-blue shrink-0" variant="Outline" />
                    <span className="leading-tight">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};