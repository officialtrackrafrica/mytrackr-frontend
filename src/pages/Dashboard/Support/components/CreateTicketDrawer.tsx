// src/pages/dashboard/components/support/CreateTicketDrawer.tsx
import { useForm } from 'react-hook-form';
import { Drawer } from '../../../../components/ui/Drawer';
import { Button } from '../../../../components/ui/Button';
import { DocumentUpload, Trash } from 'iconsax-react';
import { toast } from 'sonner';
import { useCreateTicket } from '../api/useSupport';

interface FormValues {
  title: string;
  description: string;
  attachment?: FileList;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateTicketDrawer = ({ isOpen, onClose }: Props) => {
 const { register, handleSubmit, reset, watch, setValue } = useForm<FormValues>();
  const { mutate: createTicket, isPending } = useCreateTicket();

  // Watch the file input so we can show the selected file name
  const selectedFiles = watch('attachment');
  const hasFile = selectedFiles && selectedFiles.length > 0;

  const onSubmit = (data: FormValues) => {
    // Because we might have a file, we package this into FormData
    const formData = new FormData();
    formData.append('title', data.title);
    formData.append('description', data.description);
    
    if (data.attachment && data.attachment[0]) {
      formData.append('attachment', data.attachment[0]); // Adjust 'file' key to whatever your backend expects
    }

    createTicket(formData, {
      onSuccess: () => {
        toast.success("Ticket created successfully!");
        reset();
        onClose();
      },
      onError: () => {
        toast.error("Failed to create ticket. Please try again.");
      }
    });
  };

  const labelClass = "text-xs font-semibold text-slate-700 tracking-wide block mb-1.5";
  const inputClass = "w-full px-3 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:ring-1 focus:ring-brand-blue outline-none transition-all placeholder:text-slate-400";

  return (
    <Drawer
      isOpen={isOpen}
      onClose={onClose}
      title="Create Ticket"
      description="Describe your issue in detail." // Using the text from your mockup
    >
      <form onSubmit={handleSubmit(onSubmit)} className="h-full flex flex-col justify-between space-y-6">
        <div className="space-y-5">
          
          <div>
            <label className={labelClass}>Title*</label>
            <input 
              {...register('title', { required: true })} 
              placeholder="Enter a title for your issue..." 
              className={inputClass} 
              disabled={isPending}
            />
          </div>

          <div>
            <label className={labelClass}>Description*</label>
            <textarea 
              {...register('description', { required: true })} 
              placeholder="Enter a description..." 
              disabled={isPending}
              className={`${inputClass} resize-none h-32`} 
            />
          </div>

        <div>
            <label className={labelClass}>Attachment</label>
            
            {/* Functional File Upload UI */}
            {hasFile ? (
              <div className="border border-brand-blue bg-blue-50/50 rounded-xl p-4 flex items-center justify-between">
                <div className="flex items-center gap-3 overflow-hidden">
                  <DocumentUpload size="20" className="text-brand-blue shrink-0" />
                  <span className="text-sm font-medium text-slate-700 truncate">
                    {selectedFiles[0].name}
                  </span>
                </div>
                <button 
                  type="button" 
                  onClick={() => setValue('attachment', undefined as any)} // Clear file
                  className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                >
                  <Trash size="16" />
                </button>
              </div>
            ) : (
              <label className="border-2 border-dashed border-slate-200 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors cursor-pointer group">
                <input 
                  type="file" 
                  {...register('attachment')} 
                  className="hidden" 
                  accept=".svg,.png,.jpg,.jpeg,.gif" 
                />
                <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center mb-3 group-hover:bg-white transition-colors">
                  <DocumentUpload size="20" className="text-slate-500" />
                </div>
                <p className="text-sm text-slate-600 mb-1">
                  <span className="font-bold text-brand-blue">Click to upload</span> or drag and drop
                </p>
                <p className="text-[10px] text-slate-400">
                  SVG, PNG, JPG or GIF (max. 800x400px)
                </p>
              </label>
            )}
          </div>

        </div>

        <div className="pt-4 border-t border-slate-50 flex gap-3">
          <Button type="button" variant="outline" className="w-full py-2.5 text-sm font-semibold" onClick={onClose} disabled={isPending}>
            Cancel
          </Button>
          <Button type="submit" className="w-full bg-brand-blue py-2.5 text-sm font-semibold text-white" disabled={isPending}>
            {isPending ? "Submitting..." : "Submit Ticket"}
          </Button>
        </div>
      </form>
    </Drawer>
  );
};