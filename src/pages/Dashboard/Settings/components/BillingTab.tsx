// src/pages/dashboard/components/settings/BillingTab.tsx
import { ArrowDown, ArrowRight, DocumentDownload, Sms, TickCircle } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import { useState } from 'react';
import { useBillingHistory, useCurrentPlan, usePaymentMethod } from '../api/useBilling';
import { formatDate } from '../../../../utils/helpers';
import { UpgradePlanView } from './UpgradePlan';
import { Skeleton } from '../../../../components/ui/Skeleton';

export const BillingTab = () => {
  const [activeView, setActiveView] = useState<'dashboard' | 'upgrade'>('dashboard');
  // 1. Fetch Dynamic Data
  const { data: currentPlan, isLoading: loadingPlan } = useCurrentPlan();
  const { data: billingHistory, isLoading: loadingHistory } = useBillingHistory();
  const { data: paymentMethod, isLoading: loadingPayment } = usePaymentMethod();
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


                <span className="px-2 py-0.5 bg-blue-50 text-brand-blue text-[10px] font-bold rounded-full">{currentPlan?.activePlan.interval || 'Monthly'}</span>
              )}
            </div>
            {loadingPlan ? (
              <Skeleton className="h-4 w-16 rounded-full" />
            ) : (


              <p className="text-xs text-slate-500">{currentPlan?.activePlan.name || 'Loading plan details...'}</p>
            )}

            <div className="mt-4 flex items-end gap-1">
              {loadingPlan ? (
                <Skeleton className="h-4 w-16 rounded-full" />
              ) : (


                <span className="text-4xl font-black text-slate-900 tracking-tight">{loadingPlan ? '...' : `₦${currentPlan?.activePlan.price || 0}`}</span>
              )}
              <span className="text-sm text-slate-500 font-medium pb-1">per month</span>
            </div>
          </div>
          <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex justify-between items-center">
            <button className="text-xs font-bold text-brand-blue flex items-center gap-1 hover:text-blue-800 transition-colors" onClick={() => setActiveView('upgrade')}>
              Upgrade plan <ArrowRight size="14" />
            </button>
            <button className="text-xs font-bold text-slate-500 hover:text-slate-800 transition-colors">
              Cancel plan
            </button>
          </div>
        </div>

        {/* Card 2: Payment Method */}
        <div className="bg-white border border-slate-200 rounded-2xl shadow-xs">
          <div className="p-6">
            <div className="mb-4">
              <h4 className="text-sm font-bold text-slate-900">Payment method</h4>
              <p className="text-xs text-slate-500 mt-1">Change how you pay for your plan.</p>
            </div>

            <div className="p-4 border border-slate-200 rounded-xl bg-white flex items-start justify-between gap-4">
              {loadingPayment ? (
                <div className="text-sm text-slate-400 py-2">Loading card details...</div>
              ) : !paymentMethod ? (
                <div className="text-sm text-slate-500 py-2">No payment method added yet.</div>
              ) : (
                <div className="flex items-start gap-4">
                  {/* Dynamic Card Brand Logo */}
                  <div className="px-3 py-1.5 bg-white border border-slate-200 shadow-sm rounded-md flex items-center justify-center shrink-0 min-w-[50px]">
                    <span className="text-blue-800 font-black italic text-sm tracking-widest uppercase">
                      {paymentMethod.brand || 'CARD'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-sm font-bold text-slate-700 capitalize">
                      {paymentMethod.brand} ending in {paymentMethod.last4}
                    </p>
                    <p className="text-xs text-slate-500 font-medium">
                      Expiry {paymentMethod.expMonth}/{paymentMethod.expYear}
                    </p>
                    {/* Only show email if your backend returns it with the card */}
                    {paymentMethod.billingEmail && (
                      <div className="flex items-center gap-1.5 pt-1 text-slate-500">
                        <Sms size="14" />
                        <span className="text-xs font-medium">{paymentMethod.billingEmail}</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              <Button variant="outline" className="w-auto py-1.5 px-4 text-xs font-semibold border-slate-200 text-slate-700">
                {paymentMethod ? 'Edit' : 'Add card'}
              </Button>
            </div>
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

    </div>
  );
};