// src/pages/dashboard/components/integrations/LinkWebsiteForm.tsx
import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Copy, TickCircle, DirectboxSend } from 'iconsax-react';

import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useCreateIntegration, useSendTestEvent } from '../../../../hooks/useIntegrations';
import { usePlanAccess } from '../../../../hooks/usePlanAccess'; // To get the current planSlug

interface IntegrationFormValues {
  name: string;
  platform: string;
  allowedOrigins: string;
  redirectUrl: string;
  webhookUrl: string;
}

export const LinkWebsiteForm = ({ onClose }: { onClose?: () => void }) => {
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { activePlan } = usePlanAccess();
  const { register, handleSubmit, control, formState: { errors } } = useForm<IntegrationFormValues>();
  
  const { mutate: createIntegration, isPending: isCreating } = useCreateIntegration();
  const { mutate: sendTestEvent, isPending: isTesting } = useSendTestEvent();

  // ==========================================
  // HANDLERS
  // ==========================================
  
  const onSubmit = (data: IntegrationFormValues) => {
    // Format the payload to match the backend schema
    const payload = {
      name: data.name,
      platform: data.platform,
      planSlug: activePlan, // Automatically grabbed from their active plan
      allowedOrigins: data.allowedOrigins.split(',').map(url => url.trim()), // Convert comma-string to array
      redirectUrl: data.redirectUrl || undefined,
      webhookUrl: data.webhookUrl || undefined,
    };

    createIntegration(payload, {
      onSuccess: (response) => {
        toast.success("Website linked successfully!");
        // Extract API key from response (adjust path based on your exact backend structure)
        const generatedKey = response?.data?.apiKey || response?.apiKey; 
        setApiKey(generatedKey);
      },
      onError: () => {
        toast.error("Failed to create integration. Please check your URLs.");
      }
    });
  };

  const handleCopy = () => {
    if (apiKey) {
      navigator.clipboard.writeText(apiKey);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      toast.success("API Key copied to clipboard");
    }
  };

  const handleTestEvent = () => {
    if (!apiKey) return;

    // Mock payload matching your swagger documentation
    const testPayload = {
      event: "order.paid",
      externalId: `woo_order_${Math.floor(Math.random() * 10000)}`,
      orderId: `order_${Math.floor(Math.random() * 10000)}`,
      amount: 25000,
      currency: "NGN",
      taxAmount: 1875,
      paymentFee: 375,
      paymentProvider: "paystack",
      occurredAt: new Date().toISOString(),
      customer: {
        email: "customer@example.com"
      }
    };

    sendTestEvent({ apiKey, payload: testPayload }, {
      onSuccess: () => {
        toast.success("Test event received successfully!");
        if (onClose) setTimeout(onClose, 1500); // Close modal after successful test
      },
      onError: () => {
        toast.error("Test event failed. Verify your API key.");
      }
    });
  };

  // ==========================================
  // RENDER STEP 2: SUCCESS & API KEY
  // ==========================================
  
  if (apiKey) {
    return (
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in zoom-in-95 duration-300">
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-16 h-16 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
            <TickCircle size="32" variant="Bulk" />
          </div>
          <h2 className="text-xl font-bold text-slate-900">Integration Created</h2>
          <p className="text-sm text-slate-500 mt-2">
            Copy your secret API key below. You will need this to authenticate requests from your website.
          </p>
        </div>

        <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-8 relative group">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Secret API Key</p>
          <code className="text-sm text-slate-800 break-all font-mono">{apiKey}</code>
          
          <button 
            onClick={handleCopy}
            className="absolute top-4 right-4 p-2 bg-white border border-slate-200 rounded-lg shadow-sm hover:bg-slate-50 transition-colors text-slate-500"
          >
            {copied ? <TickCircle size="16" className="text-emerald-500" /> : <Copy size="16" />}
          </button>
        </div>

        <div className="flex flex-col gap-3 pt-4 border-t border-slate-100">
          <Button 
            onClick={handleTestEvent} 
            isLoading={isTesting}
            className="w-full bg-slate-900 text-white"
          >
            <DirectboxSend size="18" className="mr-2" />
            Send Test Event
          </Button>
          <Button variant="outline" onClick={onClose} disabled={isTesting}>
            Done
          </Button>
        </div>
      </div>
    );
  }

  // ==========================================
  // RENDER STEP 1: INTEGRATION FORM
  // ==========================================
  
  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">Link your website</h2>
        <p className="text-sm text-slate-500 mt-1">Connect your e-commerce store to sync transactions automatically.</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Input 
          label="Website Name*" 
          placeholder="e.g. Main Storefront"
          error={errors.name?.message}
          {...register("name", { required: "Name is required" })} 
        />

        <div className="space-y-1.5">
          <label className="block text-sm font-medium text-slate-700">Platform*</label>
          <Controller
            name="platform"
            control={control}
            rules={{ required: "Platform is required" }}
            render={({ field: { onChange, value } }) => (
              <Dropdown 
                options={[
                  { label: "React / Next.js", value: "react" },
                  { label: "WordPress / WooCommerce", value: "wordpress" },
                  { label: "Custom Website", value: "custom" }
                ]} 
                value={value || ""} 
                onChange={onChange} 
                placeholder="Select platform..." 
              />
            )}
          />
          {errors.platform && <p className="text-red-500 text-xs">{errors.platform.message}</p>}
        </div>

        <Input 
          label="Allowed Origins*" 
          placeholder="https://example.com, https://app.example.com"
          error={errors.allowedOrigins?.message}
          {...register("allowedOrigins", { required: "At least one origin is required" })} 
        />
        <p className="text-[10px] text-slate-400 -mt-2">Separate multiple URLs with commas.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input 
            label="Redirect URL (Optional)" 
            placeholder="https://..."
            {...register("redirectUrl")} 
          />
          <Input 
            label="Webhook URL (Optional)" 
            placeholder="https://..."
            {...register("webhookUrl")} 
          />
        </div>

        <div className="pt-4 flex gap-3">
          {onClose && (
            <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>
          )}
          <Button type="submit" isLoading={isCreating} className="w-full bg-brand-blue text-white">
            Generate API Key
          </Button>
        </div>
      </form>
    </div>
  );
};