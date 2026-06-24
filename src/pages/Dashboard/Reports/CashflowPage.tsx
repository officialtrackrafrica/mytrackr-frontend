// src/pages/dashboard/CashflowPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Calendar, InfoCircle, ArrowUp, ArrowDown, Warning2 } from 'iconsax-react';
import { useCashflow } from './api/useCashflow';
import { formatCurrency } from '../../../utils/helpers';
import { cn } from '../../../utils/cn';

interface MetricCardProps {
  title: string;
  value: number;
  percentage?: number; // Made optional since it's not in the response yet
  isPositive?: boolean;
}

const CashflowMetricCard = ({ title, value, percentage, isPositive }: MetricCardProps) => (
  <div className="p-6 border border-slate-200 bg-white rounded-2xl flex justify-between items-center relative group hover:border-slate-300 transition-all shadow-xs">
    <div className="space-y-2">
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</p>
      <div className="flex items-center gap-3">
        <p className="text-2xl md:text-3xl font-bold text-slate-900">
          {formatCurrency(value)}
        </p>
        
        {/* Only render trend pill if percentage is passed down */}
        {typeof percentage === 'number' && (
          <div className={cn(
            "flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[10px] font-bold shrink-0",
            isPositive ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-600"
          )}>
            {isPositive ? <ArrowUp size="10" variant="Bold" /> : <ArrowDown size="10" variant="Bold" />}
            <span>{percentage}%</span>
          </div>
        )}
      </div>
    </div>

    <button className="text-slate-300 hover:text-slate-500 transition-colors self-start sm:self-center">
      <InfoCircle size="20" variant="Linear" />
    </button>
  </div>
);

export const CashflowPage = () => {
  const [dates, setDates] = useState({
    startDate: '2026-01-01',
    endDate: '2026-12-31'
  });

  const { data, isLoading, isError } = useCashflow(dates);
console.log(data)

  return (
    <DashboardLayout
      title="Creamy Cakes"
      subtitle="Cashflow Statement Overview"
    >
      {/* 1. Date Range Section */}
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 mb-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-slate-700 text-sm font-semibold">
          <Calendar size="18" className="text-slate-400" />
          <span>Select Range:</span>
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

      {/* 2. Critical Runway Alert Banner */}
      {data?.lowRunwayAlert && (
        <div className="mb-6 bg-red-50 border border-red-200 text-red-900 rounded-xl p-4 flex items-center gap-3 text-sm animate-in fade-in slide-in-from-top-2">
          <Warning2 size="20" className="text-red-600 shrink-0" variant="Bold" />
          <div>
            <span className="font-bold">Low Runway Warning:</span> Your business has less than 3 months of operational runway left based on your current burn rate. Consider optimizing expenses.
          </div>
        </div>
      )}

      {/* 3. Main Metrics Container */}
      <div className="relative min-h-[400px] space-y-4">
        {isLoading ? (
          <div className="absolute inset-0 bg-white/70 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl">
            <div className="w-8 h-8 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
          </div>
        ) : isError ? (
          <div className="py-12 bg-white rounded-2xl border text-center text-sm text-red-500 font-medium">
            Failed to process cashflow tracking summaries.
          </div>
        ) : (
          <>
            {/* Flat properties mapped directly from the payload */}
            <CashflowMetricCard 
              title="Cash In" 
              value={data?.cashIn || 0} 
            />
            
            <CashflowMetricCard 
              title="Cash Out" 
              value={data?.cashOut || 0} 
            />
            
            <CashflowMetricCard 
              title="Cash Balance" 
              value={data?.cashBalance || 0} 
            />
            
            <CashflowMetricCard 
              title="Burn Rate" 
              value={data?.monthlyBurnRate || 0} 
            />

            {/* Custom Runway Card Info Box */}
            {data?.monthsOfRunway !== undefined && (
              <div className="p-6 border border-slate-200 bg-slate-50/60 rounded-2xl flex justify-between items-center">
                <div>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Business Runway</p>
                  <p className="text-2xl font-bold text-slate-900">
                    {data.monthsOfRunway} <span className="text-sm font-medium text-slate-500">Months left</span>
                  </p>
                </div>
                <div className={cn(
                  "px-3 py-1 rounded-full text-xs font-bold",
                  data.lowRunwayAlert ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"
                )}>
                  {data.lowRunwayAlert ? "At Risk" : "Stable"}
                </div>
              </div>
            )}

            {/* Explainer Block Box Element */}
            <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-6 mt-6">
              <h4 className="text-base font-bold text-slate-900 mb-2">
                What is <span className="text-brand-blue">"Burn rate"</span> ?
              </h4>
              <p className="text-sm text-slate-600 leading-relaxed">
                Burn rate is the pace at which your company or business spends its available cash reserves to finance overhead costs before generating positive cash flow. Usually measured monthly, it indicates how quickly a company depletes its capital and determines the "runway," or time remaining before needing more funding or turning a profit.
              </p>
            </div>
          </>
        )}
      </div>
    </DashboardLayout>
  );
};