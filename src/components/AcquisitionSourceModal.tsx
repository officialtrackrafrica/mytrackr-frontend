import { useState } from 'react';
import { Button } from './ui/Button';
import { toast } from 'sonner';
import { useAcquisitionOptions, useSubmitAcquisitionSource } from '../features/auth/hooks/useAcquisitionSource';

interface AcquisitionSourceModalProps {
  isOpen: boolean;
}

export const AcquisitionSourceModal = ({ isOpen }: AcquisitionSourceModalProps) => {
  const [selectedSource, setSelectedSource] = useState<string>('');
  const [otherText, setOtherText] = useState<string>('');

  const { data: options, isLoading: isLoadingOptions } = useAcquisitionOptions();
  const { mutate: submitSource, isPending } = useSubmitAcquisitionSource();

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSource) {
      return toast.error('Please select an option to continue.');
    }
    if (selectedSource === 'OTHERS' && !otherText.trim()) {
      return toast.error('Please specify where you heard about us.');
    }

    const payload = {
      source: selectedSource,
      ...(selectedSource === 'OTHERS' && { sourceOther: otherText })
    };

    submitSource(payload, {
      onSuccess: () => toast.success('Thank you for your feedback!'),
      onError: () => toast.error('Failed to submit. Please try again.')
    });
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-md p-6 lg:p-8 shadow-xl animate-in zoom-in-95 duration-200">
        
        <div className="text-center mb-6">
          <h3 className="text-xl font-black text-slate-900 tracking-tight">Welcome to MyTrackr! 🎉</h3>
          <p className="text-sm text-slate-500 mt-2">
            To help us serve you better, please let us know how you discovered us.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {isLoadingOptions ? (
            <div className="space-y-3">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-12 bg-slate-100 animate-pulse rounded-xl" />
              ))}
            </div>
          ) : (
            <div className="space-y-2.5">
              {options?.map((option: { value: string; label: string }) => (
                <label 
                  key={option.value} 
                  className={`flex items-center gap-3 p-3 border rounded-xl cursor-pointer transition-all ${
                    selectedSource === option.value 
                      ? 'border-brand-blue bg-blue-50/50' 
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="acquisitionSource"
                    value={option.value}
                    checked={selectedSource === option.value}
                    onChange={(e) => setSelectedSource(e.target.value)}
                    className="w-4 h-4 text-brand-blue border-slate-300 focus:ring-brand-blue"
                  />
                  <span className={`text-sm font-medium ${selectedSource === option.value ? 'text-brand-blue' : 'text-slate-700'}`}>
                    {option.label}
                  </span>
                </label>
              ))}
            </div>
          )}

          {/* Conditional Input for "Others" */}
          {selectedSource === 'OTHERS' && (
            <div className="animate-in slide-in-from-top-2 fade-in duration-200">
              <label className="block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wider">
                Please specify
              </label>
              <input
                type="text"
                placeholder="e.g. A friend recommended it"
                value={otherText}
                onChange={(e) => setOtherText(e.target.value)}
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue transition-all"
                autoFocus
              />
            </div>
          )}

          <Button 
            type="submit" 
            className="w-full bg-brand-blue" 
            disabled={isPending || isLoadingOptions || !selectedSource}
            isLoading={isPending}
          >
            Continue to Dashboard
          </Button>
        </form>

      </div>
    </div>
  );
};