// src/pages/dashboard/components/support/SupportFAQView.tsx
import { SearchNormal1, Heart, ArrowSwapHorizontal, CloseSquare, DocumentText, Refresh, Sms } from 'iconsax-react';
import { Button } from '../../../../components/ui/Button';

const faqs = [
  {
    icon: Heart,
    question: "Is there a free trial available?",
    answer: "Yes, you can try us for free for 30 days. Our friendly team will work with you to get you up and running as soon as possible."
  },
  {
    icon: ArrowSwapHorizontal,
    question: "Can I change my plan later?",
    answer: "Of course. Our pricing scales with your company. Chat to our friendly team to find a solution that works for you."
  },
  {
    icon: CloseSquare,
    question: "What is your cancellation policy?",
    answer: "We understand that things change. You can cancel your plan at any time and we'll refund you the difference already paid."
  },
  {
    icon: DocumentText,
    question: "Can other info be added to an invoice?",
    answer: "At the moment, the only way to add additional information to invoices is to add the information to the workspace's name."
  },
  {
    icon: Refresh,
    question: "How does billing work?",
    answer: "Plans are per workspace, not per account. You can upgrade one workspace, and still have any number of free workspaces."
  },
  {
    icon: Sms,
    question: "How do I change my account email?",
    answer: "You can change the email address associated with your account by going to untitled.com/account from a laptop or desktop."
  }
];

export const SupportFAQView = () => {
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
        <Button className="bg-brand-blue text-white px-6 py-2 text-sm shrink-0 w-fit">
          Get in touch
        </Button>
      </div>

    </div>
  );
};