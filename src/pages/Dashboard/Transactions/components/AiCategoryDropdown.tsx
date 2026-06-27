// src/components/dashboard/AiCategoryDropdown.tsx
import { useState } from 'react';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useCategorySuggestions } from '../../../../hooks/useTransactions';

interface AiCategoryDropdownProps {
  item: any;
  categories: any[];
  loadingCategories?: boolean;
  onUpdateTransaction?: (id: string, updates: { categoryId?: string; subCategoryId?: string | null }) => void;
}

export const AiCategoryDropdown = ({ 
  item, 
  categories, 
  onUpdateTransaction, 
  loadingCategories 
}: AiCategoryDropdownProps) => {
  
  // Track if we have already fetched suggestions to prevent redundant requests
  const [hasFetched, setHasFetched] = useState(false);
  
  const { mutate: getSuggestions, data: suggestedIds, isPending: loadingSuggestions } = useCategorySuggestions();

  const handleOpenDropdown = () => {
    // Only fire if not already fetched and if it needs categorization
    if (!hasFetched && !item.categoryId) {
      setHasFetched(true); // Mark as fetched immediately
      getSuggestions({ 
        transactionId: item.id, 
        transactionBody: item 
      });
    }
  };

  const allOptions = categories?.map((cat: any) => ({ label: cat.name, value: cat.id })) || [];
  let displayOptions = allOptions;

  // If AI suggests categories, bring them to the top and mark them with a ✨
  if (suggestedIds && suggestedIds.length > 0) {
    const suggestedOptions = allOptions
      .filter(opt => suggestedIds.includes(opt.value))
      .map(opt => ({ ...opt, label: `✨ ${opt.label} (Suggested)` }));
      
    const otherOptions = allOptions.filter(opt => !suggestedIds.includes(opt.value));
    
    displayOptions = [...suggestedOptions, ...otherOptions];
  }

  const isBusy = loadingCategories || loadingSuggestions;

  return (
    <div className="min-w-[140px]" onClick={handleOpenDropdown} >
      <Dropdown
        options={displayOptions}
        value={item.categoryId || ''}
        onChange={(newVal) => {
          onUpdateTransaction?.(item.id, { categoryId: newVal, subCategoryId: null });
        }}
        placeholder={isBusy ? "Generating AI..." : "Add category"}
        disabled={isBusy}
        className="py-1.5 text-xs bg-slate-50 border-slate-200"
      />
    </div>
  );
};