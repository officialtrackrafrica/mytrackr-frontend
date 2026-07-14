import type { ReactNode } from 'react';
import { StepIndicator } from '../../features/auth/components/StepIndicator';
import Logo from "../../assets/Logo.png";
import { cn } from '../../utils/cn';

interface AuthLayoutProps {
  children: ReactNode;
  currentStep: number;
}

export const AuthLayout = ({ children, currentStep }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-screen bg-white">
      {/* Left Side: Desktop Sidebar */}
      <div className="hidden lg:flex w-[20%] bg-[#0A2540] p-6 flex-col justify-between">
        <div>
          <div className="flex items-center gap-2 mb-20">
             <img src={Logo} alt="MyTrackr Logo" className="w-12" />
             <span className="text-white font-bold text-xl">MyTrackr</span>
          </div>
          <StepIndicator currentStep={currentStep} />
        </div>
        <div className="text-slate-400 text-xs flex justify-between">
          <span>© MyTrackr 2026</span>
          <span>nifemi@mytrackrservices.com</span>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full">
           {children}
        </div>
        {/* // Inside your AuthLayout component, below {children} */}
<div className="mt-12 flex justify-center gap-2 lg:hidden">
  {[1, 2, 3, 4].map((step) => (
    <div 
      key={step}
      className={cn(
        "h-1 w-8 rounded-full transition-all duration-300",
        currentStep >= step ? "bg-blue-600" : "bg-slate-200"
      )}
    />
  ))}
</div>
      </div>
    </div>
  );
};