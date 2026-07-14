
export type PlanSlug = 'starter' | 'web' | 'solo' | 'duo' | 'unlimited';

export const PLAN_LIMITS: Record<PlanSlug, {
  maxBankAccounts: number;
  canLinkWebsite: boolean;
  canUploadManualStatements: boolean;
}> = {
  starter: {
    maxBankAccounts: 0,
    canLinkWebsite: false,
    canUploadManualStatements: true,
  },
  web: {
    maxBankAccounts: 0,
    canLinkWebsite: true,
    canUploadManualStatements: true,
  },
  solo: {
    maxBankAccounts: 1,
    canLinkWebsite: true,
    canUploadManualStatements: true,
  },
  duo: {
    maxBankAccounts: 2,
    canLinkWebsite: true,
    canUploadManualStatements: true,
  },
  unlimited: {
    maxBankAccounts: Infinity,
    canLinkWebsite: true,
    canUploadManualStatements: true,
  },
};

export const plans = [
    {
      slug: 'starter',
      name: 'Starter',
      price: '500',
      description: 'For businesses that want affordable manual tracking',
      isPopular: false,
      features: [
        'Upload your bank statement manually',
        'All financial reports',
        'P&L, Cash Flow & Balance Sheet',
        'Tax estimator',
        'Automatic categorization rules',
      ]
    },
    {
      slug: 'web',
      name: 'Web',
      price: '1,200',
      description: 'Connect via your shop website',
      isPopular: false,
      features: [
        'Link via website',
        'Link via payment processor - automatic inflow tracking',
        'Input your outflows',
        'All financial reports',
        'P&L, Cash Flow & Balance Sheet',
        'Tax estimator',
        'Automatic categorization rules',
        'Upload your bank statement manually',
      ]
    },
    {
      slug: 'solo',
      name: 'Solo',
      price: '2,900',
      description: 'For businesses that want smart, automatic and seamless financial tracking',
      isPopular: true,
      features: [
        'Live sync – 1 bank account',
        'All financial reports',
        'P&L, Cash Flow & Balance Sheet',
        'Tax estimator',
        'Automatic categorization rules',
        'Website linking and manual bank statement upload included',
      ]
    },
    {
      slug: 'duo',
      name: 'Duo',
      price: '3,400',
      description: 'Sync two bank accounts seamlessly, increase your clarity',
      isPopular: false,
      features: [
        'Live sync – 2 bank accounts',
        'All financial reports',
        'P&L, Cash Flow & Balance Sheet',
        'Tax estimator',
        'Automatic categorization rules',
        'Website linking and manual bank statement upload included',
      ]
    },
    {
      slug: 'unlimited',
      name: 'Unlimited',
      price: '5,500',
      description: 'All your accounts in one place, what could be better?',
      isPopular: false,
      features: [
        'Live sync – unlimited accounts',
        'All financial reports',
        'P&L, Cash Flow & Balance Sheet',
        'Tax estimator',
        'Automatic categorization rules',
        'Website linking and manual bank statement upload included',
      ]
    }
  ];