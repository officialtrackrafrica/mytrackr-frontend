import { useQuery } from '@tanstack/react-query';
import { api } from '../utils/api';

// One row per supported institutionId/accountType pair, as returned by GET /mono/institutions
export interface MonoInstitution {
  institutionId: string;
  name: string;
  accountType: string; // e.g. "PERSONAL_BANKING" | "BUSINESS_BANKING"
  authMethods?: string[];
  country?: string;
  bankCode?: string;
  icon?: string;
}

// The same bank with every account type it supports, for display in a picker
export interface InstitutionGroup {
  institutionId: string;
  name: string;
  icon?: string;
  accountTypes: string[];
}

export const groupInstitutions = (rows: MonoInstitution[]): InstitutionGroup[] => {
  const groups = new Map<string, InstitutionGroup>();

  for (const row of rows) {
    if (!row?.institutionId) continue;
    const existing = groups.get(row.institutionId);
    if (existing) {
      if (!existing.accountTypes.includes(row.accountType)) {
        existing.accountTypes.push(row.accountType);
      }
      if (!existing.icon && row.icon) existing.icon = row.icon;
    } else {
      groups.set(row.institutionId, {
        institutionId: row.institutionId,
        name: row.name,
        icon: row.icon,
        accountTypes: [row.accountType],
      });
    }
  }

  return [...groups.values()].sort((a, b) => a.name.localeCompare(b.name));
};

// "PERSONAL_BANKING" -> "Personal banking"
export const formatAccountType = (accountType: string) => {
  const text = accountType.replace(/_/g, ' ').toLowerCase();
  return text.charAt(0).toUpperCase() + text.slice(1);
};

export const useInstitutions = (enabled = true) => {
  return useQuery({
    queryKey: ['mono', 'institutions'],
    queryFn: async (): Promise<MonoInstitution[]> => {
      const { data } = await api.get('/mono/institutions');
      const rows = Array.isArray(data) ? data : data?.data;
      return Array.isArray(rows) ? rows : [];
    },
    enabled,
    staleTime: 1000 * 60 * 30, // coverage list rarely changes
  });
};
