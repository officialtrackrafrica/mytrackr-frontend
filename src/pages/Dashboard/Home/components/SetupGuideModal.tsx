// src/components/dashboard/SetupGuideModal.tsx
import { useState } from 'react';
import { Button } from '../../../../components/ui/Button';

interface SetupGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SetupGuideModal = ({ isOpen, onClose }: SetupGuideModalProps) => {
  const [currentStep, setCurrentStep] = useState(0);

  if (!isOpen) return null;

  const handleNext = () => {
    if (currentStep < 4) setCurrentStep(prev => prev + 1);
  };

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  };

  const handleDone = () => {
    setCurrentStep(0);
    onClose();
  };

  const steps = [
    {
      title: "Welcome to your dashboard",
      content: (
        <div className="space-y-3">
          <p>We're glad to have you onboard. Here are some quick tips to get you started and help you make the best out of MyTrackr.</p>
          <p>On your <strong>"Dashboard" / "Home"</strong> screen, you can view all your business transaction highlights in one place.</p>
          <p>From your account balance, to your sales report, business expenses, profit & loss, and more. Make use of the duration dropdown to narrow down your data to your need.</p>
          <p>Manually log your cash transactions and generate reports.</p>
        </div>
      ),
      graphic: (
        <div className="w-full h-full bg-slate-50 flex flex-col items-center justify-end pb-4 px-8 relative">
          <div className="absolute top-4 left-4 font-bold text-xs text-slate-800">Profit and Loss</div>
          <div className="flex items-end gap-3 h-24 w-full justify-center">
            <div className="w-8 h-12 bg-emerald-400 rounded-t-sm" />
            <div className="w-8 h-20 bg-brand-blue rounded-t-sm" />
            <div className="w-8 h-10 bg-emerald-400 rounded-t-sm" />
            <div className="w-8 h-16 bg-brand-blue rounded-t-sm" />
          </div>
          <div className="flex gap-6 mt-2 text-[10px] text-slate-400 font-medium">
            <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span>
          </div>
        </div>
      )
    },
    {
      title: "See your live transactions in MyTrackr",
      content: (
        <div className="space-y-3">
          <p>Link your accounts, website, or upload your bank statement to see all your transactions</p>
          <p>You can also manually log cash transactions — physical cash that you paid to or received from a customer that would not enter into your bank account.</p>
          <p>Easily categorise your transactions using the dropdown provided or use AI to automatically categorise your transactions.</p>
          <p>Use the “Sort & Filter” button if you want specific transaction insights e.g. You want to see all “Repairs and Maintenance” transactions.</p>
          <p>Edit and Delete transactions if needed (an activity log will be maintained so you will know if a transaction was edited or deleted).</p>
        </div>
      ),
      graphic: (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">
          <div className="w-full bg-white rounded-md shadow-sm border border-slate-100 p-2 space-y-2">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="flex justify-between items-center bg-slate-50 p-1.5 rounded">
                <div className="w-16 h-2 bg-slate-200 rounded" />
                <div className="w-12 h-2 bg-emerald-200 rounded" />
                <div className="w-8 h-2 bg-slate-200 rounded" />
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      title: "Get your financial reports in seconds",
      content: (
        <div className="space-y-3">
          <p>Go to “Financial Report” in the menu bar. View and export your reports.</p>
          <p>Get a detailed view of your business’s cash, profit, and financial position.
Select the preferred period (This month, 6 months etc.) from the duration drop down menu.</p>
        </div>
      ),
      graphic: (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center relative">
          <div className="absolute top-6 right-8 bg-white p-3 rounded-xl shadow-md border border-slate-100 w-32 transform rotate-3">
             <p className="text-[10px] text-slate-500 mb-1">Cash Out</p>
             <p className="font-bold text-sm text-slate-800">₦800,000</p>
             <span className="text-[8px] text-red-500 bg-red-50 px-1 rounded inline-block mt-1">+12%</span>
          </div>
          <div className="absolute bottom-6 left-8 bg-white p-3 rounded-xl shadow-lg border border-slate-100 w-32 transform -rotate-3 z-10">
             <p className="text-[10px] text-slate-500 mb-1">Cash In</p>
             <p className="font-bold text-sm text-slate-800">₦800,000</p>
             <span className="text-[8px] text-emerald-500 bg-emerald-50 px-1 rounded inline-block mt-1">+10%</span>
          </div>
        </div>
      )
    },
    {
      title: "Keep track of your Assets and Liabilities in one place",
      content: (
        <div className="space-y-3">
          <p>Easily input your Assets and Liabilities to know your true financial position.</p>
          <p>Go to <strong>'Asset & Liability'</strong> in the menu bar to log your assets and liabilities.</p>
        </div>
      ),
      graphic: (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">
          <div className="w-48 bg-white rounded-xl shadow-md border border-slate-100 p-4">
            <div className="w-12 h-2 bg-slate-200 rounded mb-4" />
            <div className="space-y-3">
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Asset name</p>
                <div className="w-full h-6 bg-slate-50 rounded border border-slate-100" />
              </div>
              <div>
                <p className="text-[10px] text-slate-400 mb-1">Amount</p>
                <div className="w-20 h-6 bg-slate-50 rounded border border-slate-100" />
              </div>
              <div className="w-16 h-5 bg-pink-50 rounded-full flex items-center px-2">
                <div className="w-1.5 h-1.5 rounded-full bg-pink-500 mr-1" />
                <div className="w-8 h-1 bg-pink-200 rounded" />
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      title: "Estimate your 'Tax' based on your business type.",
      content: (
        <div className="space-y-3">
          <p>Our <strong>'Tax Calculator'</strong> estimate your tax liability based on your business type and total profit.</p>
          <p>Input deductions that can help reduce your tax burden e.g. HMO, Rent etc. in the spaces provided.</p>
        
        </div>
      ),
      graphic: (
        <div className="w-full h-full bg-slate-50 flex items-center justify-center p-4">
          <div className="w-full bg-white rounded-md shadow-sm border border-slate-100 p-3">
             <div className="flex justify-between border-b border-slate-100 pb-2 mb-2">
               <div className="w-20 h-2 bg-slate-300 rounded" />
               <div className="w-10 h-2 bg-slate-300 rounded" />
             </div>
             <div className="space-y-2">
               {[1, 2, 3].map(i => (
                 <div key={i} className="flex justify-between items-center">
                   <div className="w-32 h-2 bg-slate-200 rounded" />
                   <div className="w-8 h-2 bg-slate-200 rounded" />
                 </div>
               ))}
             </div>
             <div className="mt-3 p-2 bg-orange-50 rounded border border-orange-100">
                <div className="w-full h-1.5 bg-orange-200 rounded" />
             </div>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/50 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-[420px] max-h-[90vh] overflow-hidden flex flex-col shadow-xl animate-in slide-in-from-bottom-4 duration-300">
        
        {/* Graphic Header Area */}
        <div className="h-48 shrink-0 bg-slate-50 overflow-hidden">
          {steps[currentStep].graphic}
        </div>

        {/* Content Area */}
        <div className="p-6 overflow-y-auto flex-1">
          <h2 className="text-xl font-bold text-slate-900 mb-4">{steps[currentStep].title}</h2>
          <div className="text-sm text-slate-500 leading-relaxed">
            {steps[currentStep].content}
          </div>
        </div>

        {/* Footer & Controls */}
        <div className="p-6 pt-2 shrink-0">
          {/* Pagination Dots */}
          <div className="flex justify-center gap-1.5 mb-6">
            {steps.map((_, idx) => (
              <div 
                key={idx} 
                className={`h-1.5 rounded-full transition-all duration-300 ${currentStep === idx ? 'w-4 bg-brand-blue' : 'w-1.5 bg-slate-200'}`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-between gap-2">
            {/* Left Action: Skip or Previous */}
            {currentStep === 0 ? (
              <Button 
                onClick={handleDone}
                variant="ghost"
                className="px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-800 transition-colors"
              >
                Skip
              </Button>
            ) : (
              <Button variant="ghost" className="text-sm border-slate-200 text-slate-700" onClick={handlePrev}>
                Previous
              </Button>
            )}

            {/* Right Action: Next or Done */}
            {currentStep < steps.length - 1 ? (
              <Button className="text-sm" onClick={handleNext}>
                Next
              </Button>
            ) : (
              <Button className="" onClick={handleDone}>
                Done
              </Button>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};