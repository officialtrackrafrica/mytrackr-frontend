import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import { Copy, TickCircle, DirectboxSend, Card } from 'iconsax-react';

import { Input } from '../../../../components/ui/Input';
import { Button } from '../../../../components/ui/Button';
import { Dropdown } from '../../../../components/ui/Dropdown';
import { useCreateIntegration, useSendTestEvent, useConnectPaystack } from '../../../../hooks/useIntegrations'; // Added useConnectPaystack
import { usePlanAccess } from '../../../../hooks/usePlanAccess'; 

interface IntegrationFormValues {
  name: string;
  platform: string;
  allowedOrigins: string;
  redirectUrl: string;
  webhookUrl: string;
}

interface PaystackFormValues {
  mytrackrApiKey: string;
  secretKey: string;
}

export const LinkWebsiteForm = ({ onClose }: { onClose?: () => void }) => {
  const [activeTab, setActiveTab] = useState<'website' | 'gateway'>('website');
  const [apiKey, setApiKey] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  
  const { activePlan } = usePlanAccess();
  
  // Form for Website Integration
  const { 
    register: registerWeb, 
    handleSubmit: handleSubmitWeb, 
    control: controlWeb, 
    formState: { errors: errorsWeb } 
  } = useForm<IntegrationFormValues>();

  // Form for Paystack Gateway
  const { 
    register: registerPaystack, 
    handleSubmit: handleSubmitPaystack, 
    formState: { errors: errorsPaystack } 
  } = useForm<PaystackFormValues>();
  
  const { mutate: createIntegration, isPending: isCreating } = useCreateIntegration();
  const { mutate: sendTestEvent, isPending: isTesting } = useSendTestEvent();
  const { mutate: connectPaystack, isPending: isConnectingPaystack } = useConnectPaystack();

  // ==========================================
  // HANDLERS
  // ==========================================
  
  const onWebsiteSubmit = (data: IntegrationFormValues) => {
    const payload = {
      name: data.name,
      platform: data.platform,
      planSlug: activePlan,
      allowedOrigins: data.allowedOrigins.split(',').map(url => url.trim()), 
      redirectUrl: data.redirectUrl || undefined,
      webhookUrl: data.webhookUrl || undefined,
    };

    createIntegration(payload, {
      onSuccess: (response) => {
        toast.success("Website linked successfully!");
        const generatedKey = response?.data?.apiKey || response?.apiKey; 
        setApiKey(generatedKey);
      },
      onError: () => {
        toast.error("Failed to create integration. Please check your URLs.");
      }
    });
  };

  const onPaystackSubmit = (data: PaystackFormValues) => {
    connectPaystack({
      secretKey: data.secretKey
    }, {
      onSuccess: () => {
        toast.success("Paystack connected successfully!");
        if (onClose) setTimeout(onClose, 1000);
      },
      onError: () => {
        toast.error("Failed to connect Paystack. Please verify your keys.");
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
      customer: { email: "customer@example.com" }
    };

    sendTestEvent({ apiKey, payload: testPayload }, {
      onSuccess: () => {
        toast.success("Test event received successfully!");
        if (onClose) setTimeout(onClose, 1500); 
      },
      onError: () => {
        toast.error("Test event failed. Verify your API key.");
      }
    });
  };

  // ==========================================
  // RENDER: SUCCESS STEP (API KEY GENERATED)
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
  // RENDER: FORM TABS
  // ==========================================
  
  return (
    <div className="w-full max-w-lg bg-white p-8 rounded-2xl border border-slate-200 shadow-sm animate-in fade-in duration-300">
      
      {/* Tabs */}
      <div className="flex bg-slate-100 p-1 rounded-lg mb-6">
<button
          onClick={() => setActiveTab('gateway')}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-all duration-200 ${activeTab === 'gateway' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Payment Gateway
        </button>
        <button
          onClick={() => setActiveTab('website')}
          className={`flex-1 text-sm font-medium py-2 rounded-md transition-all duration-200 ${activeTab === 'website' ? 'bg-white shadow-sm text-slate-900' : 'text-slate-500 hover:text-slate-700'}`}
        >
          Link Website
        </button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold text-slate-900">
          {activeTab === 'website' ? 'Link your website' : 'Connect Paystack'}
        </h2>
        <p className="text-sm text-slate-500 mt-1">
          {activeTab === 'website' 
            ? 'Connect your e-commerce store to sync transactions automatically.' 
            : 'Store your merchant Paystack secret key for direct e-commerce sync.'}
        </p>
      </div>

      {activeTab === 'website' ? (
        <form onSubmit={handleSubmitWeb(onWebsiteSubmit)} className="space-y-4 animate-in fade-in slide-in-from-left-2 duration-300">
          <Input 
            label="Website Name*" 
            placeholder="e.g. Main Storefront"
            error={errorsWeb.name?.message}
            {...registerWeb("name", { required: "Name is required" })} 
          />

          <div className="space-y-1.5">
            <label className="block text-sm font-medium text-slate-700">Platform*</label>
            <Controller
              name="platform"
              control={controlWeb}
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
            {errorsWeb.platform && <p className="text-red-500 text-xs">{errorsWeb.platform.message}</p>}
          </div>

          <Input 
            label="Allowed Origins*" 
            placeholder="https://example.com, https://app.example.com"
            error={errorsWeb.allowedOrigins?.message}
            {...registerWeb("allowedOrigins", { required: "At least one origin is required" })} 
          />
          <p className="text-[10px] text-slate-400 -mt-2">Separate multiple URLs with commas.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Input 
              label="Redirect URL (Optional)" 
              placeholder="https://..."
              {...registerWeb("redirectUrl")} 
            />
            <Input 
              label="Webhook URL (Optional)" 
              placeholder="https://..."
              {...registerWeb("webhookUrl")} 
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
      ) : (
        <form onSubmit={handleSubmitPaystack(onPaystackSubmit)} className="space-y-4 animate-in fade-in slide-in-from-right-2 duration-300">
                  
          <Input 
            label="Paystack Secret Key*" 
            type="password"
            placeholder="sk_live_..."
            error={errorsPaystack.secretKey?.message}
            {...registerPaystack("secretKey", { required: "Paystack Secret Key is required" })} 
          />

          <div className="pt-4 flex gap-3">
            {onClose && (
              <Button type="button" variant="outline" className="w-full" onClick={onClose} disabled={isConnectingPaystack}>
                Cancel
              </Button>
            )}
            <Button type="submit" isLoading={isConnectingPaystack} className="w-full bg-brand-blue text-white">
              <Card size="18" className="mr-2" />
              Connect Paystack
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};