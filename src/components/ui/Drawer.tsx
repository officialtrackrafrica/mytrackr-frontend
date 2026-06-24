// src/components/ui/Drawer.tsx
import { useEffect, type ReactNode } from 'react';
import { CloseCircle } from 'iconsax-react';

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  children: ReactNode;
}

export const Drawer = ({ isOpen, onClose, title, description, children }: DrawerProps) => {
  // Prevent background scrolling when drawer layer handles active viewport view rules
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[150] flex justify-end">
      {/* Backdrop Fade-in click dismiss zone */}
      <div 
        className="fixed inset-0 bg-slate-900/30 backdrop-blur-xs animate-in fade-in duration-200"
        onClick={onClose}
      />
      
      {/* Panel Sliding Panel Content */}
      <div className="relative w-full max-w-md h-full bg-white shadow-2xl flex flex-col justify-between z-10 animate-in slide-in-from-right duration-300 ease-out">
        
        {/* Top Header Section */}
        <div className="p-6 border-b border-slate-100">
          <div className="flex justify-between items-start mb-1">
            <h2 className="text-lg font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <CloseCircle size="24" color="#050E1E" />
            </button>
          </div>
          {description && <p className="text-xs text-slate-500 leading-relaxed">{description}</p>}
        </div>

        {/* Dynamic Form Scroll Body Tier */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {children}
        </div>
      </div>
    </div>
  );
};