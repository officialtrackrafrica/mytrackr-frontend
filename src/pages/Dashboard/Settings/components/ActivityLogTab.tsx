// src/pages/dashboard/components/settings/ActivityLogTab.tsx
import { Monitor, Trash, Link21, Receipt21, UserEdit, DirectRight } from 'iconsax-react';
import { useState } from 'react';
import { useActivityLogs } from '../api/useActivityLogs';
import { formatDate } from '../../../../utils/helpers';
import { Button } from '../../../../components/ui/Button';
import { Skeleton } from '../../../../components/ui/Skeleton';

const getIconForActivity = (actionText: string) => {
  const text = actionText?.toLowerCase() || '';
  if (text.includes('delete') || text.includes('remove')) return Trash;
  if (text.includes('link') || text.includes('connect')) return Link21;
  if (text.includes('subscribe') || text.includes('plan') || text.includes('payment') || text.includes('basic')) return Receipt21;
  if (text.includes('profile') || text.includes('update') || text.includes('change')) return UserEdit;
  if (text.includes('login') || text.includes('device') || text.includes('macbook')) return Monitor;
  
  return DirectRight; // Fallback default icon
};
const parseDevice = (userAgent: string) => {
  if (!userAgent) return 'Unknown Device';
  
  // Very basic parser for the UI
  let device = 'Unknown Device';
  let browser = 'Unknown Browser';
  
  if (userAgent.includes('Android')) device = 'Android';
  if (userAgent.includes('iPhone') || userAgent.includes('iPad')) device = 'iOS Device';
  if (userAgent.includes('Mac OS')) device = 'Mac';
  if (userAgent.includes('Windows')) device = 'Windows PC';
  
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari') && !userAgent.includes('Chrome')) browser = 'Safari';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  
  return `${device} • ${browser}`;
};
export const ActivityLogTab = () => {
  const [page, setPage] = useState(1);
  const { data, isLoading } = useActivityLogs({ page, limit: 10 });

 
  const activities = data?.logs || [];
  const totalPages = data?.pagination?.totalPages || 1;

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      
      {/* Header Section */}
      <div className="pb-2">
        <h3 className="text-base font-bold text-slate-900">Your recent activities</h3>
        <p className="text-xs text-slate-500 mt-1">Track and manage your activities on MyTrackr.</p>
      </div>

      {/* Activity List Container */}
      <div className="border-t border-slate-100 divide-y divide-slate-100 min-h-[300px]">
        {isLoading ? (
          // SKELETON LOADING STATE
          Array.from({ length: 5 }).map((_, idx) => (
            <div key={`skel-${idx}`} className="flex items-start gap-4 py-5 px-2 -mx-2">
              <Skeleton  className="w-10 h-10 rounded-xl shrink-0" />
              <div className="space-y-2 mt-1 w-full">
                <Skeleton className="h-4 w-3/4 max-w-sm" />
                <Skeleton className="h-3 w-48" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          // EMPTY STATE
          <div className="py-12 text-center text-slate-500 text-sm">
            No recent activity found.
          </div>
        ) : (
          // RENDER DATA
          activities.map((activity: any) => {
            const displayAction = activity.details?.displayAction || activity.action;
            const Icon = getIconForActivity(displayAction);
            
            return (
              <div key={activity.id} className="flex items-start gap-4 py-5 group hover:bg-slate-50/30 transition-colors px-2 -mx-2 rounded-xl">
                
                {/* Icon Container */}
                <div className="p-2 bg-slate-50 border border-slate-100 text-slate-500 rounded-xl shrink-0 group-hover:bg-white transition-colors">
                  <Icon size="18" variant="Outline" color='#475467' className="text-slate-600" />
                </div>
                
                {/* Text Content */}
                <div className="space-y-1 mt-0.5">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-sm font-medium text-slate-700">
                      {/* You can render raw text here, or wrap specific words if your backend returns structured HTML/Markdown */}
                      {displayAction}
                    </p>
                    {/* Shows error badge if the outcome failed */}
                    {activity.details?.outcome === 'error' && (
                      <span className="bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded border border-red-100">
                        Failed
                      </span>
                    )}
                  </div>
                  
                 <p className="text-xs text-slate-400 font-medium flex items-center gap-1.5 flex-wrap">
                    <span>{parseDevice(activity.userAgent)}</span>
                    <span>•</span>
                    <span>{activity.ipAddress}</span>
                    <span>•</span>
                    {/* Uses the short format for the date */}
                    <span>{formatDate(activity.createdAt, 'short')}</span>
                  </p>
                </div>

              </div>
            );
          })
        )}
      </div>
{/* Pagination Footer */}
      {!isLoading && activities.length > 0 && (
        <div className="pt-4 mt-2 flex items-center justify-between border-t border-slate-100">
          <Button 
            variant="outline" 
            className="w-auto py-1.5 text-xs px-4" 
            disabled={page <= 1} 
            onClick={() => setPage(p => p - 1)}
          >
            Previous
          </Button>
          
          <p className="text-xs text-slate-500 font-medium">
            Page {page} of {totalPages}
          </p>
          
          <Button 
            variant="outline" 
            className="w-auto py-1.5 text-xs px-4" 
            disabled={page >= totalPages} 
            onClick={() => setPage(p => p + 1)}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
};