import { ArrowRight, Minus, Plus, ShoppingBag, Trash2, X } from 'lucide-react';
import { useEffect } from 'react';
import type { CartSummary, PaymentMethod, ProductPackage, ShippingRegion } from '../types/store';
import { formatCurrency } from '../utils/storeLogic';

interface CartDrawerProps {
  isOpen: boolean;
  summary: CartSummary;
  shippingRegion: ShippingRegion;
  paymentMethod: PaymentMethod;
  onChangeRegion: (region: ShippingRegion) => void;
  onChangePaymentMethod: (method: PaymentMethod) => void;
  onClose: () => void;
  onUpdateQuantity: (packageId: ProductPackage['id'], quantity: number) => void;
  onRemoveItem: (packageId: ProductPackage['id']) => void;
  onProceedToCheckout: () => void;
}

export function CartDrawer({
  isOpen,
  summary,
  shippingRegion,
  paymentMethod,
  onChangeRegion,
  onChangePaymentMethod,
  onClose,
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
}: CartDrawerProps) {
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-slate-900/50 backdrop-blur-xs"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Shopping Cart"
    >
      <div
        className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#164A91]" aria-hidden="true" />
            <h2 className="font-display font-bold text-lg text-[#0F1E36]">
              Your Cart ({summary.totalItems})
            </h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close shopping cart"
            className="w-10 h-10 rounded-lg border border-slate-200 flex items-center justify-center text-slate-600 hover:bg-slate-100 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {summary.lines.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
              <div className="w-14 h-14 rounded-2xl bg-[#EBF2FC] flex items-center justify-center text-[#164A91]">
                <ShoppingBag className="w-7 h-7" aria-hidden="true" />
              </div>
              <div className="space-y-1">
                <p className="font-display font-bold text-base text-[#0F1E36]">
                  Your cart is currently empty
                </p>
                <p className="text-sm text-slate-500 max-w-xs">
                  Select Package 1 (RM 59), Package 2 (RM 100), or Package 3 (RM 150) to begin your
                  order.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="px-5 py-2.5 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-semibold text-sm transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          ) : (
            <ul className="space-y-4">
              {summary.lines.map((line) => (
                <li
                  key={line.pkg.id}
                  data-testid={`cart-item-${line.pkg.id}`}
                  className="rounded-xl border border-slate-200 p-4 bg-[#F6F8FB] space-y-3"
                >
                  <div className="flex items-start gap-3.5">
                    <div className="w-16 h-16 rounded-lg bg-white border border-slate-200 p-1.5 shrink-0 flex items-center justify-center">
                      <img
                        src={line.pkg.imageSrc}
                        alt={line.pkg.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-contain"
                      />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <p className="font-mono text-[11px] font-semibold text-[#164A91]">
                            {line.pkg.code}
                          </p>
                          <h3 className="font-display font-bold text-sm text-[#0F1E36]">
                            {line.pkg.name}
                          </h3>
                        </div>
                        <button
                          type="button"
                          onClick={() => onRemoveItem(line.pkg.id)}
                          aria-label={`Remove ${line.pkg.name}`}
                          data-testid={`remove-item-${line.pkg.id}`}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-red-600 hover:bg-white transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-4 h-4" aria-hidden="true" />
                        </button>
                      </div>

                      <p className="mt-1 text-xs text-slate-600 tabular-nums">
                        {line.totalBottles} {line.totalBottles === 1 ? 'Bottle' : 'Bottles'} Total
                        {line.totalFreeBottles > 0 &&
                          ` (${line.totalPaidBottles} + ${line.totalFreeBottles} FREE)`}{' '}
                        · {line.totalTablets} Tablets
                      </p>
                    </div>
                  </div>

                  <div className="pt-2.5 border-t border-slate-200/80 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-1.5 bg-white rounded-lg border border-slate-200 p-1">
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(line.pkg.id, line.quantity - 1)}
                        aria-label={`Decrease ${line.pkg.name} quantity`}
                        data-testid={`cart-dec-${line.pkg.id}`}
                        className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-700 cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span
                        data-testid={`cart-qty-${line.pkg.id}`}
                        className="w-7 text-center font-mono text-xs font-bold text-[#0F1E36] tabular-nums"
                      >
                        {line.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => onUpdateQuantity(line.pkg.id, line.quantity + 1)}
                        disabled={line.quantity >= 20}
                        aria-label={`Increase ${line.pkg.name} quantity`}
                        data-testid={`cart-inc-${line.pkg.id}`}
                        className="w-7 h-7 rounded-md hover:bg-slate-100 flex items-center justify-center text-slate-700 disabled:opacity-40 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-right">
                      <span className="block text-[11px] text-slate-500">
                        {formatCurrency(line.pkg.unitPrice)} &times; {line.quantity}
                      </span>
                      <span className="font-mono text-sm font-bold text-[#164A91] tabular-nums">
                        {line.formattedLineTotal}
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer with Quick Region & Payment Shipping Preview */}
        {summary.lines.length > 0 && (
          <div className="p-6 border-t border-slate-200 bg-[#F6F8FB] space-y-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <label htmlFor="cart-region" className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Shipping Region
                </label>
                <select
                  id="cart-region"
                  value={shippingRegion}
                  onChange={(e) => onChangeRegion(e.target.value as ShippingRegion)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#0F1E36]"
                >
                  <option value="semenanjung">Peninsular Malaysia</option>
                  <option value="sabah_sarawak">Sabah / Sarawak</option>
                </select>
              </div>
              <div>
                <label htmlFor="cart-payment" className="block text-[11px] font-semibold text-slate-500 mb-1">
                  Payment Method
                </label>
                <select
                  id="cart-payment"
                  value={paymentMethod}
                  onChange={(e) => onChangePaymentMethod(e.target.value as PaymentMethod)}
                  className="w-full px-2.5 py-2 rounded-lg border border-slate-300 bg-white text-xs font-medium text-[#0F1E36]"
                >
                  <option value="online_transfer">Online Bank Transfer</option>
                  <option value="cod">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Total Bottles</span>
                <span className="font-mono font-semibold text-[#0F1E36] tabular-nums">
                  {summary.totalBottles} ({summary.totalTablets} Tablets)
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Product Subtotal</span>
                <span
                  data-testid="cart-subtotal"
                  className="font-mono font-semibold text-[#0F1E36] tabular-nums"
                >
                  {summary.formattedSubtotal}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping Fee (1&times; per order)</span>
                <span
                  data-testid="cart-shipping"
                  className="font-mono font-semibold text-[#0F1E36] tabular-nums"
                >
                  {summary.formattedShippingFee}
                </span>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-slate-200 text-base font-bold text-[#0F1E36]">
                <span>Estimated Total</span>
                <span data-testid="cart-total" className="font-mono text-[#164A91] tabular-nums">
                  {summary.formattedGrandTotal}
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-2.5">
              <button
                type="button"
                onClick={onProceedToCheckout}
                data-testid="proceed-to-checkout"
                className="w-full inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm transition-colors cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A91]"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" aria-hidden="true" />
              </button>

              <button
                type="button"
                onClick={onClose}
                className="w-full py-2.5 px-4 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-display font-semibold text-sm transition-colors cursor-pointer"
              >
                Continue Shopping
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
