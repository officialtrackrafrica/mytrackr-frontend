// src/pages/dashboard/components/UploadStatementModal.tsx
import { useState } from 'react';
import { Dialog } from '../../../../components/ui/Dialog';
import { Button } from '../../../../components/ui/Button';
import { DocumentUpload, DocumentText } from 'iconsax-react';
import { toast } from 'sonner';
import { useUploadStatement } from '../../../../hooks/useTransactions'; // Adjust path
import { cn } from '../../../../utils/cn';

interface UploadStatementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const UploadStatementModal = ({ isOpen, onClose }: UploadStatementModalProps) => {
  const [file, setFile] = useState<File | null>(null);
  const [autoCategorize, setAutoCategorize] = useState(true);
  
  const { mutate: uploadStatement, isPending } = useUploadStatement();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type !== 'application/pdf') {
        toast.error("Please select a valid PDF file.");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleUpload = () => {
    if (!file) return;

    uploadStatement(
      { file, autoCategorize },
      {
        onSuccess: () => {
          toast.success("Bank statement uploaded successfully!");
          setFile(null);
          onClose();
        },
        onError: () => {
          toast.error("Failed to upload statement. Please try again.");
        }
      }
    );
  };

  const handleClose = () => {
    setFile(null);
    onClose();
  };

  return (
    <Dialog 
      isOpen={isOpen} 
      onClose={handleClose} 
      title="Upload Bank Statement" 
      description="Upload a text-searchable PDF bank statement (e.g., GTB, Zenith, Access). Duplicates are skipped automatically."
    >
      <div className="space-y-6 pt-4">
        
        {/* File Drop/Select Area */}
        <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-8 flex flex-col items-center justify-center text-center hover:bg-slate-50 transition-colors">
          <input 
            type="file" 
            accept=".pdf" 
            onChange={handleFileChange}
            disabled={isPending}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed" 
          />
          
          <div className="w-12 h-12 bg-blue-50 rounded-full flex items-center justify-center mb-3">
            {file ? <DocumentText size="24" className="text-brand-blue" /> : <DocumentUpload size="24" className="text-brand-blue" />}
          </div>
          
          {file ? (
            <div>
              <p className="text-sm font-bold text-slate-900">{file.name}</p>
              <p className="text-xs text-slate-500 mt-1">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
            </div>
          ) : (
            <div>
              <p className="text-sm font-bold text-brand-blue">Click to upload <span className="text-slate-600 font-normal">or drag and drop</span></p>
              <p className="text-xs text-slate-500 mt-1">PDF files only (Max 10MB)</p>
            </div>
          )}
        </div>

        {/* Auto Categorize Toggle */}
        <label className={cn("flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors", autoCategorize ? "border-brand-blue bg-blue-50/50" : "border-slate-200")}>
          <input 
            type="checkbox" 
            className="w-4 h-4 accent-brand-blue rounded"
            checked={autoCategorize}
            onChange={(e) => setAutoCategorize(e.target.checked)}
            disabled={isPending}
          />
          <div>
            <p className="text-sm font-bold text-slate-900">Auto-categorize transactions</p>
            <p className="text-xs text-slate-500">Let our AI automatically sort your transactions into categories.</p>
          </div>
        </label>

        {/* Actions */}
        <div className="pt-2 flex gap-3">
          <Button variant="outline" className="w-full py-2.5 text-sm" onClick={handleClose} disabled={isPending}>
            Cancel
          </Button>
          <Button 
            className="w-full py-2.5 bg-brand-blue text-sm text-white" 
            onClick={handleUpload} 
            disabled={!file || isPending}
          >
            {isPending ? "Uploading..." : "Upload Statement"}
          </Button>
        </div>
      </div>
    </Dialog>
  );
};