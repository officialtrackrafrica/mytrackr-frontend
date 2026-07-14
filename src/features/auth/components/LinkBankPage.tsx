import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';
import { useMonoInitiate } from '../hooks/useMonoInitiate';

export const LinkBankPage = () => {
  const navigate = useNavigate();
const { mutate, isPending } = useMonoInitiate();


  return (
    // <AuthLayout currentStep={3}>
    <div className=''>
      <div className="flex flex-col items-center justify-center w-full max-w-sm mx-auto text-center h-[100vh]">
        <div className="bg-blue-600 w-12 h-12 rounded-full mb-6 flex items-center justify-center text-white">
           <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
             <path d="M3 21h18M3 10h18M5 10V7a2 2 0 012-2h10a2 2 0 012 2v3M7 21v-11M11 21v-11M15 21v-11M19 21v-11" />
           </svg>
        </div>
        
        <h2 className="text-3xl font-bold text-slate-900">Link your bank account</h2>
        <p className="text-slate-500 mt-2 mb-8">
          Connect your bank account to automatically sync your transactions and track your spending.
        </p>

        <div className="w-full space-y-3">
          <Button 
            onClick={() => mutate()} 
            isLoading={isPending}
            className="bg-[#1652F0] hover:bg-[#0039CB] py-4"
          >
           
            Link Bank Account
          </Button>

          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard')}
            className="text-slate-500 font-medium"
          >
            Skip for now
          </Button>
        </div>

       
      </div>
</div>
    // </AuthLayout>
  );
};