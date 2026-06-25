// src/components/ui/Dialog.tsx
import type { ReactNode } from 'react';
import { CloseCircle } from 'iconsax-react';

interface DialogProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  icon?: ReactNode;
  children: ReactNode;
}

export const Dialog = ({ isOpen, onClose, title, description, icon, children }: DialogProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      
      {/* Modal Content */}
      <div className="relative bg-white w-full h-[80vh] max-w-xl rounded-2xl shadow-2xl overflow-auto animate-in fade-in zoom-in duration-200 ">
        <div className="p-6">
          {/* NEW: Render the icon if passed */}
          {icon && (
            <div className="mb-4">
              {icon}
            </div>
          )}
          <div className="flex justify-between items-start mb-2">
            <h2 className="text-xl font-bold text-slate-900">{title}</h2>
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600">
              <CloseCircle size="24" />
            </button>
          </div>
          {description && <p className="text-sm text-slate-500 mb-6">{description}</p>}
          
          {children}
        </div>
      </div>
    </div>
  );
};