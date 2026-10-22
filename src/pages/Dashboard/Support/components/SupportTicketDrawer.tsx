// src/pages/dashboard/components/support/SupportTicketDrawer.tsx
import { useState } from 'react';
import { Paperclip2, EmojiNormal, Send2, RecordCircle } from 'iconsax-react';
import { useTicketDetails, useReplyToTicket } from '../api/useSupport'; // Ensure these hooks exist
import { formatDate } from '../../../../utils/helpers';
import { toast } from 'sonner';
import { Drawer } from '../../../../components/ui/Drawer';

interface SupportTicketDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  ticket: any | null;
}

export const SupportTicketDrawer = ({ isOpen, onClose, ticket }: SupportTicketDrawerProps) => {
  const [replyMessage, setReplyMessage] = useState("");

  // Fetch full thread data
  const { data, isLoading } = useTicketDetails(ticket?.id);
  const { mutate: sendReply, isPending: isSending } = useReplyToTicket();

  const fullTicket = data?.data || data?.ticket || ticket;
  const isOngoing = fullTicket?.status?.toLowerCase() === 'ongoing' || fullTicket?.status?.toLowerCase() === 'open';

  // Merge the initial ticket description into the replies array as the first message
  const rawMessages = data?.messages || data?.replies || [];
  const thread = [
    {
      id: fullTicket?.id,
      senderType: 'user',
      message: fullTicket?.description || fullTicket?.message || "",
      createdAt: fullTicket?.createdAt,
      attachmentUrl: fullTicket?.attachmentUrl
    },
    ...rawMessages.filter((reply: any) => reply.id !== fullTicket?.id) // Prevent duplicates
  ];

  const handleSendReply = () => {
    if (!replyMessage.trim() || !fullTicket?.id) return;
    
    sendReply({ id: fullTicket.id, message: replyMessage }, {
      onSuccess: () => {
        setReplyMessage("");
        toast.success("Reply sent successfully.");
      },
      onError: () => toast.error("Failed to send reply.")
    });
  };

  if (!ticket && !isOpen) return null;

  return (
    <Drawer 
      isOpen={isOpen} 
      onClose={onClose} 
      title={fullTicket?.title}
    //   className="sm:max-w-[500px] p-0"
    >
      <div className="flex flex-col h-full bg-[#FAFAFA] overflow-hidden">
        
        {/* Header matching the mockup */}
        <div className="p-6 border-b border-slate-200 bg-white shrink-0 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-slate-900 mb-1">{fullTicket?.title || fullTicket?.subject}</h2>
            <p className="text-xs text-slate-400">
              Updated {formatDate(fullTicket?.updatedAt || fullTicket?.createdAt, 'short')}
            </p>
          </div>
          {isOngoing ? (
            <span className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-[10px] font-bold rounded-full capitalize">
              Ongoing
            </span>
          ) : (
            <span className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-bold rounded-full capitalize">
              Closed
            </span>
          )}
        </div>

        {/* Timeline Chat Area */}
        <div className="flex-1 overflow-y-auto p-6">
          {isLoading ? (
            <div className="text-center text-slate-400 text-sm mt-10">Loading thread...</div>
          ) : (
            <div className="relative border-l border-slate-300 ml-3 space-y-8 pb-4">
              {thread.map((msg: any, index: number) => {
                const isAdmin = msg.senderType === 'admin';
                
                return (
                  <div key={msg.id || index} className="relative pl-6">
                    {/* Timeline Dot */}
                    <div className="absolute -left-[11px] top-0 bg-[#FAFAFA] py-1">
                      <RecordCircle size="20" variant="Bulk" color='#135ED6' />
                    </div>

                    <div className="flex flex-col">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="font-bold text-slate-900 text-sm">
                          {isAdmin ? "My Trackr's reply" : "Your message"}
                        </span>
                      </div>
                      
                      <p className="text-xs text-slate-400 mb-3">
                        {formatDate(msg.createdAt, 'short')}
                      </p>

                      <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-wrap mb-3">
                        {msg.message}
                      </p>

                      {/* Mockup Attachment Style */}
                      {msg.attachmentUrl && (
                        <div>
                          <p className="text-xs text-slate-400 mb-2">1 attachment</p>
                          <div className="inline-flex items-center gap-3 p-3 border border-blue-200 bg-blue-50/50 rounded-lg">
                            <div className="w-8 h-8 bg-white border border-slate-200 rounded flex items-center justify-center overflow-hidden">
                              <img src={msg.attachmentUrl} alt="attachment thumb" className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <p className="text-xs font-bold text-slate-700">Image.jpg</p>
                              <p className="text-[10px] text-slate-400">View file</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Reply Input Footer */}
        {isOngoing && (
          <div className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-3 bg-white border border-slate-200 rounded-lg p-2 focus-within:border-brand-blue focus-within:ring-1 focus-within:ring-brand-blue transition-all">
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                <Paperclip2 size="18" color='#90a1b9'/>
              </button>
              <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
                <EmojiNormal size="18" color='#90a1b9'/>
              </button>
              
              <input 
                type="text"
                placeholder="Enter your reply here" 
                className="flex-1 border-none shadow-none focus:outline-none px-2 text-sm text-slate-700"
                value={replyMessage}
                onChange={(e) => setReplyMessage(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSendReply();
                }}
              />
              
              <button 
                onClick={handleSendReply}
                disabled={isSending || !replyMessage.trim()}
                className="p-1.5 text-slate-400 hover:text-brand-blue disabled:opacity-50 transition-colors"
              >
                <Send2 size="20" color='#135ED6'/>
              </button>
            </div>
          </div>
        )}

      </div>
    </Drawer>
  );
};