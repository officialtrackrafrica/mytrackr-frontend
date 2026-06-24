// src/pages/dashboard/components/settings/NotificationsTab.tsx
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { useNotificationPreferences, useUpdateNotificationPreferences } from '../api/useNotifications';
import { useEffect } from 'react';
import { Skeleton } from '../../../../components/ui/Skeleton';

interface NotificationSettings {
  appUpdates: { push: boolean; email: boolean; sms: boolean };
  reminders: { push: boolean; email: boolean; sms: boolean };
  userActivities: { push: boolean; email: boolean; sms: boolean };
}

// Custom Tailwind Toggle Component
const ToggleSwitch = ({ label, value, onChange }: { label: string; value: boolean; onChange: (val: boolean) => void }) => (
  <label className="relative flex items-center gap-3 cursor-pointer">
    <div className="relative flex items-center">
      <input 
        type="checkbox" 
        className="sr-only peer" 
        checked={value} 
        onChange={(e) => onChange(e.target.checked)} 
      />
      <div className="w-9 h-5 bg-slate-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-brand-blue"></div>
    </div>
    <span className="text-sm font-medium text-slate-600">{label}</span>
  </label>
);

export const NotificationsTab = () => {
  const { data: preferences, isLoading } = useNotificationPreferences();
  const { mutate: updatePreferences } = useUpdateNotificationPreferences();
  // Initialize form with the default states shown in your UI
  const { control, reset, watch } = useForm<NotificationSettings>({
    defaultValues: {
      appUpdates: { push: true, email: true, sms: false },
      reminders: { push: false, email: false, sms: false },
      userActivities: { push: false, email: false, sms: false },
    }
  });

 // 3. Populate form when data arrives from the backend
  useEffect(() => {
    if (preferences) {
      reset({
        appUpdates: preferences.appUpdates,
        reminders: preferences.reminders,
        userActivities: preferences.userActivities,
      });
    }
  }, [preferences, reset]);

  // 4. Auto-save logic: Watch for any toggle changes and send the PATCH request
  useEffect(() => {
    const subscription = watch((value, { type }) => {
      // Only fire the mutation if the change was triggered by an actual user interaction (change event),
      // not during the initial form 'reset' when data loads.
      if (type === 'change') {
        updatePreferences(value as NotificationSettings, {
          onSuccess: () => toast.success('Preferences updated successfully!'),
          onError: () => toast.error('Failed to update preferences.')
        });
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, updatePreferences]);

  const sections = [
    {
      id: 'appUpdates',
      title: 'App updates',
      descriptions: [
        'To receive news about our products and feature updates.',
        'Tips and tutorials on getting more out of MyTrackr.'
      ]
    },
    {
      id: 'reminders',
      title: 'Reminders',
      descriptions: [
        'These are notifications to remind you of updates you might have missed.'
      ]
    },
    {
      id: 'userActivities',
      title: 'More activity about you',
      descriptions: [
        'These are notifications for transactions, assets, reports, and more.'
      ]
    }
  ] as const;
if (isLoading) {
    return (
      <div className="space-y-2">
        {/* Header Skeleton */}
        <div className="border-b border-slate-100 pb-5 mb-2">
          <Skeleton className="h-5 w-48 mb-2" />
          <Skeleton className="h-4 w-3/4 max-w-lg" />
        </div>

        {/* 3 Section Skeletons */}
        <div className="divide-y divide-slate-100">
          {Array.from({ length: 3 }).map((_, idx) => (
            <div key={`notif-skel-${idx}`} className="flex flex-col md:flex-row md:justify-between py-6 gap-6">
              
              {/* Left Column (Text) Skeleton */}
              <div className="md:w-[60%] space-y-3">
                <Skeleton className="h-5 w-40" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full max-w-md" />
                  {idx === 0 && <Skeleton className="h-4 w-3/4 max-w-sm" />} {/* Extra line for the first section */}
                </div>
              </div>

              {/* Right Column (Toggles) Skeleton */}
              <div className="md:w-[40%] flex flex-col gap-4 justify-start pt-1">
                {Array.from({ length: 3 }).map((_, toggleIdx) => (
                  <div key={`toggle-skel-${toggleIdx}`} className="flex items-center gap-3">
                    <Skeleton className="w-9 h-5 rounded-full" /> {/* Toggle pill */}
                    <Skeleton className="h-4 w-12" /> {/* Label */}
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    );
  }
  return (
    <div className="space-y-2 animate-in fade-in duration-200">
      
      {/* Header Section */}
      <div className="border-b border-slate-100 pb-5 mb-2">
        <h3 className="text-base font-bold text-slate-900">Notification settings</h3>
        <p className="text-sm text-slate-500 mt-1">We may still send you important notifications about your account outside of your notification settings.</p>
      </div>

      {/* Toggles Container */}
      <div className="divide-y divide-slate-100">
        {sections.map((section) => (
          <div key={section.id} className="flex flex-col md:flex-row md:justify-between py-6 gap-6">
            
            {/* Left Content Column */}
            <div className="md:w-[60%] space-y-1.5">
              <h4 className="text-sm font-bold text-slate-800">{section.title}</h4>
              <div className="space-y-4">
                {section.descriptions.map((desc, idx) => (
                  <p key={idx} className="text-sm text-slate-500">{desc}</p>
                ))}
              </div>
            </div>

            {/* Right Toggle Column */}
            <div className="md:w-[40%] flex flex-col gap-4 justify-start">
              <Controller
                name={`${section.id}.push`}
                control={control}
                render={({ field }) => <ToggleSwitch label="Push" value={field.value} onChange={field.onChange} />}
              />
              <Controller
                name={`${section.id}.email`}
                control={control}
                render={({ field }) => <ToggleSwitch label="Email" value={field.value} onChange={field.onChange} />}
              />
              <Controller
                name={`${section.id}.sms`}
                control={control}
                render={({ field }) => <ToggleSwitch label="SMS" value={field.value} onChange={field.onChange} />}
              />
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};