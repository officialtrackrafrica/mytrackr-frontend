// src/pages/dashboard/SettingsPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { SearchNormal1 } from 'iconsax-react';
import { cn } from '../../../utils/cn';

// Named layout components imports
import { PersonalDetailsTab } from './components/PersonalDetailsTab';
import { PasswordTab } from './components/PasswordTab';
import { BillingTab } from './components/BillingTab';
import { NotificationsTab } from './components/NotificationsTab';
import { ActivityLogTab } from './components/ActivityLogTab';

export const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState('Personal details');

  const tabs = [
    { name: 'Personal details' },
    { name: 'Password' },
    { name: 'Billing'},
    { name: 'Notifications' },
    { name: 'Activity logs' }
  ];

  // Helper block mapper rendering the standalone structures dynamically
  const renderTabContent = () => {
    switch (activeTab) {
      case 'Personal details':
        return <PersonalDetailsTab />;
      case 'Password':
        return <PasswordTab />;
      case 'Billing':
        return <BillingTab />;
      case 'Notifications':
        return <NotificationsTab />;
      case 'Activity logs':
        return <ActivityLogTab />;
      default:
        return <PersonalDetailsTab />;
    }
  };

  return (
    <DashboardLayout title="Settings" >
      {/* Search Input Accessory Bar */}
      <div className="flex justify-end mt-2 mb-4">
        <div className="relative w-full max-w-xs">
          <SearchNormal1 size="16" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-9 pr-4 py-1.5 bg-white border border-slate-200 rounded-lg text-xs outline-none focus:ring-1 focus:ring-brand-blue"
          />
        </div>
      </div>

      {/* Navigation sub-tabs slider panel */}
      <div className="flex items-center gap-1 border-b border-slate-200 overflow-x-auto scrollbar-none mb-6">
        {tabs.map((tab) => (
          <button
            key={tab.name}
            onClick={() => setActiveTab(tab.name)}
            className={cn(
              "px-4 py-2.5 text-sm font-semibold whitespace-nowrap transition-all border-b-2 -mb-px flex items-center gap-1.5",
              activeTab === tab.name
                ? "border-brand-blue text-brand-blue font-bold"
                : "border-transparent text-slate-400 hover:text-slate-600"
            )}
          >
            <span>{tab.name}</span>
           
          </button>
        ))}
      </div>

      {/* Render Dynamic Component view */}
      <div className="mt-4">
        {renderTabContent()}
      </div>
    </DashboardLayout>
  );
};