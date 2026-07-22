import { useState } from 'react';
import { Table } from '../../../../components/ui/table'; // Adjust path to your reusable Table component
import { cn } from '../../../../utils/cn';
import { formatCurrency } from '../../../../utils/helpers';
import { Add, Edit2, SearchNormal1, Trash, Magicpen } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import type { ColumnDef } from '../../../../components/ui/table';
import { useRetroactiveAiSync, useTransactionCategories } from '../../../../hooks/useTransactions';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { AiCategoryDropdown } from './AiCategoryDropdown';
import { useNavigate } from 'react-router-dom';

interface TransactionsTableProps {
  data: any[];
  onUpdateTransaction?: (id: string, updates: { categoryId?: string; subCategoryId?: string | null }) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export const TransactionsTable = ({
  data,
  onUpdateTransaction,
  onEdit,
  onDelete
}: TransactionsTableProps) => {
  const navigate = useNavigate()
  const [selectedTransactions, setSelectedTransactions] = useState<(string | number)[]>([]);
  const { data: categories, isLoading: loadingCategories } = useTransactionCategories();
  const { mutate: runAiSync, isPending: isSyncingAi } = useRetroactiveAiSync();
  const rawData = data as any;
  // Safely extract data array if it's wrapped in a response object
  const transactionsList = Array.isArray(rawData) ? data : (rawData?.data || []);

  if (!transactionsList || transactionsList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative w-24 h-24 mb-4 flex items-center justify-center">
          <div className="absolute inset-0 bg-blue-50 rounded-full animate-pulse opacity-60" />
          <div className="absolute w-16 h-10 bg-white shadow-md rounded-xl border border-slate-50 flex items-center justify-center translate-y-[-4px]">
            <div className="w-8 h-2 bg-slate-100 rounded-full mb-1" />
          </div>
          <div className="absolute w-12 h-12 bg-blue-100/50 rounded-full blur-xs mix-blend-multiply" />
          <div className="z-10 bg-brand-blue p-3 rounded-full text-white shadow-lg shadow-blue-500/20 translate-y-3 translate-x-3">
            <SearchNormal1 size="20" variant="Linear" />
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 mb-1">No transactions found</h3>
        <p className="text-sm text-slate-500 max-w-sm mb-6 leading-relaxed">
          Please add your bank to sync your bank transactions with MyTrackr.
        </p>

        <Button
          onClick={() => navigate('/link-bank')}
          className="w-auto py-2.5 px-6 bg-brand-blue text-white flex items-center gap-2 text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition-all"
        >
          <Add size="18" /> Add bank
        </Button>
      </div>
    );
  }

  // DESKTOP COLUMNS
  const columns: ColumnDef<any>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => <span className="font-bold text-slate-900">{item.name || '-'}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => <div className="text-slate-500 max-w-[150px] lg:max-w-[200px] truncate">{item.description}</div>,
    },
    {
      key: 'amount',
      label: 'Amount',
      render: (item) => {
        const amount = item.amount || 0;
        const isCredit = item.direction === 'CREDIT';
        return (
          <span className={cn("font-medium", isCredit ? "text-emerald-600" : "text-slate-900")}>
            {isCredit ? '+' : '-'} {formatCurrency(Math.abs(amount))}
          </span>
        );
      },
    },
    {
      key: 'date',
      label: 'Date',
      render: (item) => {
        if (!item.date) return '-';
        const date = new Date(item.date);
        return date.toLocaleDateString('en-US', {
          weekday: 'short',
          hour: 'numeric',
          minute: '2-digit',
          hour12: true
        });
      }
    },
    {
      key: 'category',
      label: 'Category',
      render: (item) => {
        
        return (
          <div className="min-w-[140px]">
            {/* <Dropdown
              options={categoryOptions}
              value={item.categoryId || ''}
              onChange={(newVal) => {
                onUpdateTransaction?.(item.id, { categoryId: newVal, subCategoryId: null });
              }}
              placeholder={loadingCategories ? "Loading..." : "Add category"}
              disabled={loadingCategories}
              className="py-1.5 text-xs bg-slate-50 border-slate-200"
            /> */}
            <AiCategoryDropdown 
          item={item} 
          categories={categories} 
          loadingCategories={loadingCategories}
          onUpdateTransaction={onUpdateTransaction} 
        />
          </div>
        );
      },
    },
    {
      key: 'subCategory',
      label: 'Sub-Category',
      render: (item) => {
        const activeCategory = categories?.find((c: any) => c.id === item.categoryId);
        const subCategories = activeCategory?.subCategories || [];
        const isDisabled = !item.categoryId || subCategories.length === 0;

        const subCategoryOptions = subCategories.map((sub: any) => ({ label: sub.name, value: sub.id }));

        let placeholderText = "Add sub-category";
        if (!item.categoryId) placeholderText = "Select category first";
        else if (subCategories.length === 0) placeholderText = "-";

        return (
          <div className="min-w-[140px]">
            <Dropdown
              options={subCategoryOptions}
              value={item.subCategoryId || ''}
              onChange={(newVal) => onUpdateTransaction?.(item.id, { subCategoryId: newVal })}
              placeholder={placeholderText}
              disabled={isDisabled}
              className="py-1.5 text-[11px] bg-slate-50 border-slate-200"
            />
          </div>
        );
      },
    },
    {
      key: 'actions',
      label: 'Actions',
      cellClassName: 'text-right',
      render: (item) => (
        <div className="flex items-center justify-end gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onEdit?.(item)}
            className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-all"
            title="Edit Transaction"
          >
            <Edit2 size="16" color='#475467' />
          </button>
          <button
            onClick={() => onDelete?.(item)}
            className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all"
            title="Delete Transaction"
          >
            <Trash size="16" color='#475467' />
          </button>
        </div>
      )
    }
  ];

  return (
    <div className="w-full">
     <div className="flex justify-end mb-4 px-4 md:px-0">
        <Button
          onClick={() => runAiSync()}
          isLoading={isSyncingAi} // Shows a spinner while the AI is thinking
          className="text-white text-xs font-semibold py-2 px-4 rounded-xl flex items-center gap-2 shadow-sm transition-all w-fit"
        >
          <Magicpen size="16" variant="Bold" color='white'/>
          {isSyncingAi ? 'Running Prediction...' : 'Auto-categorise all with AI'}
        </Button>
      </div>
      <div className="hidden md:block">
        <Table
          columns={columns}
          data={transactionsList}
          keyExtractor={(item) => item.id}
          selectable={true}
          selectedKeys={selectedTransactions}
          onSelectionChange={setSelectedTransactions}
        />
      </div>

      {/* ========================================== */}
      {/* MOBILE VIEW (Zebra Cards)                  */}
      {/* ========================================== */}
      <div className="md:hidden space-y-4">
        {transactionsList.map((tx: any) => {
          // Resolve category and sub-category names for the badges
          const activeCategory = categories?.find((c: any) => c.id === tx.categoryId);
          const activeSubCategory = activeCategory?.subCategories?.find((sub: any) => sub.id === tx.subCategoryId);

          const categoryName = activeCategory?.name || tx.category;
          const subCategoryName = activeSubCategory?.name || tx.subCategory;

          // Format the date for the mobile view
          const formattedDate = tx.date
            ? new Date(tx.date).toLocaleDateString('en-US', { weekday: 'short', hour: 'numeric', minute: '2-digit', hour12: true })
            : '-';

          return (
            <div key={tx.id} className="border border-slate-200 rounded-xl overflow-hidden flex flex-col text-sm">

              {/* Row 1: Name (Gray Background) */}
              <div className="bg-slate-50 px-4 py-3 flex justify-between items-start">
                <div>
                  <p className="text-slate-500 font-medium mb-1">Name</p>
                  <p className="font-bold text-slate-800">{tx.name || 'N/A'}</p>
                </div>
                {/*  Action Buttons: Edit and Delete */}
                <div className="flex items-center gap-1 -mr-2">
                  <button
                    onClick={() => onEdit?.(tx)}
                    className="text-slate-500 p-2 hover:bg-blue-100 hover:text-brand-blue rounded-md transition-colors"
                    aria-label="Edit transaction"
                  >
                    <Edit2 size="18" variant="Bold" />
                  </button>
                  <button
                    onClick={() => onDelete?.(tx)}
                    className="text-slate-500 p-2 hover:bg-red-100 hover:text-red-600 rounded-md transition-colors"
                    aria-label="Delete transaction"
                  >
                    <Trash size="18" variant="Bold" />
                  </button>
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
                  {tx.direction === 'CREDIT' ? '+' : '-'} {formatCurrency(Math.abs(tx.amount || 0))}
                </p>
              </div>

              {/* Row 4: Date (White Background) */}
              <div className="bg-white px-4 py-3">
                <p className="text-slate-500 font-medium mb-1">Date</p>
                <p className="font-bold text-slate-800">{formattedDate}</p>
              </div>

              {/* Row 5: Category (Gray Background) */}
              <div className="bg-slate-50 px-4 py-3">
                <p className="text-slate-500 font-medium mb-2">Category</p>
                {categoryName ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    {categoryName}
                  </span>
                ) : (
                  <p className="text-slate-400 italic text-xs">Uncategorized</p>
                )}
              </div>

              {/* Row 6: Sub-Category (White Background) */}
              <div className="bg-white px-4 py-3">
                <p className="text-slate-500 font-medium mb-2">Sub-Category</p>
                {subCategoryName ? (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-pink-50 text-pink-600 text-xs font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>
                    {subCategoryName}
                  </span>
                ) : (
                  <p className="text-slate-400 italic text-xs">None</p>
                )}
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};