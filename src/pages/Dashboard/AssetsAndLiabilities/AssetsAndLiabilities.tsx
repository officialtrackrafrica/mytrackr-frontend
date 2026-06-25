import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { SearchNormal1, Setting5, Add, Trash, Edit2, DocumentText, More } from 'iconsax-react';
import { useAssets, useLiabilities, type AssetListItem, type LiabilityListItem } from './api/useAssetsAndLiabilities';
import { formatCurrency } from '../../../utils/helpers';
import { cn } from '../../../utils/cn';
import { AddAssetModal } from './AddAssetModal';
import { Table, type ColumnDef } from '../../../components/ui/table'; // Imported reusable table

const categoryStyles: Record<string, string> = {
  'Equipments': 'bg-pink-50 text-pink-600',
  'Properties': 'bg-emerald-50 text-emerald-600',
  'Cash': 'bg-blue-50 text-blue-600',
  'Income': 'bg-emerald-50 text-emerald-600',
  'Food and dining': 'bg-pink-50 text-pink-600',
};

export const AssetsLiabilitiesPage = () => {
  const [activeTab, setActiveTab] = useState<'ASSET' | 'LIABILITY'>('ASSET');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<(string | number)[]>([]);

  const { data: assetsData, isLoading: assetsLoading } = useAssets({ page });
  const { data: liabilitiesData, isLoading: liabilitiesLoading } = useLiabilities({ page });
  
  const currentData = activeTab === 'ASSET' ? assetsData : liabilitiesData;
  const isLoading = activeTab === 'ASSET' ? assetsLoading : liabilitiesLoading;
  
  const listItems: (AssetListItem | LiabilityListItem)[] = currentData?.data || [];
  const totalPages = currentData?.totalPages || 1;

  // 1. Define Columns for the Reusable Table
  const columns: ColumnDef<any>[] = [
    {
      key: 'name',
      label: activeTab === 'ASSET' ? 'Asset Name' : 'Liability Name',
      cellClassName: 'font-bold text-slate-900'
    },
    {
      key: 'value',
      label: 'Value',
      render: (item) => {
        // Handle value key discrepancies between assets and liabilities dynamically
        const val = item.currentValue ?? item.amountOwed ?? item.value ?? 0;
        return <span className="font-semibold text-slate-900">{formatCurrency(Math.abs(val))}</span>;
      }
    },
    {
      key: 'category',
      // Dynamically change the column header
      label: activeTab === 'ASSET' ? 'Category' : 'Liability Type',
      render: (item) => {
        // Fallback safely between the asset category and liability type
        const typeName = item.category || item.liabilityType || 'Uncategorized';
        return (
          <span className={cn("px-2.5 py-0.5 rounded-full text-[11px] font-bold inline-block", categoryStyles[typeName] || "bg-slate-100 text-slate-600")}>
            {typeName}
          </span>
        );
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: () => (
        <div className="flex items-center gap-2 opacity-80 group-hover:opacity-100 transition-opacity">
          <button className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-all">
            <Trash size="16" color='#475467'/>
          </button>
          <button className="p-1.5 text-slate-400 hover:text-brand-blue hover:bg-blue-50 rounded-md transition-all">
            <Edit2 size="16" color='#475467'/>
          </button>
        </div>
      )
    }
  ];

  return (
    <DashboardLayout
      title="Assets and Liabilities"
      subtitle="Keep track of your business transactions."
      extra={
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            className="w-auto py-2 px-4 text-xs font-semibold text-slate-700 border-slate-200"
            onClick={() => setIsModalOpen(true)}
          >
            <Add size="16" className="text-slate-700" color='#475467'/> Log your Assets
          </Button>
          <Button className="w-auto py-2 px-4 bg-brand-blue text-xs font-semibold text-white shadow-xs">
            <DocumentText size="16" className="text-white" color='white'/> Generate report
          </Button>
        </div>
      }
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden mt-4">
        
        {/* Top Control Toolbar */}
        <div className="p-4 lg:p-6 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md w-full">
            <SearchNormal1 size="18" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" color='#475467'/>
            <input
              type="text"
              placeholder={activeTab === 'ASSET' ? "Search assets" : "Search liabilities"}
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-brand-blue outline-none transition-all"
            />
          </div>

          <div className="flex items-center gap-3 w-full lg:w-auto justify-end">
            <Button variant="outline" className="w-auto py-2 text-xs text-slate-600">
              <Setting5 size="16" color='#475467'/> Sort & Filter
            </Button>
            <Button variant="outline" className="w-auto py-2 text-xs text-slate-600 hidden sm:flex">
              View report
            </Button>
            <Button 
              className="w-auto py-2 bg-brand-blue text-xs font-semibold"
              onClick={() => setIsModalOpen(true)}
            >
              <Add size="16" color='white'/> Add {activeTab === 'ASSET' ? 'assets' : 'liabilities'}
            </Button>
          </div>
        </div>

        {/* Sub-Context Tab Selectors */}
        <div className="px-4 py-2 bg-slate-50 border-b border-slate-100 flex gap-1">
          {[
            { label: 'Assets', value: 'ASSET' },
            { label: 'Liabilities', value: 'LIABILITY' }
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => {
                setActiveTab(tab.value as any);
                setSearch('');
                setPage(1);
                setSelectedItems([]); // Clear table selections when switching tabs
              }}
              className={cn(
                "px-5 py-1.5 rounded-lg text-xs font-bold transition-all border border-transparent",
                activeTab === tab.value 
                  ? "bg-white text-slate-900 shadow-xs border-slate-200/60" 
                  : "text-slate-500 hover:text-slate-800"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Desktop Reusable Table View */}
        <Table
          className="hidden md:block border-x-0 border-b-0 rounded-none shadow-none"
          columns={columns}
          data={listItems}
          keyExtractor={(item) => item.id}
          isLoading={isLoading}
          selectable={true}
          selectedKeys={selectedItems}
          onSelectionChange={setSelectedItems}
          emptyStateMessage={`No ${activeTab === 'ASSET' ? 'assets' : 'liabilities'} found matching filter criteria.`}
        />

       {/* MOBILE VIEW (Zebra Cards matching Image)   */}
        {/* ========================================== */}
        <div className="md:hidden space-y-4 p-4 bg-white">
          {isLoading ? (
            <div className="text-center text-slate-400 text-sm py-4">Loading items...</div>
          ) : listItems.length === 0 ? (
            <div className="text-center text-slate-400 text-sm py-4">No items found.</div>
          ) : listItems.map((item: any) => {
            const val = item.currentValue ?? item.amountOwed ?? item.value ?? 0;
            const typeName = item.category || item.liabilityType || 'Uncategorized';
            
            return (
              <div key={item.id} className="border border-slate-200 rounded-xl overflow-hidden flex flex-col text-sm">
                
                {/* Row 1: Name (Gray Background) */}
                <div className="bg-slate-50 px-4 py-3 flex justify-between items-start">
                  <div>
                    <p className="text-slate-500 font-medium mb-1">Name</p>
                    <p className="font-bold text-slate-800">{item.name || 'N/A'}</p>
                  </div>
                  <button className="text-slate-700 p-1 -mr-2 hover:bg-slate-200 rounded-md transition-colors">
                    <More size="18" variant="Bold" />
                  </button>
                </div>

                {/* Row 2: Amount (White Background) */}
                <div className="bg-white px-4 py-3">
                  <p className="text-slate-500 font-medium mb-1">Amount</p>
                  <p className={`font-bold ${activeTab === 'ASSET' ? 'text-emerald-500' : 'text-slate-800'}`}>
                    {activeTab === 'ASSET' ? '+' : '-'} {formatCurrency(Math.abs(val))}
                  </p>
                </div>

                {/* Row 3: Category (Gray Background) */}
                <div className="bg-slate-50 px-4 py-3">
                  <p className="text-slate-500 font-medium mb-2">Category</p>
                  {typeName !== 'Uncategorized' ? (
                    <span className={cn("inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold", categoryStyles[typeName] || "bg-slate-100 text-slate-600")}>
                      {/* 👉 Using bg-current allows the dot to perfectly match the text color of the pill! */}
                      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-80"></span>
                      {typeName}
                    </span>
                  ) : (
                    <p className="text-slate-400 italic text-xs">Uncategorized</p>
                  )}
                </div>

              </div>
            );
          })}
        </div>

        {/* Pagination Footer controls */}
        <div className="p-4 border-t border-slate-100 flex items-center justify-between bg-white">
          <Button variant="outline" className="w-auto py-1.5 text-xs px-4" disabled={page === 1} onClick={() => setPage(p => p - 1)}>
            Previous
          </Button>
          <p className="text-xs text-slate-500 font-medium">Page {page} of {totalPages}</p>
          <Button variant="outline" className="w-auto py-1.5 text-xs px-4" disabled={page >= totalPages} onClick={() => setPage(p => p + 1)}>
            Next
          </Button>
        </div>

      </div>

      <AddAssetModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        type={activeTab}
      />
    </DashboardLayout>
  );
};