import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock,
  Eye,
  Gift,
  ShoppingBag,
  Sparkles,
  Users,
} from 'lucide-react';
import { useState } from 'react';
import {
  FAQ_ITEMS,
  PRODUCT_PACKAGES,
  PRODUCT_USAGE_SPECS,
  STORE_CONFIG,
  SUPPORT_PILLARS,
} from '../config/storeConfig';
import type { ProductPackage } from '../types/store';
import { formatCurrency } from '../utils/storeLogic';
import { TestimonialsSection } from './TestimonialsSection';

interface HomeTabProps {
  onGoToShop: () => void;
  onAddToCart: (packageId: ProductPackage['id'], quantity: number) => void;
  onViewPackageDetails: (pkg: ProductPackage) => void;
}

export function HomeTab({ onGoToShop, onAddToCart, onViewPackageDetails }: HomeTabProps) {
  const [openFaqId, setOpenFaqId] = useState<string | null>(FAQ_ITEMS[0]?.id ?? null);
  const [justAddedId, setJustAddedId] = useState<ProductPackage['id'] | null>(null);

  const handleQuickAdd = (pkg: ProductPackage) => {
    onAddToCart(pkg.id, 1);
    setJustAddedId(pkg.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === pkg.id ? null : curr));
    }, 1300);
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. App Hero Card */}
      <section className="rounded-3xl bg-[#164A91] text-white overflow-hidden shadow-lg relative">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              'radial-gradient(circle at 85% 18%, #F5A623 0%, transparent 35%), radial-gradient(circle at 12% 90%, #60A5FA 0%, transparent 40%)',
          }}
        />
        <div className="relative z-10 p-6 sm:p-8 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-2.5 py-1 rounded-md bg-[#F5A623] text-[#0F1E36] font-mono text-[11px] font-extrabold tracking-wide uppercase">
                YouEdu IQMAX+
              </span>
              <span className="px-2.5 py-1 rounded-md bg-white/15 text-blue-50 font-mono text-[11px] font-semibold">
                30 Chewable Tablets · Mixfruit
              </span>
            </div>

            <h1 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-[1.12] tracking-tight [text-wrap:balance]">
              {STORE_CONFIG.tagline}
            </h1>

            <p className="text-sm sm:text-base text-blue-100 leading-relaxed max-w-xl">
              A daily sugar-free Mixfruit chewable nutritional supplement pairing Gut &times; Mind
              support with prebiotics, probiotics, Magnesium L-Threonate, L-Theanine, Centella
              Asiatica, and essential vitamins.
            </p>

            <div className="flex flex-wrap items-center gap-3 pt-1">
              <button
                type="button"
                onClick={onGoToShop}
                data-testid="home-shop-now-button"
                className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm transition-colors cursor-pointer min-h-[46px] shadow-sm"
              >
                <ShoppingBag className="w-4 h-4" aria-hidden="true" />
                <span>Shop Packages</span>
              </button>

              <a
                href="#home-featured-packages"
                className="inline-flex items-center justify-center gap-1.5 px-5 py-3.5 rounded-xl bg-white/15 hover:bg-white/20 text-white font-display font-bold text-sm transition-colors min-h-[46px]"
              >
                <span>View Deals</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </a>
            </div>
          </div>

          {/* Authentic Hero Packaging Image */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="w-full max-w-sm rounded-2xl bg-white p-4 sm:p-5 shadow-xl border border-white/20">
              <div className="aspect-[4/3] w-full flex items-center justify-center">
                <img
                  src="/images/iqmax-single-hero.png"
                  alt="YouEdu IQMAX+ original product box and 30 chewable tablets bottle"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-[#0F1E36]">
                <span className="font-display font-bold">Original IQMAX+ Packaging</span>
                <span className="font-mono font-bold text-[#164A91]">From RM 59.00</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Promotional Bundle Banner */}
      <section className="rounded-2xl bg-[#FFF8EB] border border-[#F5A623]/45 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-[#F5A623] text-[#0F1E36] flex items-center justify-center shrink-0">
            <Gift className="w-5 h-5" aria-hidden="true" />
          </div>
          <div>
            <p className="font-display font-extrabold text-sm sm:text-base text-[#0F1E36]">
              Bundle Promo: Package 2 (2 + 1 FREE) &amp; Package 3 (3 + 2 FREE = 5 Bottles)
            </p>
            <p className="text-xs text-slate-600 mt-0.5">
              Enjoy up to 2 complimentary bottles plus nationwide Online Transfer &amp; COD shipping.
            </p>
          </div>
        </div>
        <button
          type="button"
          onClick={onGoToShop}
          className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-xs sm:text-sm whitespace-nowrap cursor-pointer shrink-0 min-h-[42px]"
        >
          <span>Compare Packages</span>
          <ArrowRight className="w-4 h-4" aria-hidden="true" />
        </button>
      </section>

      {/* 3. Four Product Benefits & Quick Routine Info */}
      <section className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[#164A91]">
              4 Core Support Areas
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1E36] tracking-tight">
              Daily Nutrition Made Simple
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600">
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Clock className="w-3.5 h-3.5 text-[#164A91]" aria-hidden="true" />
              {PRODUCT_USAGE_SPECS.dosage}
            </span>
            <span className="inline-flex items-center gap-1.5 font-medium">
              <Users className="w-3.5 h-3.5 text-[#F5A623]" aria-hidden="true" />
              Ages 2+ to Adults
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {SUPPORT_PILLARS.map((pillar) => (
            <article
              key={pillar.id}
              className="rounded-2xl bg-white p-5 border border-slate-200/90 shadow-2xs flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <span className="font-mono text-xs font-bold text-[#164A91]">
                    SUPPORT {pillar.indexLabel}
                  </span>
                  <span className="w-2.5 h-2.5 rounded-sm bg-[#F5A623]" aria-hidden="true" />
                </div>
                <h3 className="mt-3 font-display font-bold text-base text-[#0F1E36]">
                  {pillar.title}
                </h3>
                <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {pillar.summary}
                </p>
              </div>
              <p className="mt-4 pt-3 border-t border-slate-100 text-[11px] font-semibold text-[#164A91]">
                {pillar.keyNutrients}
              </p>
            </article>
          ))}
        </div>
      </section>

      {/* 4. Featured Package Cards */}
      <section id="home-featured-packages" className="scroll-mt-16 space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold tracking-wider uppercase text-[#164A91]">
              Featured Packages
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1E36] tracking-tight">
              Pick Your IQMAX+ Bundle
            </h2>
          </div>
          <button
            type="button"
            onClick={onGoToShop}
            className="text-xs sm:text-sm font-display font-bold text-[#164A91] hover:underline inline-flex items-center gap-1 cursor-pointer shrink-0"
          >
            <span>Open Full Shop</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
          {PRODUCT_PACKAGES.map((pkg) => {
            const isAdded = justAddedId === pkg.id;
            return (
              <article
                key={pkg.id}
                data-testid={`home-package-card-${pkg.id}`}
                className={`rounded-3xl bg-white border flex flex-col justify-between overflow-hidden transition-shadow ${
                  pkg.featured
                    ? 'border-[#164A91] shadow-md ring-1 ring-[#164A91]/15'
                    : 'border-slate-200 shadow-2xs hover:shadow-md'
                }`}
              >
                <div>
                  <div
                    className={`px-5 py-2.5 flex items-center justify-between text-xs font-bold ${
                      pkg.featured
                        ? 'bg-[#164A91] text-white'
                        : 'bg-[#EBF2FC] text-[#164A91]'
                    }`}
                  >
                    <span className="font-mono flex items-center gap-1.5">
                      {pkg.featured && <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" />}
                      {pkg.code}
                    </span>
                    <span className="font-mono tabular-nums">
                      {pkg.totalBottles} {pkg.totalBottles === 1 ? 'Bottle' : 'Bottles'}
                    </span>
                  </div>

                  <div className="p-5 pb-3 border-b border-slate-100">
                    {pkg.freeBadgeText ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-[#F5A623] text-[#0F1E36] font-display font-extrabold text-[11px] mb-3">
                        <Gift className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{pkg.freeBadgeText}</span>
                      </span>
                    ) : (
                      <span className="inline-flex items-center px-2.5 py-1 rounded-lg bg-slate-100 text-slate-600 font-display font-semibold text-[11px] mb-3">
                        {pkg.badgeText}
                      </span>
                    )}

                    <div className="aspect-[16/10] w-full flex items-center justify-center bg-white">
                      <img
                        src={pkg.imageSrc}
                        alt={pkg.imageAlt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-[#0F1E36]">
                        {pkg.name}
                      </h3>
                      <p className="text-xs font-medium text-[#164A91] mt-0.5">{pkg.subtitle}</p>
                    </div>

                    <div className="flex items-baseline justify-between gap-2 pt-2 border-t border-slate-100">
                      <div className="flex flex-wrap items-baseline gap-2">
                        <span className="font-mono text-xl sm:text-2xl font-extrabold text-[#164A91] tabular-nums whitespace-nowrap">
                          {formatCurrency(pkg.unitPrice)}
                        </span>
                        {pkg.compareAtPrice && (
                          <span className="font-mono text-xs text-slate-400 line-through tabular-nums whitespace-nowrap">
                            {formatCurrency(pkg.compareAtPrice)}
                          </span>
                        )}
                      </div>
                      <span className="font-mono text-xs text-slate-500 tabular-nums whitespace-nowrap shrink-0">
                        {pkg.totalTablets} tablets
                      </span>
                    </div>

                    <ul className="space-y-1.5 text-xs text-slate-600">
                      {pkg.highlights.slice(0, 2).map((h) => (
                        <li key={h} className="flex items-start gap-2">
                          <Check className="w-3.5 h-3.5 text-[#F5A623] shrink-0 mt-0.5" />
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="px-5 pb-5 grid grid-cols-5 gap-2">
                  <button
                    type="button"
                    onClick={() => handleQuickAdd(pkg)}
                    data-testid={`home-add-${pkg.id}`}
                    className="col-span-3 py-3 px-3 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-xs tracking-wide transition-colors cursor-pointer flex items-center justify-center gap-1.5 min-h-[44px]"
                  >
                    <ShoppingBag className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>{isAdded ? 'ADDED' : 'PILIH PAKEJ'}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onViewPackageDetails(pkg)}
                    className="col-span-2 py-3 px-2 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#164A91] font-display font-semibold text-xs transition-colors cursor-pointer flex items-center justify-center gap-1 min-h-[44px]"
                  >
                    <Eye className="w-3.5 h-3.5 shrink-0" aria-hidden="true" />
                    <span>Details</span>
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 5. Authentic Testimonials ("Apa Kata Mereka Tentang IQMAX+?") */}
      <TestimonialsSection />

      {/* 6. FAQ Preview */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-7 space-y-4">
        <div className="space-y-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#164A91]">
            Quick Answers
          </p>
          <h2 className="font-display font-extrabold text-2xl text-[#0F1E36]">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="divide-y divide-slate-200 rounded-2xl border border-slate-200 overflow-hidden">
          {FAQ_ITEMS.slice(0, 5).map((item) => {
            const isOpen = openFaqId === item.id;
            return (
              <div key={item.id}>
                <button
                  type="button"
                  onClick={() => setOpenFaqId((curr) => (curr === item.id ? null : item.id))}
                  aria-expanded={isOpen}
                  className="w-full px-5 py-3.5 text-left flex items-center justify-between gap-4 hover:bg-slate-50 transition-colors cursor-pointer min-h-[52px]"
                >
                  <span className="font-display font-bold text-sm text-[#0F1E36]">
                    {item.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-[#164A91] shrink-0 transition-transform ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-[11px] text-slate-500 leading-relaxed pt-1">{STORE_CONFIG.disclaimer}</p>
      </section>
    </div>
  );
}
