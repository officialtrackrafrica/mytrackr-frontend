import { useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { 
  Home2, ReceiptItem, Chart2, Briefcase, 
  PercentageSquare, Headphone, Setting2,  CloseCircle, ArrowDown2, 
  LogoutCurve,
  Code
} from 'iconsax-react';
import { cn } from '../../utils/cn';
import Logo from '../../assets/Logo.png';
import { useUser } from '../../hooks/useUser';
import { useLogout } from '../../features/auth/hooks/useLogout';

// 1. Updated navItems schema to house children configs
const navItems = [
  { name: 'Home', icon: Home2, path: '/dashboard' },
  { name: 'Transactions', icon: ReceiptItem, path: '/transactions' },
  { 
    name: 'Financial Report', 
    icon: Chart2, 
    path: '/reports',
    subItems: [
      { name: 'Profit and Loss', path: '/reports/profit-and-loss' },
      { name: 'Balance Sheet', path: '/reports/balance-sheet' },
      { name: 'Cash Flow Statement', path: '/reports/cash-flow' }
    ]
  },
  { name: 'What You Own & Debts You Owe', icon: Briefcase, path: '/assets' },
  { name: 'Tax Calculator', icon: PercentageSquare, path: '/tax' },
];

const secondaryItems = [
  { name: 'Support', icon: Headphone, path: '/support' },
  { name: 'Settings', icon: Setting2, path: '/settings' },
  { 
    name: 'API Integrations', 
    icon: Code, 
    path: 'https://mytrackr.myco.com.ng/developers/integrations',
    isExternal: true 
  },
];

// 2. Extracted Dropdown Component for Cleanliness
const SidebarDropdownItem = ({ item, onLinkClick }: { item: any; onLinkClick: () => void }) => {
  const location = useLocation();
  const hasActiveChild = item.subItems?.some((sub: any) => location.pathname === sub.path);
  const [isOpen, setIsOpen] = useState(hasActiveChild);

  return (
    <div className="space-y-1">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-500 hover:bg-[#E5E5E5]/50",
          hasActiveChild && "bg-[#E5E5E5]/30 text-slate-900"
        )}
      >
        <div className="flex items-center gap-3">
          <item.icon 
            size="20" 
            color='#050E1E' 
            variant={hasActiveChild ? 'Bold' : 'Linear'} 
          />
          <span className={cn(hasActiveChild && "font-bold text-slate-900")}>{item.name}</span>
        </div>
        <ArrowDown2 
          size="14" 
          color='#050E1E'
          className={cn("transition-transform duration-200 opacity-60", isOpen && "rotate-180")} 
        />
      </button>

      {/* Sub Menu Items Layer */}
      {isOpen && (
        <div className="pl-9 space-y-1 animate-in fade-in slide-in-from-top-1 duration-150">
          {item.subItems.map((sub: any) => (
            <NavLink
              key={sub.name}
              to={sub.path}
              onClick={onLinkClick}
              className={({ isActive }) => cn(
                "block px-3 py-2 rounded-md text-xs font-medium transition-colors text-slate-500 hover:text-slate-900 hover:bg-slate-100",
                isActive && "text-brand-blue font-bold bg-blue-50/60 hover:bg-blue-50/60"
              )}
            >
              {sub.name}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({ onClose }: { onClose?: () => void }) => {
  const { user } = useUser();
const { mutate: logout, isPending: isLoggingOut } = useLogout();
  const handleLinkClick = () => {
    if (onClose) onClose();
  };

  return (
    <aside className="w-full bg-[#F3F3F3] border-r border-slate-200 h-full flex flex-col justify-between py-6 px-4">
      <div>
        {/* Brand Logo & Mobile Close Toggle */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-2 px-2">
            <img src={Logo} alt="Logo" className="w-10" />
            <span className="text-xl font-bold text-slate-900">MyTrackr</span>
          </div>
          
          <button 
            onClick={onClose} 
            className="lg:hidden text-slate-400 hover:text-slate-600 p-1"
          >
            <CloseCircle size="24" color='#050E1E'/>
          </button>
        </div>

        {/* Primary Nav */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            // Render accordion if subItems are declared
            if (item.subItems) {
              return (
                <SidebarDropdownItem 
                  key={item.name} 
                  item={item} 
                  onLinkClick={handleLinkClick} 
                />
              );
            }

            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={({ isActive }) => cn(
                  "flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                  isActive ? "bg-[#E5E5E5] text-slate-900" : "text-slate-500 hover:bg-[#E5E5E5]"
                )}
              >
                <div className="flex items-center gap-3">
                  <item.icon 
                    size="20" 
                    variant={item.path === '/dashboard' ? 'Bold' : 'Linear'} 
                    color='#050E1E'
                  />
                  {item.name}
                </div>
              </NavLink>
            );
          })}
        </nav>
      </div>

      {/* Footer Nav & Profile */}
      <div className="space-y-6">
        <nav className="space-y-1">
          {secondaryItems.map((item) => {
            const baseClassName = "flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 hover:bg-slate-100";

            //  Render standard anchor tag for external documentation links
            if (item.isExternal) {
              return (
                <a
                  key={item.name}
                  href={item.path}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={baseClassName}
                >
                  <item.icon size="20" color='#050E1E'/>
                  {item.name}
                </a>
              );
            }

            // Render standard React Router NavLink for internal app routes
            return (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={handleLinkClick}
                className={baseClassName}
              >
                <item.icon size="20" color='#050E1E'/>
                {item.name}
              </NavLink>
            );
          })}
        </nav>

        {/* Profile Card */}
        <div className="pt-6 border-t border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-6 overflow-hidden">
            <div className="w-10 h-10 rounded-full bg-brand-blue shrink-0 flex items-center justify-center text-white font-bold">
              {user?.firstName?.[0]}{user?.lastName?.[0]}
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold text-slate-900 truncate">
                {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
              </p>
              <p className="text-xs text-slate-500 truncate">
                {user?.email}
              </p>
            </div>
          </div>
         <button 
            onClick={() => logout()}
            disabled={isLoggingOut}
            className={cn(
              "text-slate-400 hover:text-red-500 transition-all shrink-0 rotate-180 p-1 rounded-md",
              isLoggingOut && "opacity-50 cursor-not-allowed hover:text-slate-400"
            )}
            title="Log out"
          >
            {isLoggingOut ? (
              <div className="w-5 h-5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogoutCurve size="20" color='#98A2B3'/>
            )}
          </button>
        </div>
      </div>
    </aside>
  );
};