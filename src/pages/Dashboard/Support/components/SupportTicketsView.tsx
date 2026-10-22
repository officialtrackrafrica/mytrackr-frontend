import { useState } from 'react';
import { ArrowLeft, ArrowRight2, SearchZoomIn } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import { useTickets } from '../api/useSupport';
import { formatDate } from '../../../../utils/helpers';
import { Skeleton } from '../../../../components/ui/Skeleton';
import { SupportTicketDrawer } from './SupportTicketDrawer';

interface SupportTicketsViewProps {
  onBack: () => void;
  onCreateTicket: () => void;
}

export const SupportTicketsView = ({ onBack, onCreateTicket }: SupportTicketsViewProps) => {
  const { data: ticketsData, isLoading } = useTickets();
  
  // 👉 1. State for the drawer
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const tickets = ticketsData?.tickets || ticketsData || [];

  const handleOpenTicket = (ticket: any) => {
    setSelectedTicket(ticket);
    setIsDrawerOpen(true);
  };

  return (
    <div className="animate-in fade-in slide-in-from-right-4 duration-300">
      
      <button 
        onClick={onBack} 
        className="flex items-center gap-2 text-sm font-bold text-brand-blue hover:text-blue-800 transition-colors mb-6"
      >
        <ArrowLeft size="18" color='#135ED6' /> Back to support
      </button>

      {isLoading ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div key={idx} className="border border-slate-200 rounded-2xl bg-white p-5 pb-8 h-36">
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2 mb-4" />
              <Skeleton className="h-3 w-24" />
            </div>
          ))}
        </div>
      ) : tickets.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-6 relative">
            <div className="absolute w-16 h-16 bg-white rounded-full -top-2 -left-2 opacity-60"></div>
            <div className="absolute w-12 h-12 bg-white rounded-full top-2 -right-2 opacity-60"></div>
            <SearchZoomIn size="40" className="text-brand-blue relative z-10" variant="Bulk" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">No tickets found</h3>
          <p className="text-sm text-slate-500 max-w-xs mb-6">
            You are yet to submit any ticket. Click the button below to get started.
          </p>
          <Button className="bg-brand-blue text-white px-6" onClick={onCreateTicket}>
            Create ticket
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {tickets.map((ticket: any) => {
            const isOngoing = ticket.status?.toLowerCase() === 'ongoing' || ticket.status?.toLowerCase() === 'open';
            
            return (
              <div 
                key={ticket.id} 
                className="border border-slate-200 rounded-2xl bg-white overflow-hidden hover:border-brand-blue transition-colors flex flex-col justify-between"
              >
                <div className="p-5 pb-8 relative">
                  <div className="pr-20"> 
                    <h4 className="text-sm font-medium text-slate-700 leading-relaxed mb-3 line-clamp-2">
                      {ticket.title || ticket.subject}
                    </h4>
                    <p className="text-xs text-slate-400">
                      Updated {formatDate(ticket.updatedAt || ticket.createdAt, 'short')}
                    </p>
                  </div>
                  
                  <div className="absolute top-5 right-5">
                    {isOngoing ? (
                      <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold rounded-full capitalize">
                        {ticket.status || 'Ongoing'}
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full capitalize">
                        {ticket.status || 'Closed'}
                      </span>
                    )}
                  </div>
                </div>
                
                {/* 👉 2. Attach click handler here */}
                <div 
                  onClick={() => handleOpenTicket(ticket)}
                  className="px-5 py-3 border-t border-slate-100 flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors group"
                >
                  <span className="text-sm font-bold text-slate-700">View details</span>
                  <ArrowRight2 size="16" color="#90a1b9" className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 👉 3. Render the Drawer */}
      <SupportTicketDrawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        ticket={selectedTicket}
      />
    </div>
  );
};