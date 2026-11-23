import { Check, Gift, Minus, Plus, ShoppingBag, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PRODUCT_USAGE_SPECS, STORE_CONFIG } from '../config/storeConfig';
import type { ProductPackage } from '../types/store';
import { clampQuantity, formatCurrency } from '../utils/storeLogic';

interface PackageDetailModalProps {
  pkg: ProductPackage | null;
  onClose: () => void;
  onAddToCart: (packageId: ProductPackage['id'], quantity: number) => void;
}

export function PackageDetailModal({ pkg, onClose, onAddToCart }: PackageDetailModalProps) {
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setQuantity(1);
  }, [pkg?.id]);

  useEffect(() => {
    if (!pkg) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [pkg, onClose]);

  if (!pkg) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="package-modal-title"
    >
      <div
        className="relative w-full max-w-2xl rounded-2xl bg-white shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold text-[#164A91]">{pkg.code}</p>
            <h3 id="package-modal-title" className="font-display font-bold text-xl text-[#0F1E36]">
              YouEdu IQMAX+ — {pkg.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close package details"
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 items-center">
            <div className="rounded-xl bg-white p-4 border border-slate-200 aspect-[4/3] flex items-center justify-center">
              <img
                src={pkg.imageSrc}
                alt={pkg.imageAlt}
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-3">
              {pkg.freeBottles > 0 && (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#F5A623] text-[#0F1E36] font-display font-extrabold text-xs">
                  <Gift className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>
                    {pkg.paidBottles} Bottles + {pkg.freeBottles} FREE{' '}
                    {pkg.freeBottles === 1 ? 'Bottle' : 'Bottles'}
                  </span>
                </span>
              )}
              <p className="text-sm text-slate-600">{pkg.audienceNote}</p>
              <div className="py-3 border-y border-slate-100 flex items-baseline justify-between">
                <span className="text-xs text-slate-500">Package Price</span>
                <span className="font-mono text-2xl font-extrabold text-[#164A91] tabular-nums">
                  {formatCurrency(pkg.unitPrice)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-2.5 rounded-lg bg-[#F6F8FB]">
                  <span className="text-slate-500 block">Total Bottles</span>
                  <span className="font-mono font-bold text-sm text-[#0F1E36] tabular-nums">
                    {pkg.totalBottles} {pkg.totalBottles === 1 ? 'Bottle' : 'Bottles'}
                  </span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#F6F8FB]">
                  <span className="text-slate-500 block">Total Tablets</span>
                  <span className="font-mono font-bold text-sm text-[#0F1E36] tabular-nums">
                    {pkg.totalTablets} Tablets
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h4 className="font-display font-bold text-sm text-[#0F1E36]">Package Highlights</h4>
            <ul className="space-y-1.5 text-sm text-slate-600">
              {pkg.highlights.map((item) => (
                <li key={item} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#F5A623] shrink-0 mt-0.5" aria-hidden="true" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-xl bg-[#F6F8FB] p-4 border border-slate-200 text-xs text-slate-600 space-y-1">
            <p className="font-semibold text-[#0F1E36]">Consumption Guide</p>
            <p>
              {PRODUCT_USAGE_SPECS.dosage} ({PRODUCT_USAGE_SPECS.timing}).{' '}
              {PRODUCT_USAGE_SPECS.method}. {PRODUCT_USAGE_SPECS.suitability}.{' '}
              {PRODUCT_USAGE_SPECS.supervision}.
            </p>
            <p className="pt-1 text-slate-500">{STORE_CONFIG.disclaimer}</p>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-slate-200 bg-[#F6F8FB] flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-xl border border-slate-200">
            <span className="text-xs font-semibold text-slate-600">Qty</span>
            <button
              type="button"
              onClick={() => setQuantity((q) => clampQuantity(q - 1))}
              disabled={quantity <= 1}
              aria-label="Decrease modal quantity"
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <Minus className="w-3.5 h-3.5" />
            </button>
            <span className="w-7 text-center font-mono text-sm font-bold tabular-nums">
              {quantity}
            </span>
            <button
              type="button"
              onClick={() => setQuantity((q) => clampQuantity(q + 1))}
              disabled={quantity >= 20}
              aria-label="Increase modal quantity"
              className="w-8 h-8 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            type="button"
            onClick={() => {
              onAddToCart(pkg.id, quantity);
              onClose();
            }}
            className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>
              PILIH PAKEJ ({formatCurrency(pkg.unitPrice * quantity)})
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
