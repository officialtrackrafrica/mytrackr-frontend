// src/components/ui/LockedFeatureOverlay.tsx
import { Crown } from 'iconsax-react';
import { useNavigate } from 'react-router-dom';
import { Button } from './ui/Button';

interface LockedFeatureOverlayProps {
  title: string;
  description: string;
  minHeight?: string;
}

export const LockedFeatureOverlay = ({ 
  title, 
  description, 
  minHeight = "min-h-[250px]" 
}: LockedFeatureOverlayProps) => {
  const navigate = useNavigate();

  return (
    <div className={`relative w-full h-full ${minHeight} flex items-center justify-center p-6 border border-slate-100 rounded-2xl bg-slate-50 overflow-hidden group`}>
      {/* Subtle dotted background to hint at a "wireframe" of the feature */}
      <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="relative z-10 flex flex-col items-center text-center max-w-sm px-4">
        <div className="w-12 h-12 bg-amber-100 text-amber-600 rounded-full flex items-center justify-center mb-4 shadow-sm group-hover:scale-110 transition-transform duration-300">
          <Crown size="24" variant="Bold" />
        </div>
        
        <h3 className="text-lg font-bold text-slate-900 mb-2">
          {title}
        </h3>
        
        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          {description}
        </p>
        
        <Button 
          onClick={() => navigate('/subscribe')} 
          className="bg-slate-900 text-white hover:bg-slate-800 shadow-md px-6 rounded-xl"
        >
          View upgrade plans
        </Button>
      </div>
    </div>
  );
};