// src/pages/dashboard/ProfitAndLossPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Calendar, DocumentText, InfoCircle } from 'iconsax-react';
import { useDownloadPnLReport, useProfitAndLoss } from './api/useProfitAndLoss';
import { formatCurrency } from '../../../utils/helpers';
import { toast } from 'sonner';
import { Button } from '../../../components/ui/Button';

export const ProfitAndLossPage = () => {
  const [dates, setDates] = useState({
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  });
const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const { data, isLoading, isError } = useProfitAndLoss(dates);
const isProfit = (data?.netProfit || 0) >= 0;
const { mutate: downloadReport, isPending: isDownloading } = useDownloadPnLReport();

const handleGenerateReport = (format: 'pdf' | 'csv') => {
    setIsExportMenuOpen(false); 

    downloadReport({ dates, format }, {
      onSuccess: () => toast.success(`P&L report (${format.toUpperCase()}) downloaded successfully!`),
      onError: () => toast.error('Failed to generate report. Please try again.')
    });
  };

  return (
    <DashboardLayout
      title="Financial Reports"
      subtitle="Profit and Loss Statement Overview"
      extra={
        <div className="relative">
        <Button 
          className="w-auto py-2 bg-brand-blue" 
          onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
          disabled={isDownloading || isLoading || isError}
        >
          <div className="flex items-center gap-2 text-white">
            {isDownloading && <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin" />}
            <DocumentText size="18" color="#fff" /> 
            {isDownloading ? 'Generating...' : 'Download report'}
          </div>
        </Button>
        {isExportMenuOpen && !isDownloading && !isLoading && !isError && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setIsExportMenuOpen(false)}></div>
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 shadow-lg rounded-xl flex flex-col overflow-hidden z-50 py-1 animate-in fade-in slide-in-from-top-2">
                <button onClick={() => handleGenerateReport('pdf')} className="px-4 py-2.5 text-sm font-medium text-slate-700 text-left hover:bg-slate-50 transition-colors">
                  Export as PDF
                </button>
                <button onClick={() => handleGenerateReport('csv')} className="px-4 py-2.5 text-sm font-medium text-slate-700 text-left hover:bg-slate-50 transition-colors">
                  Export as CSV
                </button>
              </div>
            </>
          )}
        </div>
        
      }
    >
      {/* 1. Date Range Filter controls */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
          <Calendar size="18" className="text-slate-400" />
          <span>Report Period:</span>
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

      {/* 2. Uncategorized Warning Header Banner if present */}
      {data && data.metadata?.uncategorisedCount > 0 && (
        <div className="mb-6 bg-amber-50 border border-amber-200 text-amber-900 rounded-xl p-4 flex items-center gap-3 text-sm">
          <InfoCircle size="20" className="text-amber-600 shrink-0" />
          <div>
            You have <span className="font-bold">{data.metadata.uncategorisedCount} uncategorised transactions</span> valued at <span className="font-bold">{formatCurrency(data.metadata.uncategorisedValue)}</span> within this period. This will alter the accuracy of your real profit statement.
          </div>
        </div>
      )}

      {/* 3. Main Statement Paper Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 lg:p-8 relative min-h-[400px]">
        {isLoading ? (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="py-12 text-center text-sm text-red-500 font-medium">
            Failed to parse statement payload definitions.
          </div>
        ) : (
          <div className="space-y-8">
            
            {/* ================= REVENUE SECTION ================= */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 px-2">
                <h3 className="text-base font-bold text-slate-900">Revenue</h3>
                <span className="text-xs font-bold text-slate-400 tracking-wider uppercase">Amount</span>
              </div>
              
              <div className="space-y-0.5">
                {data?.revenue?.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg">
                    <span>{line.subCategory}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(line.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-50 font-bold text-slate-800 rounded-lg mt-1">
                  <span>Total Revenue</span>
                  <span className="text-slate-900">{formatCurrency(data?.revenue?.total || 0)}</span>
                </div>
              </div>

              {/* Cost of Goods Sold (Nests under Revenue block in design spec layout) */}
              <div className="space-y-0.5 mt-4">
                {data?.cogs?.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg">
                    <span>{line?.subCategory}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(line.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-50 font-bold text-slate-800 rounded-lg mt-1">
                  <span>Total Cost of Goods Sold</span>
                  <span className="text-slate-900">{formatCurrency(data?.cogs?.total || 0)}</span>
                </div>
              </div>

              {/* Root Metric Summary block */}
              <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-100 font-bold text-slate-900 rounded-lg mt-3">
                <span>Gross Profit/Loss ({data?.grossProfitMargin || 0}%)</span>
                <span>{formatCurrency(data?.grossProfit || 0)}</span>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200" />

            {/* ================= OPERATING EXPENSES SECTION ================= */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 px-2">
                <h3 className="text-base font-bold text-slate-900">Business Expenses</h3>
              </div>
              
              <div className="space-y-0.5">
                {data?.expenses?.operating?.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg">
                    <span>{line.subCategory}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(line.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-50 font-bold text-slate-800 rounded-lg mt-1">
                  <span>Total Operating Expenses</span>
                  <span className="text-slate-900">{formatCurrency(data?.expenses?.operating?.total || 0)}</span>
                </div>
                <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-100 font-bold text-slate-900 rounded-lg mt-3">
                  <span>Operating Profit/Loss</span>
                  <span>{formatCurrency((data?.grossProfit || 0) - (data?.expenses?.operating?.total || 0))}</span>
                </div>
              </div>
            </div>

            <div className="border-t border-dashed border-slate-200" />

            {/* ================= OTHER EXPENSES SECTION ================= */}
            <div>
              <div className="flex justify-between items-center border-b border-slate-100 pb-2 mb-2 px-2">
                <h3 className="text-base font-bold text-slate-900">Other expenses</h3>
              </div>
              
              <div className="space-y-0.5">
                {data?.expenses?.other?.lines.map((line, idx) => (
                  <div key={idx} className="flex justify-between items-center px-6 py-3 text-sm text-slate-600 hover:bg-slate-50/40 rounded-lg">
                    <span>{line.label}</span>
                    <span className="font-medium text-slate-900">{formatCurrency(line.amount)}</span>
                  </div>
                ))}
                <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-50 font-bold text-slate-800 rounded-lg mt-1">
                  <span>Total Other Expenses</span>
                  <span className="text-slate-900">{formatCurrency(data?.expenses?.other?.total || 0)}</span>
                </div>
                {/* <div className="flex justify-between items-center px-4 py-3 text-sm bg-slate-900 text-white font-bold rounded-lg mt-4 shadow-sm shadow-slate-900/10">
                  <span>Net/Real Profit ({data?.netProfitMargin || 0}%)</span>
                  <span>{formatCurrency(data?.netProfit || 0)}</span>
                </div> */}

  <div className={`flex justify-between items-center px-4 py-3 text-sm font-bold text-white rounded-lg mt-4 shadow-sm shadow-slate-900/10 ${isProfit ? 'bg-green-600' : 'bg-red-600'}`}>
    <span>
      {isProfit ? 'Net/Real Profit' : 'Net/Real Loss'} ({data?.netProfitMargin || 0}%)
    </span>
    <span>{formatCurrency(data?.netProfit || 0)}</span>
  </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </DashboardLayout>
  );
};