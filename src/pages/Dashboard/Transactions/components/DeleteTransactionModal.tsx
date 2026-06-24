// src/features/transactions/components/DeleteTransactionModal.tsx
import { Dialog } from '../../../../components/ui/Dialog';
import { Button } from '../../../../components/ui/Button';
import { useDeleteTransaction } from '../../../../hooks/useTransactions';
import { toast } from 'sonner';
import { Trash } from 'iconsax-react';

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: any | null; 
}

export const DeleteTransactionModal = ({ isOpen, onClose, transaction }: DeleteTransactionModalProps) => {
  const { mutate: deleteTransaction, isPending } = useDeleteTransaction();

  const handleDelete = () => {
    if (!transaction?.id) return;

    deleteTransaction(transaction.id, {
      onSuccess: () => {
        toast.success("Transaction deleted successfully");
        onClose();
      },
      onError: () => {
        toast.error("Failed to delete transaction.");
      }
    });
  };
const warningIcon = (
    <div className="w-12 h-12 rounded-full bg-red-50 flex items-center justify-center border-[6px] border-red-50/50">
      <Trash size={22} color="#D92D20" variant="Outline" />
    </div>
  );
  return (
    <Dialog
      isOpen={isOpen}
      onClose={onClose}
      title="Delete Transaction"
      description={`Are you sure you want to delete this transaction? This action cannot be undone.`}
      icon={warningIcon}
    >
      <div className="flex items-center justify-end gap-3 mt-6 pt-4 border-t border-slate-100">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose} 
          disabled={isPending}
          className="w-auto py-2 text-sm"
        >
          Cancel
        </Button>
        <Button 
          type="button" 
          onClick={handleDelete} 
          disabled={isPending}
          className="w-auto py-2 text-sm bg-red-600 hover:bg-red-700 text-white border-transparent"
        >
          {isPending ? "Deleting..." : "Yes, Delete"}
        </Button>
      </div>
    </Dialog>
  );
};