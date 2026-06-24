
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