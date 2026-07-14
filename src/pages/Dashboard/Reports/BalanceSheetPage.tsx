// src/pages/dashboard/BalanceSheetPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Calendar, InfoCircle, Danger } from 'iconsax-react';
import { useBalanceSheet } from './api/useBalanceSheet'; // Adjust path as needed
import { formatCurrency } from '../../../utils/helpers';

export const BalanceSheetPage = () => {
  const [dates, setDates] = useState({
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  });

  const { data, isLoading, isError } = useBalanceSheet(dates);
  console.log(data)

  return (
    <DashboardLayout
      title="Balance Sheet"
      subtitle="Keep track of your business assets and liabilities."
    >
      {/* 1. Date Range Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
          <Calendar size="18" className="text-slate-400" />
          <span>Date range:</span>
        </div>
        
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <input 
            type="date"
            value={dates.startDate}
            onChange={(e) => setDates(prev => ({ ...prev, startDate: e.target.value }))}
            className="w-full sm:w-auto px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-brand-blue shadow-sm cursor-pointer"
          />
          <span className="text-slate-400 text-xs font-bold">to</span>
          <input 
            type="date"
            value={dates.endDate}
            onChange={(e) => setDates(prev => ({ ...prev, endDate: e.target.value }))}
            className="w-full sm:w-auto px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-medium text-slate-700 outline-none focus:ring-1 focus:ring-brand-blue shadow-sm cursor-pointer"
          />
        </div>
      </div>

      {/* 2. Accounting Integrity Check Warning Strip */}
      {data && !data.integrityCheck?.isValid && (
        <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-900 rounded-xl p-4 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
          <Danger size="20" className="text-rose-600 shrink-0" variant="Bold" />
          <div>
            <span className="font-bold">Unbalanced Book Warning:</span> Your statement has a discrepancy of <span className="font-bold">{formatCurrency(data.integrityCheck.difference)}</span> on the basic equation rule (<span className="italic">{data.integrityCheck.equation}</span>). Check your transaction assignments.
          </div>
        </div>
      )}

      {/* 3. Main Sheet Layer */}
      <div className="relative min-h-[500px] space-y-6">
        {isLoading ? (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="py-12 bg-white rounded-2xl border border-slate-200 text-center text-sm text-red-500 font-medium">
            Failed to process Balance Sheet datasets.
          </div>
        ) : (
          <>
            {/* Top Stat Overview Grid Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { title: "Total Assets", val: data?.summary?.totalAssets || 0 },
                { title: "Total Liabilities", val: data?.summary?.totalLiabilities || 0 },
                { title: "Owner's Money", val: data?.summary?.ownersEquity || 0 },
              ].map((card, i) => (
                <div key={i} className="p-6 bg-white border border-slate-200 rounded-2xl flex justify-between items-start shadow-xs relative group hover:border-slate-300 transition-all">
                  <div className="space-y-1">
                    <p className="text-xs font-semibold text-slate-400 tracking-wider">{card.title}</p>
                    <p className="text-2xl md:text-3xl font-bold text-slate-900">{formatCurrency(card.val)}</p>
                  </div>
                  <button className="text-slate-300 hover:text-slate-500 transition-colors">
                    <InfoCircle size="18" />
                  </button>
                </div>
              ))}
            </div>

            {/* Core Statement Paper Document Sheet Container */}
            <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8">
              
              {/* <div className="flex justify-end text-right mb-6">
                <span className="text-xs font-bold text-slate-900 bg-slate-50 px-3 py-1.5 rounded-md">
                  February 2026
                </span>
              </div> */}

              {/* ================= ASSETS BREAKDOWN ================= */}
              <div className="mb-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 px-2">
                  <h3 className="text-base font-bold text-slate-900">Assets / What you Own</h3>
                  <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Amount</span>
                </div>
                <div className="space-y-0.5">
                  {/* Bank Accounts Sub-list */}
                  {data?.assets?.bankAccounts?.map((bank) => (
                    <div key={bank.id} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg transition-colors">
                      <span>Cash in {bank.name}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(bank.balance)}</span>
                    </div>
                  ))}
                  {/* Other Valuables Sub-list */}
                  {data?.assets?.businessAssets?.map((asset, idx) => (
                    <div key={idx} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg transition-colors">
                      <span>{asset.name}</span>
                      <span className="font-medium text-slate-900">{formatCurrency(asset.value)}</span>
                    </div>
                  ))}
                  <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-100/80 font-bold text-slate-900 rounded-lg mt-2">
                    <span>Total Assets</span>
                    <span>{formatCurrency(data?.assets?.totalAssets || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="my-8 border-t border-dashed border-slate-200" />

              {/* ================= LIABILITIES BREAKDOWN ================= */}
              <div className="mb-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 px-2">
                  <h3 className="text-base font-bold text-slate-900">Liabilities / Debt you Owe</h3>
                </div>
                <div className="space-y-0.5">
                  {data?.liabilities?.activeLiabilities?.length === 0 ? (
                    <div className="text-slate-400 text-xs italic px-6 py-2">No active liabilities recorded.</div>
                  ) : (
                    data?.liabilities?.activeLiabilities?.map((liability, idx) => (
                      <div key={idx} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg transition-colors">
                        <span>{liability.name}</span>
                        <span className="font-medium text-slate-900">{formatCurrency(liability.amountOwed)}</span>
                      </div>
                    ))
                  )}
                  <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-100/80 font-bold text-slate-900 rounded-lg mt-2">
                    <span>Total Liabilities / Debts</span>
                    <span>{formatCurrency(data?.liabilities?.totalLiabilities || 0)}</span>
                  </div>
                </div>
              </div>

              <div className="my-8 border-t border-dashed border-slate-200" />

              {/* ================= EQUITY BREAKDOWN ================= */}
              <div className="mb-6">
                <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 px-2">
                  <h3 className="text-base font-bold text-slate-900">Owner's Money</h3>
                </div>
                <div className="space-y-0.5">
                  <div className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg transition-colors">
                    <span>Owner's Investments</span>
                    <span className="font-medium text-slate-900">{formatCurrency(data?.equity?.ownerInvestments || 0)}</span>
                  </div>
                  <div className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg transition-colors">
                    <span>Retained Profits</span>
                    <span className="font-medium text-slate-900">{formatCurrency(data?.equity?.retainedProfits || 0)}</span>
                  </div>
                 <div className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg transition-colors">
                      <span>Owner Withdrawals</span>
                      <span className="font-medium text-rose-600">{formatCurrency(data?.equity.ownerWithdrawals ?? 0)}</span>
                    </div>
                  <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-100/80 font-bold text-slate-900 rounded-lg mt-2">
                    <span>Total Owner's Money</span>
                    <span>{formatCurrency(data?.equity?.ownersEquity || 0)}</span>
                  </div>
                </div>
              </div>

            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};