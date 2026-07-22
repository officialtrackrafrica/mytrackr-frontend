import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Calendar } from 'iconsax-react';
// import { Dialog } from '../../../../components/ui/Dialog';
import { cn } from '../../../../utils/cn';
import { Button } from '../../../../components/ui/Button';
import { toast } from 'sonner';
import { useCreateTransaction, useTransactionCategories, useUpdateTransaction } from '../../../../hooks/useTransactions';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useEffect } from 'react';
import { Drawer } from '../../../../components/ui/Drawer';

const schema = z.object({
  name: z.string().min(1, "Name is required"),
  amount: z.string().min(1, "Amount is required"),
  direction: z.enum(['CREDIT', 'DEBIT'], { message: "Direction is required" }),
  date: z.string().min(1, "Date is required"),
  description: z.string().min(1, "Description is required"),
  categoryId: z.string().min(1, "Category is required"),
  subCategoryId: z.string().optional(),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof schema>;

export const LogTransactionModal = ({ isOpen, onClose, transactionToEdit }: { isOpen: boolean; onClose: () => void; transactionToEdit?: any | null; }) => {

  const isEditMode = !!transactionToEdit;
  const { register, handleSubmit, watch, reset, control, setValue, formState: { errors } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      direction: 'CREDIT', // Default selection
    }
  });

  const { data: categories, isLoading: loadingCategories } = useTransactionCategories();
  const { mutate: createTransaction, isPending: isCreating } = useCreateTransaction();
const { mutate: updateTransaction, isPending: isUpdating } = useUpdateTransaction();

  // Watch the category selection to filter valid sub-categories dynamically
  const selectedCategoryId = watch('categoryId');
  const activeCategory = categories?.find((c: any) => c.id === selectedCategoryId);
  const activeSubCategories = activeCategory?.subCategories || [];

  const isPending = isCreating || isUpdating;

  // NEW: Populate form when editing an existing transaction
  useEffect(() => {
    if (isOpen && transactionToEdit) {
      reset({
        name: transactionToEdit.name || 'System transaction',
        amount: String(Math.abs(transactionToEdit.amount || 0)), // Strip minus signs for input
        direction: transactionToEdit.direction || 'CREDIT',
        // Format ISO string to YYYY-MM-DD for the HTML date input
        date: transactionToEdit.date ? new Date(transactionToEdit.date).toISOString().split('T')[0] : '',
        description: transactionToEdit.description || '',
        categoryId: transactionToEdit.categoryId || '',
        subCategoryId: transactionToEdit.subCategoryId || '',
        notes: transactionToEdit.notes || '',
      });
    } else if (isOpen && !transactionToEdit) {
      // Reset to blank slate for new logs
      reset({ direction: 'CREDIT', name: '', amount: '', date: '', description: '', categoryId: '', subCategoryId: '', notes: '' });
    }
  }, [isOpen, transactionToEdit, reset]);

const onSubmit = (formData: FormValues) => {
    if (isEditMode) {
      // Send ONLY the specific parameters authorized by your endpoint patch schema
      updateTransaction(
        { 
          id: transactionToEdit.id, 
          categoryId: formData.categoryId,
          subCategoryId: formData.subCategoryId || undefined,
          notes: formData.notes || ""
        },
        {
          onSuccess: () => {
            toast.success("Transaction re-categorised successfully!");
            onClose();
          },
          onError: () => toast.error("Failed to update transaction changes.")
        }
      );
    } else {
      createTransaction({
        name: formData.name,
        amount: Number(formData.amount),
        direction: formData.direction,
        date: formData.date,
        description: formData.description,
        categoryId: formData.categoryId,
        subCategoryId: formData.subCategoryId || undefined,
        notes: formData.notes || "",
      }, {
        onSuccess: () => {
          toast.success("Transaction logged successfully!");
          onClose();
        },
        onError: () => toast.error("Failed to log transaction.")
      });
    }
  };

  const fieldClass = "flex flex-col sm:flex-row sm:items-start gap-2 pt-2";
  const labelClass = "text-sm font-medium text-slate-700 sm:w-32 shrink-0 pt-2";
  const inputClass = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-400 disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed read-only:bg-slate-50 read-only:text-slate-500 read-only:cursor-not-allowed";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title={isEditMode ? "Edit Transaction" : "Log a Transaction"}
      description={isEditMode ? "Update the details of this transaction." : "Manually log your cash transactions for an accurate analysis of your business flow."}
    
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 pt-4">

        {/* Direction Toggle */}
        <div className={fieldClass}>
          <label className={labelClass}>Type*</label>
          <div className="w-full flex items-center gap-4">
            <label className={cn("flex items-center gap-2 text-sm text-slate-700", (isEditMode || isPending) ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}>
              <input type="radio" value="CREDIT" {...register('direction')} disabled={isEditMode || isPending} className="accent-brand-blue w-4 h-4 disabled:cursor-not-allowed" />
              Money In (Credit)
            </label>
            <label className={cn("flex items-center gap-2 text-sm text-slate-700", (isEditMode || isPending) ? "opacity-50 cursor-not-allowed" : "cursor-pointer")}>
              <input type="radio" value="DEBIT" {...register('direction')} disabled={isEditMode || isPending} className="accent-brand-blue w-4 h-4 disabled:cursor-not-allowed" />
              Money Out (Debit)
            </label>
          </div>
        </div>

        {/* Name */}
        <div className={fieldClass}>
          <label className={labelClass}>Name*</label>
          <div className="w-full">
            <input {...register('name')} readOnly={isEditMode} placeholder="e.g. Akanni Joy" disabled={isPending} className={inputClass} />
            {errors.name && <span className="text-[10px] text-red-500 block mt-1">{errors.name.message}</span>}
          </div>
        </div>

        {/* Amount */}
        <div className={fieldClass}>
          <label className={labelClass}>Amount*</label>
          <div className="w-full">
            <input type="number" {...register('amount')} readOnly={isEditMode} disabled={isPending} placeholder="Enter amount in Naira" className={inputClass} />
            {errors.amount && <span className="text-[10px] text-red-500 block mt-1">{errors.amount.message}</span>}
          </div>
        </div>

        {/* Date */}
        <div className={fieldClass}>
          <label className={labelClass}>Date*</label>
          <div className="w-full">
            <div className="relative w-full">
              <input type="date" {...register('date')} readOnly={isEditMode} disabled={isPending} className={cn(inputClass, "appearance-none")} />
              <Calendar size="18" className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
            </div>
            {errors.date && <span className="text-[10px] text-red-500 block mt-1">{errors.date.message}</span>}
          </div>
        </div>

        {/* Description */}
        <div className={fieldClass}>
          <label className={labelClass}>Description*</label>
          <div className="w-full">
            <input {...register('description')} readOnly={isEditMode} disabled={isPending} placeholder="Enter a payment description" className={inputClass} />
            {errors.description && <span className="text-[10px] text-red-500 block mt-1">{errors.description.message}</span>}
          </div>
        </div>

        {/* Category */}
        <div className={fieldClass}>
          <label className={labelClass}>Category*</label>
          <div className="w-full">
             <div className="w-full">
            <Controller
              name="categoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={categories?.map((cat: any) => ({ label: cat.name, value: cat.id })) || []}
                  value={field.value}
                  onChange={(val) => {
                    field.onChange(val);
                    // Automatically clear the subcategory if the parent category changes
                    setValue('subCategoryId', ''); 
                  }}
                  placeholder={loadingCategories ? "Loading..." : "Select a category"}
                  disabled={loadingCategories || isPending}
                />
              )}
            />
            {errors.categoryId && <span className="text-[10px] text-red-500 block mt-1">{errors.categoryId.message}</span>}
          </div>
          </div>
        </div>

        {/* Sub-Category (Dynamic) */}
        <div className={fieldClass}>
          <label className={labelClass}>Sub-Category</label>
     
         <div className="w-full">
            <Controller
              name="subCategoryId"
              control={control}
              render={({ field }) => (
                <Dropdown
                  options={activeSubCategories.map((sub: any) => ({ label: sub.name, value: sub.id }))}
                  value={field.value || ''}
                  onChange={field.onChange}
                  placeholder={
                    !selectedCategoryId 
                      ? "Select a category first" 
                      : activeSubCategories.length === 0 
                        ? "No sub-categories available" 
                        : "Select a sub-category"
                  }
                  disabled={!selectedCategoryId || activeSubCategories.length === 0 || isPending}
                />
              )}
            />
          </div>
        </div>

        {/* Notes */}
        <div className={fieldClass}>
          <label className={labelClass}>Notes</label>
          <textarea 
            {...register('notes')} 
            placeholder="Optional context (e.g., Cash sale — not deposited to bank)" 
            disabled={isEditMode || isPending}
            className={cn(inputClass, "resize-none h-20")} 
          />
        </div>

        <Button 
          type="submit" 
          disabled={isPending}
          className="w-full bg-brand-blue py-3 mt-6 font-semibold shadow-sm flex justify-center items-center gap-2"
        >
          {isPending && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {isPending ? "Logging transaction..." : isEditMode ? "Save Changes" : "Add transaction"}
        </Button>
      </form>
    </Drawer>
  );
};