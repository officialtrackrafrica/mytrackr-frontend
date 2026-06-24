// src/components/ui/Table.tsx
import { type ReactNode } from 'react';
import { cn } from '../../utils/cn';
import { Skeleton } from './Skeleton';

export interface ColumnDef<T> {
  key: string;
  label: string;
  /** Optional custom render function for badges, actions, or formatted text */
  render?: (item: T) => ReactNode;
  /** Optional class to pass to the <th> header */
  headerClassName?: string;
  /** Optional class to pass to the <td> cell */
  cellClassName?: string;
}

interface TableProps<T> {
  columns: ColumnDef<T>[];
  data: T[] | any;
  /** Function to extract a unique React key from your row data */
  keyExtractor: (item: T) => string | number;
  isLoading?: boolean;
  emptyStateMessage?: string;
  /** Enables the checkbox column on the far left */
  selectable?: boolean;
  selectedKeys?: (string | number)[];
  onSelectionChange?: (keys: (string | number)[]) => void;
  className?: string;
}

export const Table = <T extends Record<string, any>>({
  columns,
  data,
  keyExtractor,
  isLoading = false,
  emptyStateMessage = "No items found.",
  selectable = false,
  selectedKeys = [],
  onSelectionChange,
  className
}: TableProps<T>) => {

const tableData: T[] = Array.isArray(data) 
    ? data 
    : (data?.data && Array.isArray(data.data) ? data.data : []);

  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onSelectionChange) return;
    if (e.target.checked) {
      onSelectionChange(tableData.map(keyExtractor));
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (key: string | number, checked: boolean) => {
    if (!onSelectionChange) return;
    if (checked) {
      onSelectionChange([...selectedKeys, key]);
    } else {
      onSelectionChange(selectedKeys.filter(k => k !== key));
    }
  };

  const isAllSelected = tableData.length > 0 && selectedKeys.length === tableData.length;

  return (
    <div className={cn("bg-white border border-slate-200 rounded-2xl shadow-xs overflow-hidden overflow-x-auto", className)}>
      <table className="w-full border-collapse text-left text-sm">
        
        {/* Table Header */}
        <thead>
          <tr className="bg-slate-50 border-b border-slate-200 text-xs font-medium text-slate-500">
            {selectable && (
              <th className="p-4 w-12 border-r border-transparent">
                <input 
                  type="checkbox" 
                  checked={isAllSelected}
                  onChange={handleSelectAll}
                  className="rounded border-slate-300 cursor-pointer focus:ring-brand-blue" 
                />
              </th>
            )}
            
            {columns.map((col) => (
              <th key={col.key} className={cn("p-4 font-semibold whitespace-nowrap", col.headerClassName)}>
                {col.label}
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-slate-100 relative">
          {isLoading ? (
            /* 👇 NEW SKELETON LOADING STATE 👇 */
            Array.from({ length: 3 }).map((_, index) => (
              <tr key={`skeleton-row-${index}`}>
                {selectable && (
                  <td className="p-4">
                    <Skeleton className="h-4 w-4 rounded" />
                  </td>
                )}
                {columns.map((_col, colIndex) => (
                  <td key={`skeleton-cell-${colIndex}`} className="p-4">
                    {/* Randomize width slightly for a more natural look */}
                    <Skeleton className={cn("h-4", colIndex === 0 ? "w-3/4" : "w-1/2")} />
                  </td>
                ))}
              </tr>
            ))
          ) : tableData.length === 0 ? (
            <tr>
              <td colSpan={columns.length + (selectable ? 1 : 0)} className="p-12 text-center text-slate-400 font-medium">
                {emptyStateMessage}
              </td>
            </tr>
          ) : (
            tableData.map((item) => {
              const rowKey = keyExtractor(item);
              const isSelected = selectedKeys.includes(rowKey);

              return (
                <tr 
                  key={rowKey} 
                  className={cn(
                    "hover:bg-slate-50/50 transition-colors group",
                    isSelected && "bg-blue-50/30 hover:bg-blue-50/50"
                  )}
                >
                  {/* Row Checkbox */}
                  {selectable && (
                    <td className="p-4">
                      <input 
                        type="checkbox" 
                        checked={isSelected}
                        onChange={(e) => handleSelectRow(rowKey, e.target.checked)}
                        className="rounded border-slate-300 cursor-pointer focus:ring-brand-blue" 
                      />
                    </td>
                  )}

                  {/* Row Data Cells */}
                  {columns.map((col) => (
                    <td key={`${rowKey}-${col.key}`} className={cn("p-4 text-slate-600", col.cellClassName)}>
                      {col.render ? col.render(item) : item[col.key]}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>

      </table>
    </div>
  );
};