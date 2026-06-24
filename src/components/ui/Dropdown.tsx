// src/components/ui/Dropdown.tsx
import { useState, useRef, useEffect } from 'react';
import { ArrowDown2 } from 'iconsax-react';
import { cn } from '../../utils/cn';

interface DropdownOption {
  label: string;
  value: string;
}

interface DropdownProps {
  options: DropdownOption[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
}

export const Dropdown = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Find the selected option to display its label
  const selectedOption = options.find(opt => opt.value === value);

  // Close the dropdown when clicking outside of it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className="relative w-full">
      
      {/* Dropdown Trigger Button */}
      <button
        type="button"
        disabled={disabled}
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm flex items-center justify-between transition-all outline-none",
          isOpen ? "ring-1 ring-brand-blue border-brand-blue" : "",
          disabled ? "opacity-60 cursor-not-allowed" : "cursor-pointer shadow-xs focus:ring-1 focus:ring-brand-blue",
          className
        )}
      >
        <span className={cn("block truncate", !selectedOption && "text-slate-400")}>
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ArrowDown2
          size="16"
          className={cn("text-slate-400 transition-transform duration-200", isOpen && "rotate-180")}
        />
      </button>

      {/* Dropdown Menu Layer */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1.5 bg-white border border-slate-100 rounded-xl shadow-lg animate-in fade-in slide-in-from-top-2 duration-200 max-h-60 overflow-y-auto">
          <div className="p-1.5 flex flex-col gap-0.5">
            {options.length === 0 ? (
              <div className="px-3 py-2 text-xs text-slate-400 text-center">No options available</div>
            ) : (
              options.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => {
                    onChange(option.value);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-3 py-2 text-sm rounded-lg transition-colors cursor-pointer",
                    value === option.value
                      ? "bg-blue-50 text-brand-blue font-semibold"
                      : "text-slate-700 hover:bg-slate-50"
                  )}
                >
                  {option.label}
                </button>
              ))
            )}
          </div>
        </div>
      )}
      
    </div>
  );
};