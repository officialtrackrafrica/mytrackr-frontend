// src/pages/dashboard/components/settings/BillingTab.tsx
import { ArrowDown, ArrowRight, DocumentDownload, TickCircle } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import { useState } from 'react';
import { useBillingHistory, useCancelSubscription, useCurrentPlan } from '../api/useBilling';
import { formatDate } from '../../../../utils/helpers';
import { UpgradePlanView } from './UpgradePlan';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { toast } from 'sonner';

const CancelSubscriptionModal = ({ isOpen, onClose, onConfirm, isPending }: any) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95 duration-200">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Cancel Subscription</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to cancel your current subscription? You will lose access to premium features at the end of your billing cycle.
        </p>
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="flex-1" 
            onClick={onClose} 
            disabled={isPending}
          >
            Keep Plan
          </Button>
          <Button 
            className="flex-1 bg-red-600 text-white hover:bg-red-700 border-transparent" 
            onClick={onConfirm} 
            isLoading={isPending}
          >
            Yes, Cancel
          </Button>
        </div>
      </div>
    </div>
  );
};

export const BillingTab = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'upgrade'>('dashboard');
  // 1. Fetch Dynamic Data
  const { data: currentPlan, isLoading: loadingPlan } = useCurrentPlan();
  const { data: billingHistory, isLoading: loadingHistory } = useBillingHistory();
  // const { data: paymentMethod, isLoading: loadingPayment } = usePaymentMethod();
const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription();

  const handleConfirmCancel = () => {
    cancelSubscription(undefined, {
      onSuccess: () => {
        toast.success("Subscription cancelled successfully.");
        setIsCancelModalOpen(false); // Close modal on success
      },
      onError: () => {
        toast.error("Failed to cancel subscription. Please try again.");
      }
    });
  };


  // If the user clicks "Upgrade", we return the new view instead of the dashboard!
  if (activeView === 'upgrade') {
    return (
      <UpgradePlanView
        onBack={() => setActiveView('dashboard')}
        currentPlanId={currentPlan?.id}
      />
    );
  }
  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* Header Section */}
      <div className="border-b border-slate-100 pb-5">
        <h3 className="text-base font-bold text-slate-900">Billing</h3>
        <p className="text-xs text-slate-500 mt-0.5">Manage your billing and payment details.</p>
      </div>

      {/* Top Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        {/* Card 1: Current Plan */}
        <div className="bg-white border border-slate-200 rounded-2xl flex flex-col justify-between overflow-hidden shadow-xs">
          <div className="p-6">
            <div className="flex items-center gap-3 mb-2">
              <h4 className="text-sm font-bold text-slate-900">Current plan</h4>
              {loadingPlan ? (
                <Skeleton className="h-4 w-16 rounded-full" />
              ) : (


                <span className="px-2 py-0.5 bg-blue-50 text-brand-blue text-[10px] font-bold rounded-full">{currentPlan?.activePlan?.interval || 'Monthly'}</span>
              )}
            </div>
            {loadingPlan ? (
              <Skeleton className="h-4 w-16 rounded-full" />
            ) : (
              <p className="text-xs text-slate-500">{currentPlan?.activePlan?.name || 'No current plan'}</p>
            )}

            <div className="mt-4 flex items-end gap-1">
              {loadingPlan ? (
                <Skeleton className="h-4 w-16 rounded-full" />
              ) : (


                <span className="text-4xl font-black text-slate-900 tracking-tight">{loadingPlan ? '...' : `₦${currentPlan?.activePlan?.price || 0}`}</span>
              )}
              <span className="text-sm text-slate-500 font-medium pb-1">per month</span>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <button className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:text-blue-800 transition-colors" onClick={() => setActiveView('upgrade')}>
              Upgrade plan <ArrowRight size="14" />
            </button>
           <button 
              onClick={() => setIsCancelModalOpen(true)}
              disabled={!currentPlan?.activePlan} 
              className="text-xs font-bold text-slate-500 hover:text-red-600 transition-colors disabled:opacity-50"
            >
              Cancel plan
            </button>
          </div>
        </div>

       

      </div>

      {/* Table Section: Billing History */}
      <div className="pt-2">
        <h4 className="text-sm font-bold text-slate-900 mb-4">Billing history</h4>

        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden overflow-x-auto">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
                <th className="p-4 w-12"><input type="checkbox" className="rounded border-slate-300" /></th>
                <th className="p-4 font-semibold flex items-center gap-1">
                  Invoice <ArrowDown size="12" />
                </th>
                <th className="p-4 font-semibold">Amount</th>
                <th className="p-4 font-semibold">Date</th>
                <th className="p-4 font-semibold">Status</th>
                <th className="p-4 w-12"></th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loadingHistory ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">Loading billing history...</td>
                </tr>
              ) : billingHistory?.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-8 text-center text-slate-400">No billing history found.</td>
                </tr>
              ) : (
                billingHistory?.map((item: any) => (
                  <tr key={item.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="p-4"><input type="checkbox" className="rounded border-slate-300" /></td>
                    <td className="p-4 font-medium text-slate-700">{item.reference}</td>
                    <td className="p-4 text-slate-600">{item.currency}{item.amount}</td>
                    <td className="p-4 text-slate-600">{formatDate(item.createdAt)}</td>
                    <td className="p-4">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-[#027A48] border border-emerald-100">
                        <TickCircle size="14" color='#027A48' />
                        {item.status}
                      </span>
                    </td>
                    <td className="p-4">
                      <button className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-all opacity-80 group-hover:opacity-100">
                        <DocumentDownload size="18" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
<CancelSubscriptionModal 
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancel}
        isPending={isCanceling}
      />
    </div>
  );
};