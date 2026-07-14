import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { Drawer } from '../../../components/ui/Drawer';
import { Button } from '../../../components/ui/Button';
import { 
  useUpdateAsset, 
  useUpdateLiability, 
  useDeleteAsset, 
  useDeleteLiability 
} from './api/useAssetsAndLiabilities';
import { useCategories } from '../../../hooks/useCategories';

// ==========================================
// EDIT MODAL
// ==========================================
export const EditItemModal = ({ isOpen, onClose, item, type }: any) => {
  const { register, handleSubmit, reset } = useForm();
  const { data: categories, isLoading: isLoadingCategories } = useCategories();
  
  const { mutate: updateAsset, isPending: isAssetUpdating } = useUpdateAsset();
  const { mutate: updateLiability, isPending: isLiabilityUpdating } = useUpdateLiability();
  
  const isAsset = type === 'ASSET';
  const isPending = isAssetUpdating || isLiabilityUpdating;

  // Pre-fill the form when the modal opens with a selected item
  useEffect(() => {
    if (isOpen && item) {
      reset({
        name: item.name,
        categoryId: item.categoryId || item.liabilityTypeId,
        value: item.currentValue || item.amountOwed,
        notes: item.notes,
      });
    }
  }, [isOpen, item, reset]);

  const onSubmit = (data: any) => {
    if (isAsset) {
      // Matches your Swagger PATCH /finance/assets/{id} payload
      updateAsset({
        id: item.id,
        data: {
          name: data.name,
          categoryId: data.categoryId,
          currentValue: Number(data.value),
          notes: data.notes || "",
        }
      }, {
        onSuccess: () => {
          toast.success("Asset updated successfully!");
          onClose();
        }
      });
    } else {
      updateLiability({
        id: item.id,
        data: {
          name: data.name,
          liabilityTypeId: data.categoryId,
          amountOwed: Number(data.value),
          notes: data.notes || "",
        }
      }, {
        onSuccess: () => {
          toast.success("Liability updated successfully!");
          onClose();
        }
      });
    }
  };

  const inputClass = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-400 disabled:opacity-60";

  return (
    <Drawer isOpen={isOpen} onClose={onClose} title={`Edit ${isAsset ? 'Asset' : 'Liability'}`}>
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between space-y-6">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Name*</label>
            <input {...register('name', { required: true })} className={inputClass} />
          </div>
          
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Category*</label>
            <select {...register('categoryId')} className={inputClass} disabled={isLoadingCategories}>
              <option value="">Select a category</option>
              {categories?.map((c: any) => (
                <option key={c.id} value={c.id}>{c.label || c.name}</option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Value / Amount Owed*</label>
            <input type="number" {...register('value', { required: true })} className={inputClass} />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-700">Notes</label>
            <textarea {...register('notes')} className={`${inputClass} resize-none h-20`} />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-50">
          <Button type="submit" className="w-full bg-brand-blue" disabled={isPending} isLoading={isPending}>
            Save Changes
          </Button>
        </div>
      </form>
    </Drawer>
  );
};

// ==========================================
// DELETE CONFIRMATION MODAL
// ==========================================
export const DeleteItemModal = ({ isOpen, onClose, item, type }: any) => {
  const { mutate: deleteAsset, isPending: isAssetDeleting } = useDeleteAsset();
  const { mutate: deleteLiability, isPending: isLiabilityDeleting } = useDeleteLiability();
  
  const isAsset = type === 'ASSET';
  const isPending = isAssetDeleting || isLiabilityDeleting;

  const handleDelete = () => {
    if (!item?.id) return;

    if (isAsset) {
      deleteAsset(item.id, {
        onSuccess: () => {
          toast.success("Asset deleted successfully.");
          onClose();
        }
      });
    } else {
      deleteLiability(item.id, {
        onSuccess: () => {
          toast.success("Liability deleted successfully.");
          onClose();
        }
      });
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4 animate-in fade-in">
      <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-xl animate-in zoom-in-95">
        <h3 className="text-lg font-bold text-slate-900 mb-2">Delete {isAsset ? 'Asset' : 'Liability'}</h3>
        <p className="text-sm text-slate-500 mb-6">
          Are you sure you want to delete <span className="font-bold text-slate-700">{item?.name}</span>? This action cannot be undone.
        </p>
        <div className="flex gap-3">
          <Button variant="outline" className="flex-1" onClick={onClose} disabled={isPending}>Cancel</Button>
          <Button className="flex-1 bg-red-600 text-white hover:bg-red-700" onClick={handleDelete} isLoading={isPending}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
};