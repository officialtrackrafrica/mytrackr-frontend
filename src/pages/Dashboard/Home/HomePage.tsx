
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { Add, DocumentUpload, InfoCircle, Lock1, More } from 'iconsax-react';
import { useAccounts } from '../../../hooks/useAccounts';
import { useTransactions } from '../../../hooks/useTransactions';
import { usePlanAccess } from '../../../hooks/usePlanAccess';
import { formatCurrency } from '../../../utils/helpers';
import { TransactionsTable } from '../Transactions/components/TransactionTable';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useDashboardMetrics } from '../../../hooks/useDashboard';
import { Skeleton } from '../../../components/ui/Skeleton';
import { LinkWebsiteForm } from './components/LinkWebsiteForm';
import { useGetIntegrations } from '../../../hooks/useIntegrations';
import { SetupGuideModal } from './components/SetupGuideModal';
import { LogTransactionModal } from '../Transactions/components/LogTransactionsModal';
import { UploadStatementModal } from '../Transactions/components/UploadStatementModal';

const toISODate = (date: Date) => date.toISOString().split('T')[0];

const getDateRange = (preset: string) => {
  const today = new Date();
  let start = new Date();
  let end = new Date();

  if (preset === 'this-month') {
    start = new Date(today.getFullYear(), today.getMonth(), 1);
  } else if (preset === 'last-month') {
    start = new Date(today.getFullYear(), today.getMonth() - 1, 1);
    end = new Date(today.getFullYear(), today.getMonth(), 0); // Last day of previous month
  } else if (preset === 'this-year') {
    start = new Date(today.getFullYear(), 0, 1);
  }

  return { startDate: toISODate(start), endDate: toISODate(end) };
};

export const HomePage = () => {
  const navigate = useNavigate()
  const { accounts, isLoading: accountsLoading } = useAccounts();
  const { data: transactions } = useTransactions({ limit: 10 });
const [isGuideModalOpen, setIsGuideModalOpen] = useState(false);
  const [datePreset, setDatePreset] = useState('this-month');
  const { startDate, endDate } = getDateRange(datePreset);
  const { data: metrics, isLoading: metricsLoading, error: metricsError } = useDashboardMetrics(startDate, endDate);
    const [isLogModalOpen, setLogModalOpen] = useState(false);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);
  const { data: integrations } = useGetIntegrations();
  const hasLinkedWebsite = integrations && integrations.length > 0;
  const { canLinkWebsite, maxBanksAllowed, canUploadManual } = usePlanAccess();
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const accountSlots = [
    { id: 'primary', title: 'Primary account', index: 0 },
    { id: 'secondary', title: 'Secondary account', index: 1 }
  ];

  return (
    <DashboardLayout
    extra={
      <div className="flex justify-end mb-6 gap-2">
                  <Button variant="primary" className="flex w-auto py-2" onClick={() => setUploadModalOpen(true)}>
                    <DocumentUpload size="18" color='white' /> Upload statement
                  </Button>
                  <Button variant="outline" className="flex w-auto py-2" onClick={() => setLogModalOpen(true)}>
                    <Add size="18" color='#050E1E' /> Log transactions
                  </Button>
        <button 
          onClick={() => setIsGuideModalOpen(true)}
          className="flex items-center gap-2 text-slate-600 hover:text-brand-blue text-sm font-semibold transition-colors bg-white border border-slate-200 px-4 py-2 rounded-xl shadow-sm cursor-pointer"
        >
          <InfoCircle size="18" color='#475467'/>
          Guide
        </button>
      </div>
    }
    >

      {/* Account Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {accountsLoading ? (
          // Loading Skeleton
          [1, 2].map((i) => (
            <div key={i} className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm animate-pulse h-[140px]" />
          ))
        ) : (
          accountSlots.map((slot) => {
            const account = accounts[slot.index];

            if (account) {
              // ==========================================
              // FILLED STATE (Account Connected)
              // ==========================================
              return (
                <div key={slot.id} className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm flex items-center gap-8 relative">
                  <button className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                    <More size="20" />
                  </button>

                  {/* Circular Progress (Filled) */}
                  <div className="relative w-24 h-24 shrink-0">
                    <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                      <path
                        className="text-slate-100"
                        strokeDasharray="100, 100"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                      <path
                        className="text-brand-blue"
                        strokeDasharray="70, 100"
                        stroke="currentColor"
                        strokeWidth="4"
                        strokeLinecap="round"
                        fill="none"
                        d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                      />
                    </svg>
                  </div>

                  <div className="pr-8">
                    <p className="text-slate-900 font-bold mb-3">{account.institutionName || slot.title}</p>
                    <p className="text-xs text-slate-500 mb-1">Current balance</p>
                    <p className="text-2xl font-black text-slate-900 tracking-tight">
                      {formatCurrency(account.balance, account.currency)}
                    </p>
                  </div>
                </div>
              );
            }

            // ==========================================
            // EMPTY STATE (Matching Image Mockup)
            // ==========================================
            return (
              <div key={slot.id} className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm flex items-center gap-6 relative">
                <button className="absolute top-6 right-6 text-slate-400 hover:text-slate-600 transition-colors">
                  <More size="20" />
                </button>

                {/* Segmented Doughnut Placeholder */}
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#F1F5F9" strokeWidth="8" strokeDasharray="20 80" strokeDashoffset="0" />
                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#CBD5E1" strokeWidth="8" strokeDasharray="20 80" strokeDashoffset="-22" />
                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#94A3B8" strokeWidth="8" strokeDasharray="20 80" strokeDashoffset="-44" />
                    <circle cx="18" cy="18" r="14" fill="transparent" stroke="#64748B" strokeWidth="8" strokeDasharray="20 80" strokeDashoffset="-66" />
                  </svg>
                </div>

                <div className="flex flex-col gap-4 md:w-[70%]">
                  <h4 className="text-base font-bold text-slate-900">{slot.title}</h4>

                  <div className="flex items-center gap-3 pr-8">
                    {/*  Show Mono Button if Plan Allows */}
                    {maxBanksAllowed > slot.index ? (
                      <Button className="bg-brand-blue text-white py-2 px-4 text-xs font-semibold h-auto" onClick={() => navigate('/link-bank')}>
                        Link Bank Account
                      </Button>
                    ) : null}

                    {/*  Show Website Button if Plan Allows */}
                    {canLinkWebsite && !hasLinkedWebsite ? (
                      <Button variant="outline" className="py-2 px-4 text-xs font-semibold h-auto border-slate-200 text-slate-700 hover:bg-slate-50 w-full" onClick={() => setIsLinkModalOpen(true)}>
                        Link Website
                      </Button>
                    ) : null}

                    {/*  Fallback for Starter Plan (No Mono, No Website) */}
                    {maxBanksAllowed <= slot.index && !canLinkWebsite && canUploadManual && slot.index === 0 && (
                      <Button variant="outline" className="py-2 px-4 text-xs font-semibold h-auto border-slate-200 text-slate-700">
                        Upload Statement
                      </Button>
                    )}

                    {/*  Upgrade Prompt for Secondary Slot if locked out */}
                    {maxBanksAllowed <= slot.index && slot.index > 0 && (
                      <Button variant="outline" className="py-2 px-4 text-xs font-semibold h-auto border-slate-100 text-slate-400 cursor-not-allowed w-full">
                        Go to settings to upgrade plan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

   
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-6">
        <div>
          <h2 className="text-lg font-bold text-slate-900">Financial Overview</h2>
          <p className="text-sm text-slate-500">Track your revenue, expenses, and profit</p>
        </div>

        {/* The single date picker controlling the dashboard */}
        <select
          value={datePreset}
          onChange={(e) => setDatePreset(e.target.value)}
          className="mt-4 sm:mt-0 px-4 py-2 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-1 focus:ring-brand-blue outline-none cursor-pointer shadow-sm"
        >
          <option value="this-month">This Month</option>
          <option value="last-month">Last Month</option>
          <option value="this-year">This Year</option>
        </select>
      </div>

      {/* ========================================== */}
      {/* 3. KEY METRICS ROW (The Three Stats)       */}
      {/* ========================================== */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

        {/* Revenue Card */}
        <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Revenue</p>
          {metricsLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : metricsError ? (
            <div className="flex flex-col items-start gap-3 mt-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Lock1 size="18" />
                <span className="text-sm font-semibold">Data locked</span>
              </div>
              <Button
                onClick={() => navigate('/subscribe')} //  Routes them to your plans page
                className="w-auto py-1.5 px-4 text-xs font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe to unlock
              </Button>
            </div>
          ) : (
            <p className="text-3xl font-bold text-slate-900">
              {formatCurrency(metrics?.revenue || 0, 'NGN')}
            </p>
          )}
        </div>

        {/* Expenses Card */}
        <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Total Expenses</p>
          {metricsLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : metricsError ? (
            <div className="flex flex-col items-start gap-3 mt-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Lock1 size="18" />
                <span className="text-sm font-semibold">Data locked</span>
              </div>
              <Button
                onClick={() => navigate('/subscribe')} //  Routes them to your plans page
                className="w-auto py-1.5 px-4 text-xs font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe to unlock
              </Button>
            </div>
          ) : (
            <p className="text-3xl font-bold text-slate-900">
              {formatCurrency(metrics?.expenses || 0, 'NGN')}
            </p>
          )}
        </div>

        {/* Net Profit Card */}
        <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
          <p className="text-sm font-medium text-slate-500 mb-2">Net Profit</p>
          {metricsLoading ? (
            <Skeleton className="h-8 w-32" />
          ) : metricsError ? (
            <div className="flex flex-col items-start gap-3 mt-1">
              <div className="flex items-center gap-2 text-slate-400">
                <Lock1 size="18" />
                <span className="text-sm font-semibold">Data locked</span>
              </div>
              <Button
                onClick={() => navigate('/subscribe')} //  Routes them to your plans page
                className="w-auto py-1.5 px-4 text-xs font-semibold bg-brand-blue text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Subscribe to unlock
              </Button>
            </div>
          ) : (
            <p className={`text-3xl font-bold ${Number(metrics?.netProfit) < 0 ? 'text-red-500' : 'text-emerald-500'}`}>
              {formatCurrency(metrics?.netProfit || 0, 'NGN')}
            </p>
          )}
        </div>

      </div>

      {/* Recent Transactions Table */}
      <div className="p-6 border border-slate-100 rounded-2xl bg-white shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h3 className="font-bold text-lg">Recent transactions</h3>
          <Button onClick={() => navigate('/transactions')} className="text-white text-sm font-bold hover:underline w-fit">View all</Button>
        </div>
        <TransactionsTable data={transactions || []} />
      </div>
      {isLinkModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <LinkWebsiteForm onClose={() => setIsLinkModalOpen(false)} />
        </div>
      )}
      <LogTransactionModal
              isOpen={isLogModalOpen}
              onClose={() => {
                setLogModalOpen(false);
              }}
            />
      <SetupGuideModal 
        isOpen={isGuideModalOpen} 
        onClose={() => setIsGuideModalOpen(false)} 
      />
       <UploadStatementModal
              isOpen={isUploadModalOpen}
              onClose={() => setUploadModalOpen(false)}
            />
    </DashboardLayout>
  );
};