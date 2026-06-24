
import { useState, useEffect } from 'react';
import { Dialog } from '../../../../components/ui/Dialog';
import { cn } from '../../../../utils/cn';
import { Calendar } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import { useTransactionCategories } from '../../../../hooks/useTransactions';

export interface FilterState {
  categoryId: string[];
  subCategoryId: string[];
  sortBy: 'name' | 'date';
  sortOrder: 'ASC' | 'DESC';
  startDate?: string;
  endDate?: string;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  currentFilters: FilterState;
  onApply: (filters: FilterState) => void;
}

export const SortFilterModal = ({ isOpen, onClose, currentFilters, onApply }: Props) => {

const { data: categories, isLoading: loadingCategories } = useTransactionCategories();

  const [localFilters, setLocalFilters] = useState<FilterState>({
    categoryId: currentFilters?.categoryId || [],
    subCategoryId: currentFilters?.subCategoryId || [],
    sortBy: currentFilters?.sortBy || 'date',
    sortOrder: currentFilters?.sortOrder || 'DESC',
    startDate: currentFilters?.startDate || '',
    endDate: currentFilters?.endDate || '',
  });

  // 2. BULLETPROOF USE-EFFECT (Never set directly to currentFilters!)
  useEffect(() => {
    if (isOpen) {
      setLocalFilters({
        categoryId: currentFilters?.categoryId || [],
        subCategoryId: currentFilters?.subCategoryId || [],
        sortBy: currentFilters?.sortBy || 'date',
        sortOrder: currentFilters?.sortOrder || 'DESC',
        startDate: currentFilters?.startDate || '',
        endDate: currentFilters?.endDate || '',
      });
    }
  }, [isOpen, currentFilters]);

  // Derive available sub-categories based ONLY on the currently selected categories
  const activeSubCategories = categories
    ?.filter((cat: any) => localFilters.categoryId.includes(cat.id))
    .flatMap((cat: any) => cat.subCategories || []) || [];

const toggleItem = (listName: 'categoryId' | 'subCategoryId', value: string) => {
    const current = [...(localFilters[listName] || [])];
    const index = current.indexOf(value);
    
    if (index > -1) current.splice(index, 1);
    else current.push(value);
    
    // If a parent category is unchecked, ensure its sub-categories are also removed from the filter
    let updatedSubCategories = localFilters.subCategoryId;
    if (listName === 'categoryId' && index > -1) {
      // Re-calculate which subcategories are still valid
      const remainingValidSubCategoryIds = categories
        ?.filter((cat: any) => current.includes(cat.id))
        .flatMap((cat: any) => cat.subCategories || [])
        .map((sub: any) => sub.id) || [];
        
      updatedSubCategories = localFilters.subCategoryId.filter(id => remainingValidSubCategoryIds.includes(id));
    }

    setLocalFilters({ 
      ...localFilters, 
      [listName]: current,
      ...(listName === 'categoryId' && { subCategoryId: updatedSubCategories }) // Apply clean sub-categories if parent changed
    });
  };

  const SectionTitle = ({ title }: { title: string }) => (
    <h4 className="text-sm font-medium text-slate-800 mb-4">{title}</h4>
  );

  // 2. Fixed clickability by swapping `hidden` for `sr-only`
  const Checkbox = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <label className="flex items-center gap-2.5 cursor-pointer group whitespace-nowrap">
      <div className={cn(
        "w-[18px] h-[18px] rounded flex items-center justify-center transition-all",
        checked ? "bg-brand-blue border-brand-blue" : "border border-slate-300 group-hover:border-brand-blue bg-white"
      )}>
        {checked && (
          <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        )}
      </div>
      <span className="text-sm text-slate-600">{label}</span>
      <input type="checkbox" className="sr-only" checked={checked || false} onChange={onChange} />
    </label>
  );

  const Radio = ({ label, checked, onChange }: { label: string, checked: boolean, onChange: () => void }) => (
    <label className="flex items-center gap-3 cursor-pointer group">
      <div className={cn(
        "w-[20px] h-[20px] rounded-full border flex items-center justify-center transition-all bg-white",
        checked ? "border-brand-blue border-[6px]" : "border-slate-300 group-hover:border-brand-blue"
      )} />
      <span className="text-sm text-slate-600">{label}</span>
      <input type="radio" className="sr-only" checked={checked || false} onChange={onChange} />
    </label>
  );

  return (
    <Dialog isOpen={isOpen} onClose={onClose} title="Sort & Filter by">
      <div className="space-y-6 pt-4 max-h-[70vh] overflow-y-auto pr-2">

        {/* Date Range Selector */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 border-b border-slate-100 pb-6">
          <label className="text-sm font-medium text-slate-800 sm:w-24 shrink-0">Date range:</label>
          <div className="flex items-center gap-2 w-full">
            <div className="relative w-full">
              <input 
                type="date" 
                value={localFilters?.startDate || ''} 
                onChange={(e) => setLocalFilters({ ...localFilters, startDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-blue text-slate-600" 
              />
              <Calendar size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            <span className="text-slate-400">–</span>
            <div className="relative w-full">
              <input 
                type="date" 
                value={localFilters?.endDate || ''} 
                onChange={(e) => setLocalFilters({ ...localFilters, endDate: e.target.value })}
                className="w-full pl-9 pr-3 py-2 text-sm border border-slate-200 rounded-lg outline-none focus:border-brand-blue text-slate-600" 
              />
              <Calendar size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
          </div>
        </div>

    {/* Dynamic Category Map */}
        <div>
          <SectionTitle title="Category" />
          {loadingCategories ? (
            <p className="text-xs text-slate-400">Loading categories...</p>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {categories?.map((cat: any) => (
                <Checkbox 
                  key={cat.id}
                  label={cat.name} 
                  checked={localFilters?.categoryId?.includes(cat.id)} 
                  onChange={() => toggleItem('categoryId', cat.id)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Dynamic Sub-category Map */}
        <div className="border-b border-slate-100 pb-6">
          <SectionTitle title="Sub-category" />
          {localFilters.categoryId.length === 0 ? (
            <p className="text-xs text-slate-400 italic">Select a category above to view related sub-categories.</p>
          ) : activeSubCategories.length === 0 ? (
             <p className="text-xs text-slate-400">No sub-categories available for the selected categories.</p>
          ) : (
            <div className="flex flex-wrap gap-x-6 gap-y-4">
              {activeSubCategories.map((sub: any) => (
                <Checkbox 
                  key={sub.id}
                  label={sub.name} 
                  checked={localFilters?.subCategoryId?.includes(sub.id)} 
                  onChange={() => toggleItem('subCategoryId', sub.id)} 
                />
              ))}
            </div>
          )}
        </div>

        {/* Sort Attributes */}
        <div className="space-y-4 border-b border-slate-100 pb-6">
          <Radio label="Name" checked={localFilters?.sortBy === 'name'} onChange={() => setLocalFilters({ ...localFilters, sortBy: 'name' })} />
          <Radio label="Date Created" checked={localFilters?.sortBy === 'date'} onChange={() => setLocalFilters({ ...localFilters, sortBy: 'date' })} />
        </div>

        {/* Order */}
        <div className="space-y-4 pb-2">
          <Radio label="Ascending Order (A-Z)" checked={localFilters?.sortOrder === 'ASC'} onChange={() => setLocalFilters({ ...localFilters, sortOrder: 'ASC' })} />
          <Radio label="Descending Order (Z-A)" checked={localFilters?.sortOrder === 'DESC'} onChange={() => setLocalFilters({ ...localFilters, sortOrder: 'DESC' })} />
        </div>
      </div>

      {/* 3. The Footer Action Buttons to trigger the backend request */}
      <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3">
        <Button 
          variant="outline" 
          className="w-full py-2.5 text-sm" 
          onClick={() => setLocalFilters({ categoryId: [], subCategoryId: [], sortBy: 'date', sortOrder: 'DESC', startDate: '', endDate: '' })}
        >
          Clear All
        </Button>
        <Button 
          className="w-full py-2.5 bg-brand-blue text-sm text-white" 
          onClick={() => {
            onApply(localFilters); // Sends data to parent
            onClose();             // Closes modal
          }}
        >
          Apply View
        </Button>
      </div>
    </Dialog>
  );
};