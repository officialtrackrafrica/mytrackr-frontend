// import { useMemo, useState } from 'react';
// import { Bank, SearchNormal1, TickCircle } from 'iconsax-react';
// import { Dialog } from './ui/Dialog';
// import { Button } from './ui/Button';
// import { cn } from '../utils/cn';
// import {
//   formatAccountType,
//   groupInstitutions,
//   useInstitutions,
//   type InstitutionGroup,
// } from '../hooks/useInstitutions';

// export interface BankSelection {
//   institutionId: string;
//   accountType: string;
// }

// interface SelectBankModalProps {
//   onClose: () => void;
//   onConfirm: (selection: BankSelection) => void;
//   isSubmitting?: boolean;
//   planName?: string;
// }

// const BankIcon = ({ institution }: { institution: InstitutionGroup }) => {
//   const [failed, setFailed] = useState(false);

//   if (!institution.icon || failed) {
//     return (
//       <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
//         <Bank size="18" color="#64748B" />
//       </div>
//     );
//   }

//   return (
//     <img
//       src={institution.icon}
//       alt=""
//       onError={() => setFailed(true)}
//       className="w-9 h-9 rounded-full object-contain bg-white border border-slate-100 shrink-0"
//     />
//   );
// };

// // Mount this only while it should be visible, so the selection resets every time it opens.
// export const SelectBankModal = ({ onClose, onConfirm, isSubmitting, planName }: SelectBankModalProps) => {
//   const { data, isLoading, isError, refetch, isRefetching } = useInstitutions();
//   const [search, setSearch] = useState('');
//   const [selectedId, setSelectedId] = useState<string | null>(null);
//   const [accountType, setAccountType] = useState<string | null>(null);

//   const institutions = useMemo(() => groupInstitutions(data ?? []), [data]);

//   const filtered = useMemo(() => {
//     const term = search.trim().toLowerCase();
//     if (!term) return institutions;
//     return institutions.filter((inst) => inst.name.toLowerCase().includes(term));
//   }, [institutions, search]);

//   const selected = institutions.find((inst) => inst.institutionId === selectedId) ?? null;

//   const handleSelectInstitution = (inst: InstitutionGroup) => {
//     setSelectedId(inst.institutionId);
//     // Only one option? Pick it for the user.
//     setAccountType(inst.accountTypes.length === 1 ? inst.accountTypes[0] : null);
//   };

//   const handleConfirm = () => {
//     if (!selected || !accountType) return;
//     onConfirm({ institutionId: selected.institutionId, accountType });
//   };

//   return (
//     <Dialog
//       isOpen
//       onClose={isSubmitting ? () => {} : onClose}
//       title="Select your bank"
//       description={
//         planName
//           ? `Choose the bank you'll connect on the ${planName} plan so we can confirm it's supported before checkout.`
//           : "Choose the bank you'll connect so we can confirm it's supported before checkout."
//       }
//     >
//       <div className="space-y-5">
//         {/* Search */}
//         <div className="relative">
//           <SearchNormal1
//             size="16"
//             color="#94A3B8"
//             className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
//           />
//           <input
//             type="text"
//             value={search}
//             onChange={(e) => setSearch(e.target.value)}
//             placeholder="Search banks"
//             className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue placeholder:text-slate-400"
//           />
//         </div>

//         {/* Bank list */}
//         <div className="border border-slate-200 rounded-xl max-h-[38vh] overflow-y-auto">
//           {isLoading ? (
//             <div className="p-3 space-y-2">
//               {Array.from({ length: 6 }).map((_, idx) => (
//                 <div key={idx} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
//               ))}
//             </div>
//           ) : isError ? (
//             <div className="p-6 text-center">
//               <p className="text-sm text-slate-500 mb-3">We couldn't load the list of supported banks.</p>
//               <button
//                 type="button"
//                 onClick={() => refetch()}
//                 disabled={isRefetching}
//                 className="text-sm font-semibold text-brand-blue hover:underline cursor-pointer disabled:opacity-50"
//               >
//                 {isRefetching ? 'Retrying...' : 'Try again'}
//               </button>
//             </div>
//           ) : filtered.length === 0 ? (
//             <p className="p-6 text-sm text-slate-500 text-center">
//               {institutions.length === 0
//                 ? 'No supported banks are available right now.'
//                 : `No supported bank matches "${search.trim()}".`}
//             </p>
//           ) : (
//             <ul className="p-1.5 flex flex-col gap-0.5">
//               {filtered.map((inst) => {
//                 const isSelected = inst.institutionId === selectedId;
//                 return (
//                   <li key={inst.institutionId}>
//                     <button
//                       type="button"
//                       onClick={() => handleSelectInstitution(inst)}
//                       aria-pressed={isSelected}
//                       className={cn(
//                         'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer',
//                         isSelected ? 'bg-blue-50 text-brand-blue font-semibold' : 'text-slate-700 hover:bg-slate-50'
//                       )}
//                     >
//                       <BankIcon institution={inst} />
//                       <span className="flex-1 truncate">{inst.name}</span>
//                       {isSelected && <TickCircle size="18" color="#135ED6" variant="Bold" className="shrink-0" />}
//                     </button>
//                   </li>
//                 );
//               })}
//             </ul>
//           )}
//         </div>

//         {/* Account type */}
//         {selected && (
//           <div>
//             <p className="text-xs font-semibold text-slate-600 mb-2">Account type</p>
//             <div className="flex flex-wrap gap-2">
//               {selected.accountTypes.map((type) => (
//                 <button
//                   key={type}
//                   type="button"
//                   onClick={() => setAccountType(type)}
//                   aria-pressed={accountType === type}
//                   className={cn(
//                     'px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer',
//                     accountType === type
//                       ? 'border-brand-blue bg-blue-50 text-brand-blue'
//                       : 'border-slate-200 text-slate-600 hover:border-slate-300'
//                   )}
//                 >
//                   {formatAccountType(type)}
//                 </button>
//               ))}
//             </div>
//           </div>
//         )}

//         <Button
//           className="bg-brand-blue text-white rounded-xl py-2.5 disabled:opacity-50"
//           disabled={!selected || !accountType || isSubmitting}
//           onClick={handleConfirm}
//         >
//           {isSubmitting ? 'Processing...' : 'Continue to checkout'}
//         </Button>
//       </div>
//     </Dialog>
//   );
// };

import { useMemo, useState } from 'react';
import { Bank, SearchNormal1, TickCircle } from 'iconsax-react';
import { Dialog } from './ui/Dialog';
import { Button } from './ui/Button';
import { cn } from '../utils/cn';
import {
  formatAccountType,
  groupInstitutions,
  useInstitutions,
  type InstitutionGroup,
} from '../hooks/useInstitutions';

export interface BankSelection {
  institutionId: string;
  accountType: string;
  autoRenew: boolean;
}

interface SelectBankModalProps {
  onClose: () => void;
  onConfirm: (selection: BankSelection) => void;
  isSubmitting?: boolean;
  planName?: string;
}

const BankIcon = ({ institution }: { institution: InstitutionGroup }) => {
  const [failed, setFailed] = useState(false);

  if (!institution.icon || failed) {
    return (
      <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center shrink-0">
        <Bank size="18" color="#64748B" />
      </div>
    );
  }

  return (
    <img
      src={institution.icon}
      alt=""
      onError={() => setFailed(true)}
      className="w-9 h-9 rounded-full object-contain bg-white border border-slate-100 shrink-0"
    />
  );
};

// Mount this only while it should be visible, so the selection resets every time it opens.
export const SelectBankModal = ({ onClose, onConfirm, isSubmitting, planName }: SelectBankModalProps) => {
  const { data, isLoading, isError, refetch, isRefetching } = useInstitutions();
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [accountType, setAccountType] = useState<string | null>(null);
  const [autoRenew, setAutoRenew] = useState(false);

  const institutions = useMemo(() => groupInstitutions(data ?? []), [data]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return institutions;
    return institutions.filter((inst) => inst.name.toLowerCase().includes(term));
  }, [institutions, search]);

  const selected = institutions.find((inst) => inst.institutionId === selectedId) ?? null;

  const handleSelectInstitution = (inst: InstitutionGroup) => {
    setSelectedId(inst.institutionId);
    // Only one option? Pick it for the user.
    setAccountType(inst.accountTypes.length === 1 ? inst.accountTypes[0] : null);
  };

  const handleConfirm = () => {
    if (!selected || !accountType) return;
    onConfirm({ institutionId: selected.institutionId, accountType, autoRenew });
  };

  return (
    <Dialog
      isOpen
      onClose={isSubmitting ? () => {} : onClose}
      title="Select your bank"
      description={
        planName
          ? `Choose the bank you'll connect on the ${planName} plan so we can confirm it's supported before checkout.`
          : "Choose the bank you'll connect so we can confirm it's supported before checkout."
      }
    >
      <div className="space-y-5">
        {/* Search */}
        <div className="relative">
          <SearchNormal1
            size="16"
            color="#94A3B8"
            className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
          />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search banks"
            className="w-full pl-9 pr-3 py-2.5 border border-slate-200 rounded-xl text-sm outline-none focus:ring-1 focus:ring-brand-blue focus:border-brand-blue placeholder:text-slate-400"
          />
        </div>

        {/* Bank list */}
        <div className="border border-slate-200 rounded-xl max-h-[38vh] overflow-y-auto">
          {isLoading ? (
            <div className="p-3 space-y-2">
              {Array.from({ length: 6 }).map((_, idx) => (
                <div key={idx} className="h-12 rounded-lg bg-slate-100 animate-pulse" />
              ))}
            </div>
          ) : isError ? (
            <div className="p-6 text-center">
              <p className="text-sm text-slate-500 mb-3">We couldn't load the list of supported banks.</p>
              <button
                type="button"
                onClick={() => refetch()}
                disabled={isRefetching}
                className="text-sm font-semibold text-brand-blue hover:underline cursor-pointer disabled:opacity-50"
              >
                {isRefetching ? 'Retrying...' : 'Try again'}
              </button>
            </div>
          ) : filtered.length === 0 ? (
            <p className="p-6 text-sm text-slate-500 text-center">
              {institutions.length === 0
                ? 'No supported banks are available right now.'
                : `No supported bank matches "${search.trim()}".`}
            </p>
          ) : (
            <ul className="p-1.5 flex flex-col gap-0.5">
              {filtered.map((inst) => {
                const isSelected = inst.institutionId === selectedId;
                return (
                  <li key={inst.institutionId}>
                    <button
                      type="button"
                      onClick={() => handleSelectInstitution(inst)}
                      aria-pressed={isSelected}
                      className={cn(
                        'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left text-sm transition-colors cursor-pointer',
                        isSelected ? 'bg-blue-50 text-brand-blue font-semibold' : 'text-slate-700 hover:bg-slate-50'
                      )}
                    >
                      <BankIcon institution={inst} />
                      <span className="flex-1 truncate">{inst.name}</span>
                      {isSelected && <TickCircle size="18" color="#135ED6" variant="Bold" className="shrink-0" />}
                    </button>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {/* Account type */}
        {selected && (
          <div>
            <p className="text-xs font-semibold text-slate-600 mb-2">Account type</p>
            <div className="flex flex-wrap gap-2">
              {selected.accountTypes.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setAccountType(type)}
                  aria-pressed={accountType === type}
                  className={cn(
                    'px-4 py-2 rounded-xl border text-sm font-medium transition-colors cursor-pointer',
                    accountType === type
                      ? 'border-brand-blue bg-blue-50 text-brand-blue'
                      : 'border-slate-200 text-slate-600 hover:border-slate-300'
                  )}
                >
                  {formatAccountType(type)}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Auto-renew */}
        <label className="flex items-start gap-3 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={autoRenew}
            onChange={(e) => setAutoRenew(e.target.checked)}
            disabled={isSubmitting}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 accent-brand-blue cursor-pointer"
          />
          <span>
            <span className="block text-sm font-medium text-slate-700">Auto-renew my subscription</span>
            <span className="block text-xs text-slate-500">
              We'll charge you automatically at the end of each billing period.
            </span>
          </span>
        </label>

        <Button
          className="bg-brand-blue text-white rounded-xl py-2.5 disabled:opacity-50"
          disabled={!selected || !accountType || isSubmitting}
          onClick={handleConfirm}
        >
          {isSubmitting ? 'Processing...' : 'Continue to checkout'}
        </Button>
      </div>
    </Dialog>
  );
};