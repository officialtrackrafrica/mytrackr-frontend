import { useNavigate } from 'react-router-dom';
import { Button } from '../../../components/ui/Button';

export const AllSetupPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white text-center">
      <div className="w-full max-w-sm flex flex-col items-center animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* Custom CSS Illustration matching your mockup */}
        <div className="relative w-32 h-32 mb-6 flex items-center justify-center">
          {/* Back document (Light blue) */}
          <div className="absolute top-2 right-4 w-16 h-20 bg-blue-50 rounded-lg border border-blue-100 transform rotate-12 origin-bottom-right" />
          
          {/* Middle document (White) */}
          <div className="absolute top-4 right-6 w-16 h-20 bg-white rounded-lg border border-slate-200 shadow-sm transform rotate-6 origin-bottom-right" />
          
          {/* Front document (White with lines) */}
          <div className="absolute top-6 right-8 w-16 h-20 bg-white rounded-lg border border-slate-200 shadow-md flex flex-col p-3 gap-2 z-10">
             <div className="w-8 h-1.5 bg-brand-blue/20 rounded-full" />
             <div className="w-full h-1.5 bg-slate-100 rounded-full" />
             <div className="w-5/6 h-1.5 bg-slate-100 rounded-full" />
             <div className="w-full h-1.5 bg-slate-100 rounded-full" />
          </div>

          {/* Overlapping Blue Checkmark Badge */}
          <div className="absolute bottom-4 left-6 z-20 w-10 h-10 bg-brand-blue rounded-full border-4 border-white flex items-center justify-center shadow-lg">
            <svg width="14" height="10" viewBox="0 0 14 10" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 5L4.5 8.5L12.5 0.5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        <h1 className="text-3xl font-bold text-slate-900 mb-3">You are all setup!</h1>
        <p className="text-slate-500 mb-8 leading-relaxed px-4">
          Proceed to your dashboard to start enjoying real time money insights.
        </p>
        
        <Button 
          className="w-full" 
          onClick={() => navigate('/dashboard')}
        >
          Continue to dashboard
        </Button>
      </div>
    </div>
  );
};