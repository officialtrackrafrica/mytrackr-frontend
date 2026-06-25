// src/pages/dashboard/TransactionsPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { SearchNormal1, Setting5, DocumentText, Add, CloseCircle, DocumentUpload, More } from 'iconsax-react';
import { useTransactions, useUpdateTransactionCategory } from '../../../hooks/useTransactions';
import { TransactionsTable } from '../../../components/dashboard/TransactionTable';
import { formatCurrency } from '../../../utils/helpers';
import { LogTransactionModal } from './components/LogTransactionsModal';
import { SortFilterModal } from './components/SortFilterModal';
import { toast } from 'sonner';
import { DeleteTransactionModal } from './components/DeleteTransactionModal';
import { UploadStatementModal } from './components/UploadStatementModal';


export const TransactionsPage = () => {
  const [_search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'categorized' | 'uncategorized'>('all');
  const [page, setPage] = useState(1);
  const [isLogModalOpen, setLogModalOpen] = useState(false);
  const [isFilterOpen, setFilterOpen] = useState(false);
  const [transactionToEdit, setTransactionToEdit] = useState<any | null>(null);
  const [transactionToDelete, setTransactionToDelete] = useState<any | null>(null);
  const [isUploadModalOpen, setUploadModalOpen] = useState(false);


  const [queryParams, setQueryParams] = useState({
    page: 1,
    limit: 25,
    sortBy: 'date' as 'name' | 'date',
    startDate: '',
    sortOrder: 'DESC' as 'ASC' | 'DESC',
    endDate: '',
    categoryId: [] as string[],
    subCategoryId: [] as string[],
    isCategorised: undefined as boolean | undefined,
  });

  const { data, isLoading } = useTransactions(queryParams);
  const transactionsList = data?.data || [];
  const totalCount = data?.meta?.total || 0;
  // const totalPages = data?.meta?.totalPages || 1;
  console.log(data)
  // 2. Initialize the new update hook
  const { mutate: updateCategory } = useUpdateTransactionCategory();

  // 3. Create the handler function
  const handleUpdateTransaction = (id: string, updates: { categoryId?: string; subCategoryId?: string | null }) => {
    // Fire the mutation request to the backend
    updateCategory(
      { id, ...updates },
      {
        onSuccess: () => {
          toast.success('Category updated successfully');
        },
        onError: () => {
          toast.error('Failed to update category. Please try again.');
        }
      }
    );
  };


  return (
    <DashboardLayout
      title="Transactions"
      subtitle="Keep track of your business transactions."
      extra={
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" className="flex w-auto py-2" onClick={() => setUploadModalOpen(true)}>
            <DocumentUpload size="18" color='#050E1E' /> Upload statement
          </Button>
          <Button variant="outline" className="flex w-auto py-2" onClick={() => setLogModalOpen(true)}>
            <Add size="18" color='#050E1E' /> Log transactions
          </Button>
          <Button className="w-auto py-2 bg-brand-blue">
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white rounded-full border-t-transparent animate-spin hidden" />
              <DocumentText size="18" color='#fff' /> Generate report
            </div>
          </Button>
        </div>
      }
    >
      {/* 1. Help Alert Box */}
      <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 mb-6 relative">
        <button className="absolute top-4 right-4 text-slate-400 hover:text-slate-600">
          <CloseCircle size="20" />
        </button>
        <h4 className="font-bold text-slate-900 mb-2">How to log / categorize your transactions</h4>
        <ol className="text-sm text-slate-600 space-y-1 list-decimal ml-4">
          <li>Click on the ....................</li>
          <li>....................................</li>
        </ol>
        <p className="text-xs text-slate-500 mt-3">
          Still confused? <span className="text-brand-blue font-bold cursor-pointer underline">Click HERE</span> to watch a demonstration video.
        </p>
      </div>

      {/* 2. Main Container */}
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">

        {/* Toolbar */}
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h3 className="font-bold text-slate-900">{activeTab === 'all' ? 'All' : activeTab} transactions</h3>
            <span className="bg-blue-900 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">{isLoading ? "..." : totalCount}</span>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <SearchNormal1 size="18" color='#475467' className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search transactions"
                className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="w-auto py-2 text-xs" onClick={() => setFilterOpen(true)}>
              <Setting5 size="16" color='#475467' /> Sort & Filter
            </Button>
            <Button variant="outline" className="w-auto py-2 text-xs hidden sm:flex">
              View report
            </Button>
          </div>
        </div>

        {/* Tabs */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex gap-1">
          {['All', 'Categorized', 'Uncategorized'].map((tab) => {
            const tabValue = tab.toLowerCase() as 'all' | 'categorized' | 'uncategorized';
            return (
              <button
                key={tab}
                onClick={() => {
                  setActiveTab(tabValue);
                  // Update the API query params based on the clicked tab
                  setQueryParams(prev => ({
                    ...prev,
                    page: 1, // Always reset to page 1 when switching tabs
                    isCategorised: tabValue === 'all' ? undefined : tabValue === 'categorized'
                  }));
                }}
                className={`px-4 py-1.5 rounded-md text-xs font-bold transition-colors ${activeTab === tabValue ? "bg-white text-slate-900 shadow-sm" : "text-slate-500 hover:text-slate-700"
                  }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* 3. The Content: Desktop Table vs Mobile Cards */}
        <div className="hidden md:block">
          <TransactionsTable data={transactionsList} onUpdateTransaction={handleUpdateTransaction}
            onEdit={(item) => {
              setTransactionToEdit(item);
              setLogModalOpen(true);
            }}
            onDelete={(item) => setTransactionToDelete(item)}
          />
        </div>

        <div className="md:hidden space-y-4">
  {transactionsList?.map((tx: any) => (
    <div key={tx.id} className="border border-slate-200 rounded-xl overflow-hidden flex flex-col text-sm">
      
      {/* Row 1: Name (Gray Background) */}
      <div className="bg-slate-50 px-4 py-3 flex justify-between items-start">
        <div>
          <p className="text-slate-500 font-medium mb-1">Name</p>
          <p className="font-bold text-slate-800">{tx.name || 'N/A'}</p>
        </div>
        
      </div>

      {/* Row 2: Description (White Background) */}
      <div className="bg-white px-4 py-3">
        <p className="text-slate-500 font-medium mb-1">Description</p>
        <p className="font-bold text-slate-800">{tx.description || 'N/A'}</p>
      </div>

      {/* Row 3: Amount (Gray Background) */}
      <div className="bg-slate-50 px-4 py-3">
        <p className="text-slate-500 font-medium mb-1">Amount</p>
        <p className={`font-bold ${tx.direction === 'CREDIT' ? 'text-emerald-500' : 'text-slate-800'}`}>
          {tx.direction === 'CREDIT' ? '+' : '-'} {formatCurrency(tx.amount)}
        </p>
      </div>

      {/* Row 4: Date (White Background) */}
      <div className="bg-white px-4 py-3">
        <p className="text-slate-500 font-medium mb-1">Date</p>
        <p className="font-bold text-slate-800">{tx.date}</p>
      </div>

      {/* Row 5: Category (Gray Background) */}
      <div className="bg-slate-50 px-4 py-3">
        <p className="text-slate-500 font-medium mb-2">Category</p>
        {tx.category ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            {tx.category}
          </span>
        ) : (
          <p className="text-slate-400 italic text-xs">Uncategorized</p>
        )}
      </div>

      {/* Row 6: Sub-Category (White Background) */}
      <div className="bg-white px-4 py-3">
        <p className="text-slate-500 font-medium mb-2">Sub-Category</p>
        {tx.subCategory ? (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
            {tx.subCategory}
          </span>
        ) : (
          <p className="text-slate-400 italic text-xs">None</p>
        )}
      </div>

    </div>         
  ))}
</div>
          

        {/* 4. Pagination Footer */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between">
          <Button variant="outline" className="w-auto py-1.5 text-xs px-4" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <p className="text-xs text-slate-500 font-medium">Page {page} of 10</p>
          <Button variant="outline" className="w-auto py-1.5 text-xs px-4" onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>
      </div>
      <LogTransactionModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setLogModalOpen(false);
          setTransactionToEdit(null); // Clear data so it resets to "Create" mode next time
        }}
        transactionToEdit={transactionToEdit}
      />
      {/* Replace the old modal with this correctly wired one: */}
      <SortFilterModal
        isOpen={isFilterOpen}
        onClose={() => setFilterOpen(false)}
        currentFilters={queryParams}
        onApply={(newFilters) => {
          // Merge the new filters into queryParams and reset to page 1
          setQueryParams((prev) => ({
            ...prev,
            ...newFilters,
            page: 1
          }));
        }}
      />
      <DeleteTransactionModal
        isOpen={!!transactionToDelete}
        onClose={() => setTransactionToDelete(null)}
        transaction={transactionToDelete}
      />
      <UploadStatementModal
        isOpen={isUploadModalOpen}
        onClose={() => setUploadModalOpen(false)}
      />
    </DashboardLayout>
  );
};