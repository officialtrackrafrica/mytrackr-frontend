import { forwardRef } from 'react';
import type { InputHTMLAttributes } from 'react';
import { cn } from '../../utils/cn';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="text-xs font-semibold text-slate-600 block">
            {label}
          </label>
        )}
        <input
          ref={ref}
          className={cn(
            'w-full p-3 border rounded-lg outline-none transition-all placeholder:text-slate-400 text-slate-800',
            'focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500',
            error ? 'border-red-500' : 'border-slate-200',
            className
          )}
          {...props}
        />
        {error && (
          <p className="text-[10px] font-medium text-red-500 mt-1 italic">
            {error}
          </p>
        )}
      </div>
    );
  }
);