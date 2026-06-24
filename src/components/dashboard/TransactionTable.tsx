import { useState } from 'react';
import { Table } from '../ui/table'; // Adjust path to your reusable Table component
import { cn } from '../../utils/cn';
import { formatCurrency } from '../../utils/helpers';
import { Add, Edit2, SearchNormal1, Trash } from 'iconsax-react';
import { Button } from '../ui/Button';
import type { ColumnDef } from '../ui/table';
import { useTransactionCategories } from '../../hooks/useTransactions';
import { Dropdown } from '../ui/Dropdown';

interface TransactionsTableProps {
  data: any[];
  onAddBank?: () => void;
  // Handlers for the interactive elements in the table
  onUpdateTransaction?: (id: string, updates: { categoryId?: string; subCategoryId?: string | null }) => void;
  onEdit?: (item: any) => void;
  onDelete?: (item: any) => void;
}

export const TransactionsTable = ({ data, onAddBank, onUpdateTransaction, 
  onEdit, 
  onDelete }: TransactionsTableProps) => {
  // Setup state to track checkbox row selections
  const [selectedTransactions, setSelectedTransactions] = useState<(string | number)[]>([]);
const { data: categories, isLoading: loadingCategories } = useTransactionCategories();
  // Handle Empty State Exactly Like the Design
  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-16 px-4 bg-white rounded-2xl border border-slate-100 shadow-sm">
        {/* Simplified Vector Illustration Cluster */}
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
          onClick={onAddBank}
          className="w-auto py-2.5 px-6 bg-brand-blue text-white flex items-center gap-2 text-sm font-semibold rounded-xl shadow-sm hover:bg-blue-700 transition-all"
        >
          <Add size="18" /> Add bank
        </Button>
      </div>
    );
  }

  // Define how each column renders its data
  const columns: ColumnDef<any>[] = [
    {
      key: 'name',
      label: 'Name',
      render: (item) => <span className="font-bold text-slate-900">{item.name || '-'}</span>,
    },
    {
      key: 'description',
      label: 'Description',
      render: (item) => <span className="text-slate-500">{item.description}</span>,
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
        // Map backend categories to { label, value } for the Dropdown
        const categoryOptions = categories?.map((cat: any) => ({ label: cat.name, value: cat.id })) || [];
        
        return (
          <div className="min-w-[140px]">
            <Dropdown
              options={categoryOptions}
              value={item.categoryId || ''}
              onChange={(newVal) => {
                onUpdateTransaction?.(item.id, { categoryId: newVal, subCategoryId: null });
              }}
              placeholder={loadingCategories ? "Loading..." : "Add category"}
              disabled={loadingCategories}
              className="py-1.5 text-xs bg-slate-50 border-slate-200" // Styled smaller for the table cell
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

        // Map subcategories
        const subCategoryOptions = subCategories.map((sub: any) => ({ label: sub.name, value: sub.id }));

        // Dynamic placeholder logic
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
            <Trash size="16" color='#475467'/>
          </button>
        </div>
      )
    }
  ];

  return (
    <Table
      columns={columns}
      data={data}
      keyExtractor={(item) => item.id}
      selectable={true}
      selectedKeys={selectedTransactions}
      onSelectionChange={setSelectedTransactions}
    />
  );
};