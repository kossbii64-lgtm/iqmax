import { ShoppingBag } from 'lucide-react';
import type { AppTab, UserProfile } from '../types/store';
import { BrandLogo } from './BrandLogo';

interface AppHeaderProps {
  activeTab: AppTab;
  cartItemCount: number;
  currentUser: UserProfile;
  onSelectHome: () => void;
  onOpenCart: () => void;
}

const TAB_LABELS: Record<AppTab, string> = {
  home: 'Home',
  shop: 'Shop',
  orders: 'My Orders',
  profile: 'Profile',
};

export function AppHeader({
  activeTab,
  cartItemCount,
  currentUser,
  onSelectHome,
  onOpenCart,
}: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-14 sm:h-16 bg-white/95 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto h-full px-4 sm:px-6 flex items-center justify-between gap-3">
        <button
          type="button"
          onClick={onSelectHome}
          aria-label="Go to IQMAX+ Home"
          className="flex items-center gap-2.5 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A91] rounded-lg"
        >
          <BrandLogo variant="dark" size="sm" />
        </button>

        <div className="flex items-center gap-2 sm:gap-3">
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#F6F8FB] border border-slate-200 text-xs">
            <span className="font-semibold text-[#0F1E36] max-w-[140px] truncate">
              {currentUser.fullName}
            </span>
            <span className="px-1.5 py-0.5 rounded bg-[#F5A623]/20 text-[#9A5B00] font-mono text-[10px] font-bold">
              DEMO
            </span>
          </div>

          <span className="sm:hidden px-2 py-1 rounded-md bg-[#EBF2FC] text-[#164A91] font-display font-bold text-xs">
            {TAB_LABELS[activeTab]}
          </span>

          <button
            type="button"
            onClick={onOpenCart}
            data-testid="header-cart-button"
            aria-label={`Open shopping cart (${cartItemCount} items)`}
            className="relative inline-flex items-center gap-2 px-3 py-2 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-xs sm:text-sm transition-colors cursor-pointer min-h-[40px]"
          >
            <ShoppingBag className="w-4 h-4 text-[#F5A623]" aria-hidden="true" />
            <span className="hidden xs:inline sm:inline">Cart</span>
            <span
              data-testid="header-cart-count"
              className="inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full bg-[#F5A623] text-[#0F1E36] font-mono text-[11px] font-extrabold tabular-nums"
            >
              {cartItemCount}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
