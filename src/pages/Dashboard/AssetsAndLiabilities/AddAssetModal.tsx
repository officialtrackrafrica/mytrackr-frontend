// src/components/modals/AddAssetModal.tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { useCreateAsset, useCreateLiability, useLiabilityTypes } from './api/useAssetsAndLiabilities';
import { useBusiness } from '../../../hooks/useBusiness';
import { toast } from 'sonner';
import { cn } from '../../../utils/cn';
import { useCategories } from '../../../hooks/useCategories';
import { useEffect } from 'react';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  categoryId: z.string().min(1, "Selection is required"),
  // Asset-specific fields made optional at schema level, validated contextually in onSubmit
  purchaseValue: z.string().optional(),
  currentValue: z.string().optional(),
  purchaseDate: z.string().optional(),
  // Liability-specific fields
  amountOwed: z.string().optional(),
  originalAmount: z.string().optional(),
  dueDate: z.string().optional(),
  
  notes: z.string().optional()
});

type FormValues = z.infer<typeof schema>;

interface AddAssetModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'ASSET' | 'LIABILITY';
}

export const AddAssetModal = ({ isOpen, onClose, type }: AddAssetModalProps) => {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  });
  useEffect(() => {
    if (isOpen) {
      reset(); // Clears the form every time the modal opens
    }
  }, [isOpen, type, reset]);

  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  const { data: liabilityTypes, isLoading: isLoadingLiabilityTypes } = useLiabilityTypes();
  const { mutate: createAsset, isPending: isAssetPending } = useCreateAsset();
  const { mutate: createLiability, isPending: isLiabilityPending } = useCreateLiability();
  const { business } = useBusiness();
  
  const isAsset = type === 'ASSET';
  const isPending = isAssetPending || isLiabilityPending;
const dropdownOptions = isAsset ? categories : liabilityTypes;
  const isLoadingDropdown = isAsset ? isLoadingCategories : isLoadingLiabilityTypes;
  const onSubmit = (formData: FormValues) => {
    if (!business?.id) {
      toast.error("Context business is missing. Cannot complete action.");
      return;
    }

    if (isAsset) {
      // Manual check for Asset fields since they are shared schema variants
      if (!formData.purchaseValue || !formData.currentValue || !formData.purchaseDate) {
        toast.error("Please fill all required asset financial metrics.");
        return;
      }

      createAsset({
        name: formData.name,
        categoryId: formData.categoryId,
        purchaseValue: Number(formData.purchaseValue),
        currentValue: Number(formData.currentValue),
        purchaseDate: formData.purchaseDate,
        notes: formData.notes || "",
        businessId: business.id, 
      }, {
        onSuccess: () => { reset(); onClose(); toast.success("Asset logged successfully!"); }
      });
    } else {
      // Liability logic branch matching your new payload
      if (!formData.amountOwed || !formData.originalAmount || !formData.dueDate) {
        toast.error("Please fill all required liability payment metrics.");
        return;
      }

      createLiability({
        name: formData.name,
        liabilityTypeId: formData.categoryId, // maps "category" input selection to backend "liabilityType"
        amountOwed: Number(formData.amountOwed),
        originalAmount: Number(formData.originalAmount),
        dueDate: formData.dueDate,
        notes: formData.notes || "",
        businessId: business.id,
      }, {
        onSuccess: () => { reset(); onClose(); toast.success("Liability logged successfully!"); }
      });
    }
  };

  const fieldClass = "space-y-1.5";
  const labelClass = "text-xs font-semibold text-slate-700 tracking-wide block";
  const inputClass = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-400 disabled:opacity-60 shadow-xs";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isAsset ? "Add your Assets" : "Add your Liabilities"}
      description={isAsset ? "Add your assets to manage it all in one place." : "Add your liabilities to track your debt accurately."}
    >
      <form 
        onSubmit={handleSubmit(onSubmit, (err) => console.log("Validation Errors:", err))} 
        className="h-full flex flex-col justify-between space-y-6"
      >
        <div className="space-y-4">
          {/* Universal Name Input */}
          <div className={fieldClass}>
            <label className={labelClass}>{isAsset ? "Asset name*" : "Liability name*"}</label>
            <input 
              {...register('name')} 
              placeholder={isAsset ? "e.g. MacBook Pro" : "e.g. Office Rent Loan"} 
              className={inputClass} 
            />
            {errors.name && <span className="text-[10px] text-red-500 block">{errors.name.message}</span>}
          </div>

          {/* Universal Category Selector Dropdown */}
          <div className={fieldClass}>
            <label className={labelClass}>{isAsset ? "Category*" : "Liability Type*"}</label>
            <select {...register('categoryId')} className={inputClass} disabled={isLoadingCategories}>
              <option value="">
                {isLoadingDropdown ? "Loading..." : `Select a ${isAsset ? 'category' : 'type'}`}
              </option>
             {dropdownOptions?.map((opt: any) => (
                // Fallback to opt.name if the backend doesn't use opt.label
                <option key={opt.id} value={opt.id}>{opt.label || opt.name}</option>
              ))}
            </select>
            {errors.categoryId && <span className="text-[10px] text-red-500 block">{errors.categoryId.message}</span>}
          </div>

          {/* Conditional Layout Splitting Blocks */}
          {isAsset ? (
            <>
              {/* ASSET FIELDS */}
              <div className={fieldClass}>
                <label className={labelClass}>Purchase Value*</label>
                <input type="number" {...register('purchaseValue')} placeholder="Enter amount in Naira" className={inputClass} />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Current Value*</label>
                <input type="number" {...register('currentValue')} placeholder="Enter amount in Naira" className={inputClass} />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Purchase Date*</label>
                <input type="date" {...register('purchaseDate')} className={inputClass} />
              </div>
            </>
          ) : (
            <>
              {/* LIABILITY FIELDS */}
              <div className={fieldClass}>
                <label className={labelClass}>Amount Owed*</label>
                <input type="number" {...register('amountOwed')} placeholder="Enter outstanding amount" className={inputClass} />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Original Amount*</label>
                <input type="number" {...register('originalAmount')} placeholder="Enter total loan value borrowed" className={inputClass} />
              </div>
              <div className={fieldClass}>
                <label className={labelClass}>Due Date*</label>
                <input type="date" {...register('dueDate')} className={inputClass} />
              </div>
            </>
          )}

          {/* Notes (Universal Field) */}
          <div className={fieldClass}>
            <label className={labelClass}>Notes</label>
            <textarea {...register('notes')} placeholder="Optional description details..." className={cn(inputClass, "resize-none h-20")} />
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-50">
          <Button 
            type="submit" 
            className="w-full bg-brand-blue py-3 font-semibold text-sm shadow-md rounded-xl flex items-center justify-center gap-2"
            disabled={isPending}
          >
            {isPending ? "Saving..." : `+ Add ${isAsset ? "Asset" : "Liability"}`}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};