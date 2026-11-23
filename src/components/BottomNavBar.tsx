import { Home, PackageCheck, ShoppingBag, User } from 'lucide-react';
import type { AppTab } from '../types/store';

interface BottomNavBarProps {
  activeTab: AppTab;
  ordersCount: number;
  onSelectTab: (tab: AppTab) => void;
}

const NAV_ITEMS: Array<{
  id: AppTab;
  label: string;
  icon: typeof Home;
}> = [
  { id: 'home', label: 'Home', icon: Home },
  { id: 'shop', label: 'Shop', icon: ShoppingBag },
  { id: 'orders', label: 'My Orders', icon: PackageCheck },
  { id: 'profile', label: 'Profile', icon: User },
];

export function BottomNavBar({ activeTab, ordersCount, onSelectTab }: BottomNavBarProps) {
  return (
    <nav
      aria-label="Primary app navigation"
      data-testid="bottom-nav-bar"
      className="fixed bottom-0 left-0 right-0 z-30 h-16 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-4px_20px_rgba(15,30,54,0.06)]"
    >
      <div className="max-w-2xl mx-auto h-full grid grid-cols-4 px-2">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = activeTab === item.id;
          return (
            <button
              key={item.id}
              type="button"
              onClick={() => onSelectTab(item.id)}
              data-testid={`bottom-nav-${item.id}`}
              aria-current={active ? 'page' : undefined}
              className={`relative flex flex-col items-center justify-center gap-1 rounded-xl my-1 transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A91] ${
                active
                  ? 'text-[#164A91] bg-[#EBF2FC]/80'
                  : 'text-slate-500 hover:text-[#164A91] hover:bg-slate-50'
              }`}
            >
              {active && (
                <span
                  aria-hidden="true"
                  className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-0.5 rounded-full bg-[#F5A623]"
                />
              )}
              <div className="relative">
                <Icon
                  className={`w-5 h-5 ${active ? 'stroke-[2.4]' : 'stroke-[1.9]'}`}
                  aria-hidden="true"
                />
                {item.id === 'orders' && ordersCount > 0 && (
                  <span className="absolute -top-1.5 -right-2.5 min-w-[16px] h-4 px-1 rounded-full bg-[#F5A623] text-[#0F1E36] font-mono text-[10px] font-extrabold flex items-center justify-center tabular-nums">
                    {ordersCount}
                  </span>
                )}
              </div>
              <span
                className={`text-[11px] leading-none font-display ${
                  active ? 'font-extrabold' : 'font-semibold'
                }`}
              >
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
