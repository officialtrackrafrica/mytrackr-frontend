// src/pages/dashboard/TaxCalculatorPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { useTaxCalculatorEstimate } from './api/useTaxCalculator';
import { formatCurrency } from '../../../utils/helpers';
import { CloseCircle, Calculator } from 'iconsax-react';
import { useUser } from '../../../hooks/useUser';
import { TaxCalculationCard } from './components/TaxCalculationCard';

export const TaxCalculatorPage = () => {
  const [showBrackets, setShowBrackets] = useState(true);
  const { user } = useUser();
  const businessType = user?.businessType;
  console.log(user)
  const [year, setYear] = useState<number>(2026);
  const [inputs, setInputs] = useState({
    healthInsurance: '',
    lifeInsurance: '',
    pension: '',
    housingFund: '',
    rent: '',
    extra: '',
  });

  // 1. Unpack data payload params into flat contract parameters for the GET serializer
  const queryParams = {
    year: Number(year),
    healthInsurance: Number(inputs.healthInsurance) || 0,
    lifeInsurance: Number(inputs.lifeInsurance) || 0,
    pension: Number(inputs.pension) || 0,
    housingFund: Number(inputs.housingFund) || 0,
    rent: Number(inputs.rent) || 0,
    extra: Number(inputs.extra) || 0,
  };

  // 2. Feed current config state to lazy query instance
  const { data, refetch, isFetching } = useTaxCalculatorEstimate(queryParams);

  const handleCalculate = (e: React.FormEvent) => {
    e.preventDefault();
    refetch(); // Fires off the custom formatted GET query string
  };

  const handleInputChange = (field: keyof typeof inputs, val: string) => {
    setInputs(prev => ({ ...prev, [field]: val }));
  };

  const inputCellClass = "w-32 px-2.5 py-1 text-right bg-slate-50 border border-slate-200 rounded-lg text-sm font-semibold outline-none focus:bg-white focus:ring-1 focus:ring-brand-blue transition-all";

  return (
    <DashboardLayout
      title="Tax Calculator"
      subtitle="Input deductions to accurately forecast corporate and individual tax liabilities."
    >
      <form onSubmit={handleCalculate} className="space-y-6 mt-4">

        {/* 1. Compulsory Year and Action Filter Selection bar */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <label className="text-sm font-bold text-slate-700 whitespace-nowrap">Tax Year*:</label>
            <select
              value={year}
              onChange={(e) => setYear(Number(e.target.value))}
              className="px-3 py-1.5 bg-white border border-slate-200 rounded-xl text-xs font-bold text-slate-700 outline-none focus:ring-1 focus:ring-brand-blue"
            >
              {[2024, 2025, 2026, 2027].map(yr => (
                <option key={yr} value={yr}>{yr} Fiscal Period</option>
              ))}
            </select>
          </div>


        </div>

        {/* 2. Progressive Tax Band Legend */}
        {showBrackets && (
          <div className="p-5 bg-slate-50 border border-slate-200 rounded-2xl relative animate-in fade-in">
            <button type="button" onClick={() => setShowBrackets(false)} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors">
              <CloseCircle size="18" />
            </button>
            <div className="grid grid-cols-2 gap-4 text-xs font-bold text-slate-400 uppercase tracking-wider mb-3 border-b pb-2">
              <div>Portion of annual taxable income(₦)</div>
              <div>Tax rate (%)</div>
            </div>
            <div className="space-y-1.5 text-xs text-slate-700 font-medium">
              <div className="flex justify-between"><span>First ₦800,000.00</span><span className="font-bold text-slate-900">0% (Tax Free)</span></div>
              <div className="flex justify-between"><span>Next ₦2,200,000.00 (₦800,001.00 - ₦3,000,000.00)</span><span className="font-bold text-slate-900">15%</span></div>
              <div className="flex justify-between"><span>Next ₦9,000,000.00 (₦3,000,001.00 - ₦12,000,000.00)</span><span className="font-bold text-slate-900">18%</span></div>
              <div className="flex justify-between"><span>Above ₦50,000,000.00</span><span className="font-bold text-slate-900">25%</span></div>
            </div>
          </div>
        )}

        {/* 3. Main Operational Form Sheet layout */}
        <div className="grid grid-cols-1 ">
   <p className='p-2'>Our Tax Calculator helps you estimate your tax liability based on your business type and total profit. Input deductions that can help reduce your tax burden e.g. HMO, Rent etc. in the spaces provided.
</p>
          {/* LEFT/MID: Interactive Deductions Grid lists */}
          <div className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-xs relative">
            {isFetching && (
              <div className="absolute inset-0 bg-white/50 backdrop-blur-xs flex items-center justify-center z-10 rounded-2xl transition-all" />
            )}
         
            <div className="flex justify-between border-b pb-2 text-sm font-bold text-slate-900">
              <span>Deductions & Allowances</span>
              <span>Amount (₦)</span>
            </div>

            <div className="space-y-3">
              {[
                { label: "Health Insurance (HMO)", key: "healthInsurance" },
                { label: "Life Insurance", key: "lifeInsurance" },
                { label: "Pension Scheme contribution", key: "pension" },
                { label: "National Housing Fund (NHF)", key: "housingFund" },
                { label: "Rent / Housing Expense Allowance", key: "rent" },
                { label: "Other Allowable Expenses (Extra)", key: "extra" },
              ].map((item) => (
                <div key={item.key} className="flex justify-between items-center py-1 px-2 hover:bg-slate-50/40 rounded-lg transition-colors">
                  <label className="text-sm text-slate-600 font-medium">{item.label}</label>
                  <input
                    type="number"
                    value={inputs[item.key as keyof typeof inputs]}
                    onChange={(e) => handleInputChange(item.key as any, e.target.value)}
                    className={inputCellClass}
                  />
                </div>
              ))}
            </div>

            {data && (
              <div className="border-t pt-3 space-y-2 animate-in fade-in">
                <div className="flex justify-between text-sm font-bold text-slate-900 px-2 bg-slate-50 py-2.5 rounded-xl">
                  <span>Total Deductions Applied</span>
                  <span>{formatCurrency(data.deductions?.total || 0)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-slate-900 px-2 bg-slate-50 py-2.5 rounded-xl">
                  <span>Calculated Taxable Profit Margin</span>
                  <span>{formatCurrency(data.taxableProfit || 0)}</span>
                </div>
              </div>
            )}
          </div>
          {data && (
            <div className="animate-in slide-in-from-bottom-4 fade-in duration-500 mt-4">
              <TaxCalculationCard
                taxData={data}
                businessType={businessType || ''}
              />
            </div>
          )}

         
        </div>
         <div className="flex justify-end w-full h-fit mt-4">
            <Button
              type="submit"
              disabled={isFetching}
              className="bg-brand-blue text-xs font-semibold px-6 py-2 w-fit flex items-center justify-center gap-2"
            >
              <Calculator size="16" color="white" />
              {isFetching ? "Evaluating..." : "Calculate Estimate"}
            </Button>
          </div>


      </form>
    </DashboardLayout>
  );
};