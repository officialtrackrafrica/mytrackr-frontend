import { useState, type ReactNode } from 'react';
import { Sidebar } from './SideBar';
import { HambergerMenu } from 'iconsax-react';
import { useBusiness } from '../../hooks/useBusiness';
import { cn } from '../../utils/cn';
import Logo from '../../assets/Logo.png';
import { useCheckGoogleSignup } from '../../features/auth/hooks/useSignUp';
import { GoogleOnboardingModal } from '../GoogleOnboardingModal';
import { useUser } from '../../hooks/useUser';


interface Props {
  children: ReactNode;
  title?: string; // Optional: Override business name if needed
  subtitle?: string;
  extra?: ReactNode;
}

export const DashboardLayout = ({ children, title, subtitle, extra }: Props) => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const { business } = useBusiness();
  const { user, isLoading: isUserLoading } = useUser();
  const { data: googleCheck, isLoading: isChecking } = useCheckGoogleSignup();

 //  1. Derive the state directly. No useState, no useEffect!
  const showOnboarding = googleCheck?.signedUpWithGoogle === true && user?.hasSelectedBusinessType === false;

  if (isChecking || isUserLoading) {
    return <div className="min-h-screen bg-slate-50 flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* 1. Mobile Backdrop */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar with Responsive Classes */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-50 w-64 transform bg-white transition-transform duration-300 ease-in-out lg:translate-x-0",
        isSidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}>
        <Sidebar onClose={() => setSidebarOpen(false)} />
      </div>

      {/* 3. Main Content Area */}
      <main className="lg:pl-64 flex flex-col min-h-screen">
        
        {/* Responsive Header */}
        <header className="border-b border-[#D0D5DD] bg-white sticky top-0 z-30">
          {/* Mobile Top Bar (Only visible on small screens) */}
          <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
            <img src={Logo} alt="Logo" className="w-10" />
              <span className="font-bold text-slate-900">MyTrackr</span>
            </div>
            <button onClick={() => setSidebarOpen(true)} className="p-2 text-slate-600">
              <HambergerMenu size="24" color='#050E1E'/>
            </button>
          </div>

          {/* Desktop/Common Header Content */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-4 md:px-8 py-6">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-slate-900">
                {title || (business ? business.name : 'Loading...')}
              </h1>
              <p className="text-slate-500 text-sm md:text-base">
                {subtitle || "Welcome back!"}
              </p>
            </div>

            {extra && (
              <div className="flex gap-2 w-full md:w-auto">
                {extra}
              </div>
            )}

            {/* <div className="flex gap-2 w-full md:w-auto">
              <Button variant="outline" className=" md:w-auto  text-xs md:text-sm">
                <Add size="18" color='#050E1E'/> 
                <span className="ml-1">Log assets</span>
              </Button>
              <Button className=" md:w-auto py-2 bg-brand-blue text-xs md:text-sm">
                <DirectboxSend size="18" color='#fff'/> 
                <span className="ml-1">Generate report</span>
              </Button>
            </div> */}
          </div>
        </header>

        {/* Page Content */}
        <div className="flex-1 px-4 md:px-8 py-6 max-w-[1400px] mx-auto w-full">
          {children}
        </div>
      </main>
      <GoogleOnboardingModal 
        isOpen={showOnboarding} 
      />
    </div>
  );
};