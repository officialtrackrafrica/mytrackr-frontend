// src/pages/dashboard/SupportPage.tsx
import { useState } from 'react';
import { DashboardLayout } from '../../../components/layout/DashboardLayout';
import { Button } from '../../../components/ui/Button';
import { Add, ReceiptItem } from 'iconsax-react';
import { SupportFAQView } from './components/SupportFAQView';
import { SupportTicketsView } from './components/SupportTicketsView';
import { CreateTicketDrawer } from './components/CreateTicketDrawer';


export const SupportPage = () => {
  const [activeView, setActiveView] = useState<'faq' | 'tickets'>('faq');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  return (
    <DashboardLayout
      title={activeView === 'faq' ? "Help & Support" : "Support tickets"}
      extra={
        <div className="flex gap-3">
          <Button 
            variant="outline" 
            className="w-auto py-2 px-4 text-xs font-semibold"
            onClick={() => setActiveView('tickets')}
          >
            <ReceiptItem size="16" className="mr-2" color='black'/> Support tickets
          </Button>
          
          <Button 
            className="w-auto py-2 px-4 bg-brand-blue text-xs font-semibold text-white"
            onClick={() => setIsDrawerOpen(true)}
          >
            <Add size="16" className="mr-2" color='white'/> Create ticket
          </Button>
        </div>
      }
    >
      <div className="bg-white border border-slate-200 rounded-2xl shadow-sm p-6 md:p-8 min-h-[600px]">
        {activeView === 'faq' ? (
          <SupportFAQView />
        ) : (
          <SupportTicketsView 
            onBack={() => setActiveView('faq')} 
            onCreateTicket={() => setIsDrawerOpen(true)}
          />
        )}
      </div>

      <CreateTicketDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </DashboardLayout>
  );
};