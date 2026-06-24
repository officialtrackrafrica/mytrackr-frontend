// src/components/ui/DatePicker.tsx
import { Calendar } from 'iconsax-react';
import { cn } from '../../utils/cn';

interface DatePickerProps {
  label?: string;
  value: string; // Expected format: YYYY-MM-DD
  onChange: (value: string) => void;
  min?: string;
  max?: string;
  disabled?: boolean;
  className?: string;
}

export const DatePicker = ({
  label,
  value,
  onChange,
  min,
  max,
  disabled = false,
  className,
}: DatePickerProps) => {
  return (
    <div className="relative w-full">
      {label && (
        <label className="block text-sm font-medium text-slate-700 mb-1.5">
          {label}
        </label>
      )}
      
      <div className="relative">
        {/* Custom Icon */}
        <Calendar 
          size="18" 
          className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" 
        />
        
        <input
          type="date"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          min={min}
          max={max}
          disabled={disabled}
          className={cn(
            "w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 focus:ring-1 focus:ring-brand-blue outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm",
            // The Magic Trick: This hides the ugly native browser icon and stretches the invisible click target over the whole input
            "[&::-webkit-calendar-picker-indicator]:absolute [&::-webkit-calendar-picker-indicator]:w-full [&::-webkit-calendar-picker-indicator]:h-full [&::-webkit-calendar-picker-indicator]:opacity-0 [&::-webkit-calendar-picker-indicator]:cursor-pointer",
            !value && "text-slate-400", // Dim text if no date is selected
            className
          )}
        />
      </div>
    </div>
  );
};