import { formatCurrency } from '../../../../utils/helpers';
import { InfoCircle } from 'iconsax-react'; 

interface TaxCalculationCardProps {
  taxData: any; 
  businessType: string;
}

export const TaxCalculationCard = ({ taxData, businessType }: TaxCalculationCardProps) => {
  if (!taxData) return null;

  // Check the business type 
  const isSoleProp = businessType === 'SOLE_PROPRIETORSHIP' || businessType === 'Sole Proprietorship';

  const pit = taxData.pitCalculation;
  const cit = taxData.citCalculation;

  const labelClass = "text-xs font-bold text-slate-400 uppercase tracking-wider mb-1";
  const valueClass = "text-base font-semibold text-slate-900";

  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-sm overflow-hidden">
      
      {/* Header Section */}
      <div className="bg-slate-50 border-b border-slate-100 p-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            {isSoleProp ? 'Personal Income Tax (PIT)' : 'Company Income Tax (CIT)'}
          </h3>
          <p className="text-sm text-slate-500 mt-1">
            Tax estimates for the {taxData.period?.month}/{taxData.period?.year} period
          </p>
        </div>
        <div className="bg-white px-3 py-1.5 rounded-lg border border-slate-200 text-xs font-bold text-slate-700 shadow-sm">
          {taxData.year} Assessment
        </div>
      </div>

      <div className="p-6">
        {/* ========================================== */}
        {/* SOLE PROPRIETORSHIP (PIT) VIEW             */}
        {/* ========================================== */}
        {isSoleProp && pit && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className={labelClass}>Chargeable Income</p>
                <p className={valueClass}>{formatCurrency(pit.chargeableIncome, 'NGN')}</p>
              </div>
              <div>
                <p className={labelClass}>Relief Allowance (CRA)</p>
                <p className={valueClass}>{formatCurrency(pit.consolidatedReliefAllowance, 'NGN')}</p>
              </div>
              <div>
                <p className={labelClass}>Minimum Tax Floor</p>
                <p className={valueClass}>{formatCurrency(pit.minimumTaxFloor, 'NGN')}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <p className="text-2xl text-slate-500 font-medium">Estimated Annual Tax</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatCurrency(pit.estimatedAnnualTax, 'NGN')}
                </p>
                {pit.minimumTaxApplied && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-600 bg-amber-50 px-2 py-0.5 rounded mt-2">
                    <InfoCircle size="12" /> Minimum tax rules applied
                  </span>
                )}
              </div>
              
              <div className="text-right w-full sm:w-auto border-t sm:border-t-0 sm:border-l border-slate-200 pt-4 sm:pt-0 sm:pl-6">
                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Monthly Set-Aside</p>
                <p className="text-lg font-bold text-brand-blue">
                  {formatCurrency(pit.estimatedMonthlySetAside, 'NGN')}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* ========================================== */}
        {/* LIMITED LIABILITY / OTHER (CIT) VIEW       */}
        {/* ========================================== */}
        {!isSoleProp && cit && (
          <div className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className={labelClass}>Company Size</p>
                <p className={valueClass}>{cit.companySize}</p>
              </div>
              <div>
                <p className={labelClass}>Tax Rate Applied</p>
                <p className={valueClass}>{cit.taxRateApplied}</p>
              </div>
              <div>
                <p className={labelClass}>Total Assets Considered</p>
                <p className={valueClass}>{formatCurrency(cit.totalAssetsConsidered, 'NGN')}</p>
              </div>
              <div>
                <p className={labelClass}>Assessable Profit</p>
                <p className={valueClass}>{formatCurrency(cit.assessableProfit, 'NGN')}</p>
              </div>
              <div>
                <p className={labelClass}>Est. Taxable Profit</p>
                <p className={valueClass}>{formatCurrency(cit.estimatedTaxableProfit, 'NGN')}</p>
              </div>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex flex-col sm:flex-row gap-4 justify-between items-center">
              <div>
                <p className="text-sm text-slate-500 font-medium">Estimated Annual Tax</p>
                <p className="text-2xl font-black text-slate-900 mt-1">
                  {formatCurrency(cit.estimatedAnnualTax, 'NGN')}
                </p>
                {cit.isExempt && (
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded mt-2">
                    <InfoCircle size="12" color="green" /> Tax Exempt Status Active
                  </span>
                )}
              </div>
            </div>
            <p className='text-lg'> <span className='font-bold'> Disclaimer:</span> This is a planning estimate only, not tax advice. Your actual tax may differ. 
</p>
          </div>
        )}

      </div>
    </div>
  );
};