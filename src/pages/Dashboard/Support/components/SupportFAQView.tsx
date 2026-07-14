import { SearchNormal1, Heart, ArrowSwapHorizontal, CloseSquare, DocumentText, Refresh, Sms } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';
import { CreateTicketDrawer } from './CreateTicketDrawer';
import { useState } from 'react';

const faqs = [
  {
    icon: Heart,
    question: "Who is MyTrackr for? ",
    answer: "MyTrackr is built for small business owners, freelancers, online sellers, service providers, and growing businesses that want better visibility into their finances without stress, manual calculation or complicated accounting software. "
  },
  {
    icon: ArrowSwapHorizontal,
    question: "Is it safe to connect my bank account? ",
    answer: "Yes. MyTrackr only uses secure, read-only access to transaction data. We do not have access to move money or perform transactions on your account. If you prefer, you can also upload your bank statements manually instead of connecting your account."
  },
  {
    icon: CloseSquare,
    question: "Does MyTrackr work on mobile devices?",
    answer: "Yes. MyTrackr is very mobile friendly. It works on desktop, tablet, and mobile browsers."
  },
  {
    icon: DocumentText,
    question: "What should I do if my bank is not currently supported?",
    answer: "We are working to ensure we support all banks. If your bank is not currently supported, you can still use MyTrackr by uploading your bank statements manually or by linking your website if you have one."
  },
  {
    icon: Refresh,
    question: "What makes MyTrackr different from accounting software?",
    answer: "MyTrackr focuses on simplicity. It helps growing business owners understand their money without the difficulty of traditional accounting tools."
  },
  {
    icon: Sms,
    question: "Do I need accounting knowledge to use MyTrackr?",
    answer: "No. MyTrackr was designed for everyday business owners, not accountants. The platform uses simple language and easy-to-understand reports."
  },
  {
    icon: Sms,
    question: "Can I cancel or change my subscription plan?",
    answer: "Yes. You can upgrade, downgrade, or cancel your subscription anytime. If you cancel your plan, you’ll continue to have access to MyTrackr until the end of your current billing period."
  },
  {
    icon: Sms,
    question: "What if I sometimes spend business money personally?",
    answer: "That’s common for many small business owners. MyTrackr allows you categorise personal withdrawals separately so you can better understand your actual business expenses and profit."
  },

];

export const SupportFAQView = () => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  
  return (
    <div className="animate-in fade-in duration-300">
      
      {/* Header & Search */}
      <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-12">
        <div className="max-w-xl">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">How can we help you today?</h2>
          <h3 className="text-base font-bold text-slate-800 mb-2">Frequently Asked Questions</h3>
          <p className="text-sm text-slate-500 leading-relaxed">
            Everything you need to know about Mytrackr and billing. Can't find the answer you're looking for? Please <span className="underline cursor-pointer hover:text-slate-700">chat to our friendly team</span>.
          </p>
        </div>
        <div className="relative w-full md:w-72 shrink-0">
          <SearchNormal1 size="16" className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Search help articles" 
            className="w-full pl-9 pr-4 py-2 bg-white border border-slate-200 rounded-lg text-sm focus:ring-1 focus:ring-brand-blue outline-none"
          />
        </div>
      </div>

      {/* FAQ Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12 mb-12">
        {faqs.map((faq, idx) => {
          const Icon = faq.icon;
          return (
            <div key={idx} className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center">
                <Icon size="20" variant="Linear" color="#135ED6" className="text-brand-blue" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-slate-900 mb-2">{faq.question}</h4>
                <p className="text-sm text-slate-500 leading-relaxed">{faq.answer}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom CTA */}
      <div className="bg-slate-50 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="">
          <h4 className="text-sm font-bold text-slate-900">Still have questions?</h4>
          <p className="text-sm text-slate-500 mt-1">Can't find the answer you're looking for? Please chat to our friendly team.</p>
        </div>
        <Button className="bg-brand-blue text-white px-6 py-2 text-sm shrink-0 w-fit" onClick={() => setIsDrawerOpen(true)}>
          Get in touch
        </Button>
      </div>

<CreateTicketDrawer 
        isOpen={isDrawerOpen} 
        onClose={() => setIsDrawerOpen(false)} 
      />
    </div>
  );
};