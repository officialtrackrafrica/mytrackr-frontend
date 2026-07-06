// src/features/auth/components/StepIndicator.tsx
import { TickCircle, Radio } from 'iconsax-react';

const steps = [
  { id: 1, label: 'Your details', desc: 'Please provide your name, business name, business type, email and create a password.' },
  { id: 2, label: 'Verification', desc: 'Verify your account' },
  { id: 3, label: 'Add your bank account', desc: 'Connect your accounts for transaction syncing' },
];

export const StepIndicator = ({ currentStep }: { currentStep: number }) => {
  return (
    <div className="flex flex-col gap-8 text-white">
      {steps.map((step) => (
        <div key={step.id} className="flex gap-4 items-start">
          <div className="mt-1">
            {step.id < currentStep ? (
              <TickCircle size="24" variant="Bold" className="text-blue-400" color='#D5E5FF' />
            ) : step.id === currentStep ? (
              <Radio size="24" variant="Bold" className="text-white" color='#D5E5FF' />
            ) : (
              <div className="w-6 h-6 rounded-full border-2 border-slate-500" />
            )}
          </div>
          <div className={step.id > currentStep ? "opacity-50" : "opacity-100"}>
            <p className="font-semibold text-sm">{step.label}</p>
            <p className="text-xs text-slate-300 max-w-[200px] leading-relaxed">
              {step.desc}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};