import { useCurrentPlan } from '../pages/Dashboard/Settings/api/useBilling';
import { PLAN_LIMITS, type PlanSlug } from '../utils/plans';

export const usePlanAccess = () => {
  const { data: currentPlan, isLoading } = useCurrentPlan();
  const activeSlug = (currentPlan?.activePlan?.slug as PlanSlug) || 'starter';
  const limits = PLAN_LIMITS[activeSlug];
  return {
    isLoading,
    activePlan: activeSlug,
    
    // Feature Checks
    canLinkWebsite: limits.canLinkWebsite,
    canUploadManual: limits.canUploadManualStatements,
    
    // Bank Account Checks
    maxBanksAllowed: limits.maxBankAccounts,
    canAddAnotherBank: (currentBankCount: number) => currentBankCount < limits.maxBankAccounts,
  };
};
