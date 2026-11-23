import { Check, Eye, Gift, Minus, Plus, ShoppingBag, Sparkles, Truck } from 'lucide-react';
import { useState } from 'react';
import { INGREDIENTS, PRODUCT_PACKAGES, SHIPPING_RATES } from '../config/storeConfig';
import type { IngredientItem, ProductPackage } from '../types/store';
import { clampQuantity, formatCurrency } from '../utils/storeLogic';
import { IngredientVisual } from './IngredientVisual';
import { ProductDetailsSection } from './ProductDetailsSection';

type CategoryFilter = 'All' | IngredientItem['category'];

const FILTER_OPTIONS: CategoryFilter[] = [
  'All',
  'Cognitive & Calm',
  'Gut & Pre-Probiotic',
  'Vitamins & Minerals',
  'Natural Fruit & Base',
];

interface ShopTabProps {
  onAddToCart: (packageId: ProductPackage['id'], quantity: number) => void;
  onViewPackageDetails: (pkg: ProductPackage) => void;
}

export function ShopTab({ onAddToCart, onViewPackageDetails }: ShopTabProps) {
  const [quantities, setQuantities] = useState<Record<ProductPackage['id'], number>>({
    'package-1': 1,
    'package-2': 1,
    'package-3': 1,
  });
  const [justAddedId, setJustAddedId] = useState<ProductPackage['id'] | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryFilter>('All');

  const handleQtyChange = (id: ProductPackage['id'], delta: number) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: clampQuantity((prev[id] ?? 1) + delta),
    }));
  };

  const handleAdd = (pkg: ProductPackage) => {
    const qty = quantities[pkg.id] ?? 1;
    onAddToCart(pkg.id, qty);
    setJustAddedId(pkg.id);
    window.setTimeout(() => {
      setJustAddedId((curr) => (curr === pkg.id ? null : curr));
    }, 1300);
  };

  const filteredIngredients =
    selectedCategory === 'All'
      ? INGREDIENTS
      : INGREDIENTS.filter((item) => item.category === selectedCategory);

  const scrollToPackages = () => {
    const el = document.getElementById('shop-packages-grid');
    el?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  return (
    <div className="space-y-8 sm:space-y-10">
      {/* 1. Shop Header & Shipping Matrix Strip */}
      <section className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#164A91]">
              YouEdu IQMAX+ Store
            </p>
            <h1 className="font-display font-extrabold text-2xl sm:text-4xl text-[#0F1E36] tracking-tight">
              Choose Your Package
            </h1>
            <p className="text-sm text-slate-600 max-w-2xl">
              Every bottle contains 30 chewable Mixfruit tablets (400mg). Select Package 2 (3
              bottles total) or Package 3 (5 bottles total) for complimentary free bottles.
            </p>
          </div>

          <div className="rounded-2xl bg-white border border-slate-200 px-4 py-3 flex items-start gap-2.5 text-xs shrink-0">
            <Truck className="w-4 h-4 text-[#164A91] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-0.5">
              <p className="font-display font-bold text-[#0F1E36]">Shipping Fee (Per Order)</p>
              <p className="text-slate-600 tabular-nums">
                Peninsular: Transfer RM {SHIPPING_RATES.semenanjung.online_transfer} · COD RM{' '}
                {SHIPPING_RATES.semenanjung.cod}
              </p>
              <p className="text-slate-600 tabular-nums">
                Sabah / Sarawak: Transfer RM {SHIPPING_RATES.sabah_sarawak.online_transfer} · COD RM{' '}
                {SHIPPING_RATES.sabah_sarawak.cod}
              </p>
            </div>
          </div>
        </div>

        {/* Interactive Package Grid */}
        <div
          id="shop-packages-grid"
          className="scroll-mt-20 grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch"
        >
          {PRODUCT_PACKAGES.map((pkg) => {
            const qty = quantities[pkg.id] ?? 1;
            const isAdded = justAddedId === pkg.id;
            const lineSubtotal = pkg.unitPrice * qty;
            const totalLineBottles = pkg.totalBottles * qty;

            return (
              <article
                key={pkg.id}
                data-testid={`package-card-${pkg.id}`}
                className={`rounded-3xl bg-white border transition-all duration-200 flex flex-col justify-between overflow-hidden ${
                  pkg.featured
                    ? 'border-[#164A91] shadow-lg ring-1 ring-[#164A91]/20'
                    : 'border-slate-200 hover:border-[#164A91]/50 shadow-xs hover:shadow-md'
                }`}
              >
                <div>
                  <div
                    className={`px-5 py-3 flex items-center justify-between gap-2 text-xs font-bold tracking-wide ${
                      pkg.featured
                        ? 'bg-[#164A91] text-white'
                        : 'bg-[#EBF2FC]/80 text-[#164A91]'
                    }`}
                  >
                    <span className="font-mono flex items-center gap-1.5">
                      {pkg.featured && (
                        <Sparkles className="w-3.5 h-3.5 text-[#F5A623]" aria-hidden="true" />
                      )}
                      {pkg.code} · {pkg.badgeText}
                    </span>
                    <span className="font-mono tabular-nums">
                      {pkg.totalBottles} {pkg.totalBottles === 1 ? 'Bottle' : 'Bottles'} Total
                    </span>
                  </div>

                  {/* Product Photography Frame */}
                  <div className="relative bg-white px-5 pt-5 pb-4 border-b border-slate-100">
                    {pkg.freeBadgeText ? (
                      <div
                        data-testid={`free-label-${pkg.id}`}
                        className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5A623] text-[#0F1E36] font-display font-extrabold text-xs tracking-wide shadow-2xs mb-3"
                      >
                        <Gift className="w-3.5 h-3.5" aria-hidden="true" />
                        <span>{pkg.freeBadgeText}</span>
                      </div>
                    ) : (
                      <div className="inline-flex items-center px-3 py-1 rounded-lg bg-slate-100 text-slate-600 font-display font-semibold text-xs mb-3">
                        Single Starter Bottle · 30 Tablets
                      </div>
                    )}

                    <div className="aspect-[16/10] w-full flex items-center justify-center bg-white">
                      <img
                        src={pkg.imageSrc}
                        alt={pkg.imageAlt}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain transition-transform duration-300 hover:scale-[1.02]"
                      />
                    </div>
                  </div>

                  {/* Package Pricing & Details */}
                  <div className="p-5 sm:p-6 space-y-4">
                    <div>
                      <h2 className="font-display font-extrabold text-xl text-[#0F1E36]">
                        {pkg.name}
                      </h2>
                      <p className="mt-1 text-sm font-medium text-[#164A91]">{pkg.subtitle}</p>
                    </div>

                    <div className="py-3 border-y border-slate-100 flex items-end justify-between gap-2">
                      <div className="min-w-0">
                        <span className="block text-xs text-slate-500">Package Price</span>
                        <div className="flex flex-wrap items-baseline gap-2 mt-0.5">
                          <span
                            data-testid={`price-${pkg.id}`}
                            className="font-mono text-2xl sm:text-3xl font-extrabold text-[#164A91] tabular-nums whitespace-nowrap"
                          >
                            {formatCurrency(pkg.unitPrice)}
                          </span>
                          {pkg.compareAtPrice && (
                            <span className="font-mono text-xs text-slate-400 line-through tabular-nums whitespace-nowrap">
                              {formatCurrency(pkg.compareAtPrice)}
                            </span>
                          )}
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="block text-[11px] text-slate-500">Total Supply</span>
                        <span className="font-mono text-xs font-bold text-[#0F1E36] tabular-nums whitespace-nowrap">
                          {pkg.totalTablets} tablets
                        </span>
                      </div>
                    </div>

                    <ul className="space-y-2 text-sm text-slate-700">
                      {pkg.highlights.map((bullet) => (
                        <li key={bullet} className="flex items-start gap-2.5">
                          <Check
                            className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5"
                            aria-hidden="true"
                          />
                          <span>{bullet}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Quantity & PILIH PAKEJ Controls */}
                <div className="px-5 sm:px-6 pb-6 pt-2 space-y-3">
                  <div className="flex items-center justify-between bg-[#F6F8FB] rounded-xl border border-slate-200 px-3.5 py-2.5">
                    <div>
                      <span className="block text-[11px] font-semibold text-slate-500">
                        Package Qty
                      </span>
                      <span className="font-mono text-xs font-bold text-[#164A91] tabular-nums">
                        {formatCurrency(lineSubtotal)} ({totalLineBottles}{' '}
                        {totalLineBottles === 1 ? 'bottle' : 'bottles'})
                      </span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleQtyChange(pkg.id, -1)}
                        disabled={qty <= 1}
                        aria-label={`Decrease quantity for ${pkg.name}`}
                        data-testid={`pkg-dec-${pkg.id}`}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                      <span
                        data-testid={`qty-value-${pkg.id}`}
                        className="w-7 text-center font-mono text-sm font-bold text-[#0F1E36] tabular-nums"
                      >
                        {qty}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleQtyChange(pkg.id, 1)}
                        disabled={qty >= 20}
                        aria-label={`Increase quantity for ${pkg.name}`}
                        data-testid={`pkg-inc-${pkg.id}`}
                        className="w-8 h-8 rounded-lg bg-white border border-slate-200 flex items-center justify-center text-slate-700 hover:bg-slate-100 disabled:opacity-40 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" aria-hidden="true" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-5 gap-2.5">
                    <button
                      type="button"
                      onClick={() => handleAdd(pkg)}
                      data-testid={`add-to-cart-${pkg.id}`}
                      className="col-span-3 inline-flex items-center justify-center gap-2 px-4 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm tracking-wide transition-colors cursor-pointer min-h-[46px]"
                    >
                      <ShoppingBag className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>{isAdded ? 'ADDED' : 'PILIH PAKEJ'}</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => onViewPackageDetails(pkg)}
                      data-testid={`view-details-${pkg.id}`}
                      className="col-span-2 inline-flex items-center justify-center gap-1.5 px-3 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#164A91] font-display font-semibold text-sm transition-colors cursor-pointer min-h-[46px]"
                    >
                      <Eye className="w-4 h-4 shrink-0" aria-hidden="true" />
                      <span>Details</span>
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      {/* 2. Key Formulation & Filterable Ingredients */}
      <section className="rounded-3xl bg-white border border-slate-200/80 p-5 sm:p-8 space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-1.5">
            <p className="text-xs font-semibold tracking-wider uppercase text-[#164A91]">
              Key Formulation
            </p>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1E36]">
              Ten Purposeful Ingredients
            </h2>
            <p className="text-sm text-slate-600 max-w-xl">
              Filter by nutritional role to see what goes into every 400mg Mixfruit chewable tablet.
            </p>
          </div>

          <div
            role="tablist"
            aria-label="Filter ingredients by category"
            className="flex flex-wrap items-center gap-1.5 p-1.5 bg-[#F6F8FB] rounded-xl border border-slate-200"
          >
            {FILTER_OPTIONS.map((category) => {
              const active = selectedCategory === category;
              return (
                <button
                  key={category}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-3 py-2 rounded-lg text-xs font-semibold transition-colors whitespace-nowrap cursor-pointer ${
                    active
                      ? 'bg-[#164A91] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#164A91] hover:bg-white'
                  }`}
                >
                  {category}
                </button>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {filteredIngredients.map((ingredient) => (
            <article
              key={ingredient.id}
              className="rounded-2xl bg-[#F6F8FB] p-4 sm:p-5 border border-slate-200/80 flex flex-col justify-between"
            >
              <div>
                <IngredientVisual iconKey={ingredient.iconKey} />
                <p className="mt-3 text-[11px] font-semibold text-[#164A91]">
                  {ingredient.category}
                </p>
                <h3 className="mt-0.5 font-display font-bold text-sm text-[#0F1E36]">
                  {ingredient.name}
                </h3>
                <p className="mt-2 text-xs text-slate-600 leading-relaxed">
                  {ingredient.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* 3. Authentic Product Gallery & Usage Specifications */}
      <div className="rounded-3xl overflow-hidden border border-slate-200/80">
        <ProductDetailsSection onSelectPackages={scrollToPackages} />
      </div>
    </div>
  );
}
