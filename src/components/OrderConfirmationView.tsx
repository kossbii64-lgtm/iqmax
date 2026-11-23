import { CheckCircle2, FileText, Home, ShoppingBag, User } from 'lucide-react';
import type { OrderRecord } from '../types/store';
import { formatCurrency } from '../utils/storeLogic';
import { BrandLogo } from './BrandLogo';

interface OrderConfirmationViewProps {
  receipt: OrderRecord;
  onBackToHome: () => void;
  onContinueShopping: () => void;
  onViewDashboard?: () => void;
}

export function OrderConfirmationView({
  receipt,
  onBackToHome,
  onContinueShopping,
  onViewDashboard,
}: OrderConfirmationViewProps) {
  const formattedTime = new Date(receipt.createdAtIso).toLocaleString();
  const isTransfer = receipt.paymentMethod === 'online_transfer';

  return (
    <main className="flex-1 py-8 sm:py-12 bg-[#F6F8FB]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        {/* Confirmation Banner */}
        <div
          data-testid="order-confirmation-banner"
          className="rounded-3xl bg-[#164A91] text-white p-6 sm:p-8 shadow-md space-y-4"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <BrandLogo variant="light" size="sm" />
            <div className="flex items-center gap-2">
              <span
                data-testid="demo-order-badge"
                className="px-2.5 py-1 rounded-lg bg-[#F5A623] text-[#0F1E36] font-mono text-[11px] font-extrabold tracking-wide"
              >
                DEMO ORDER
              </span>
              <span className="font-mono text-xs text-blue-100 tabular-nums">{formattedTime}</span>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <CheckCircle2 className="w-7 h-7 text-[#F5A623] shrink-0 mt-0.5" aria-hidden="true" />
            <div className="space-y-1">
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl tracking-tight">
                Demo Order Recorded Successfully
              </h1>
              <p className="text-sm text-blue-100 leading-relaxed">
                {isTransfer
                  ? 'Your simulated Online Bank Transfer receipt has been saved locally. Payment status is PENDING VERIFICATION (DEMO).'
                  : 'Your simulated Cash on Delivery (COD) order has been saved locally. Payment is collected upon delivery (DEMO).'}
              </p>
            </div>
          </div>

          <div className="pt-3 border-t border-white/15 flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-baseline gap-2">
              <span className="text-xs text-blue-200">Order Reference:</span>
              <span
                data-testid="order-reference-number"
                className="font-mono text-lg font-extrabold text-[#F5A623] tabular-nums"
              >
                {receipt.reference}
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
              <span
                data-testid="confirmation-payment-status"
                className="px-3 py-1 rounded-lg bg-white/15 text-white font-bold"
              >
                {receipt.paymentStatus}
              </span>
              <span
                data-testid="confirmation-order-status"
                className="px-3 py-1 rounded-lg bg-[#F5A623] text-[#0F1E36] font-extrabold"
              >
                {receipt.orderStatus}
              </span>
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Customer & Delivery Details */}
          <section className="rounded-3xl bg-white p-6 border border-slate-200 space-y-4">
            <h2 className="font-display font-bold text-lg text-[#0F1E36] pb-3 border-b border-slate-100">
              Customer &amp; Delivery Details
            </h2>
            <dl className="space-y-2.5 text-sm">
              <div>
                <dt className="text-xs text-slate-500">Full Name</dt>
                <dd className="font-semibold text-[#0F1E36]">{receipt.customerName}</dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Phone &amp; Email</dt>
                <dd className="text-[#0F1E36]">
                  <span className="font-mono tabular-nums">{receipt.customerPhone}</span> ·{' '}
                  {receipt.customerEmail}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Delivery Address</dt>
                <dd className="text-[#0F1E36] leading-relaxed">
                  {receipt.address}, {receipt.postcode} {receipt.city}, {receipt.state}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-slate-500">Shipping Region &amp; Payment</dt>
                <dd className="font-semibold text-[#164A91]">
                  {receipt.shippingRegion === 'sabah_sarawak'
                    ? 'Sabah / Sarawak'
                    : 'Peninsular Malaysia'}{' '}
                  · {isTransfer ? 'Online Bank Transfer' : 'Cash on Delivery (COD)'}
                </dd>
              </div>

              {isTransfer && receipt.hasReceipt && (
                <div className="pt-2">
                  <dt className="text-xs text-slate-500 mb-1">Uploaded Receipt</dt>
                  <dd className="flex items-center gap-2 rounded-xl bg-[#F6F8FB] p-2.5 border border-slate-200 text-xs font-medium text-[#0F1E36]">
                    <FileText className="w-4 h-4 text-[#164A91] shrink-0" />
                    <span className="truncate">{receipt.receiptFileName}</span>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* Package Breakdown & Final Total */}
          <section className="rounded-3xl bg-white p-6 border border-slate-200 flex flex-col justify-between space-y-4">
            <div>
              <h2 className="font-display font-bold text-lg text-[#0F1E36] pb-3 border-b border-slate-100">
                Packages &amp; Bottle Breakdown
              </h2>

              <ul className="divide-y divide-slate-100 mt-2">
                {receipt.items.map((item) => (
                  <li key={item.packageId} className="py-3 flex items-start justify-between gap-3">
                    <div>
                      <p className="font-mono text-[11px] font-semibold text-[#164A91]">
                        {item.packageCode}
                      </p>
                      <p className="font-display font-bold text-sm text-[#0F1E36]">
                        {item.packageName}
                      </p>
                      <p className="text-xs text-slate-500 tabular-nums">
                        Qty: {item.quantity} · {item.totalBottles} Bottles Total
                        {item.freeBottles > 0 &&
                          ` (${item.paidBottles} + ${item.freeBottles} FREE)`}{' '}
                        · {item.totalTablets} Tablets
                      </p>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#164A91] tabular-nums whitespace-nowrap shrink-0">
                      {formatCurrency(item.lineSubtotal)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="pt-4 border-t border-slate-200 space-y-2 text-sm">
              <div className="flex items-center justify-between text-slate-600">
                <span>Product Subtotal</span>
                <span className="font-mono font-semibold text-[#0F1E36] tabular-nums">
                  {formatCurrency(receipt.subtotal)}
                </span>
              </div>
              <div className="flex items-center justify-between text-slate-600">
                <span>Shipping Fee</span>
                <span className="font-mono font-semibold text-[#0F1E36] tabular-nums">
                  {formatCurrency(receipt.shippingFee)}
                </span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex items-center justify-between text-base font-bold text-[#0F1E36]">
                <span>Final Amount</span>
                <span
                  data-testid="confirmation-grand-total"
                  className="font-mono text-xl font-extrabold text-[#164A91] tabular-nums"
                >
                  {formatCurrency(receipt.grandTotal)}
                </span>
              </div>
            </div>
          </section>
        </div>

        {/* Navigation Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
          <button
            type="button"
            onClick={onBackToHome}
            data-testid="confirmation-back-home"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-200 text-[#164A91] font-display font-bold text-sm transition-colors cursor-pointer"
          >
            <Home className="w-4 h-4" aria-hidden="true" />
            <span>Back to Home</span>
          </button>

          <button
            type="button"
            onClick={onContinueShopping}
            data-testid="confirmation-continue-shopping"
            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-sm transition-colors cursor-pointer"
          >
            <ShoppingBag className="w-4 h-4" aria-hidden="true" />
            <span>Continue Shopping</span>
          </button>

          {onViewDashboard && (
            <button
              type="button"
              onClick={onViewDashboard}
              data-testid="confirmation-view-orders"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-sm transition-colors cursor-pointer"
            >
              <User className="w-4 h-4" aria-hidden="true" />
              <span>View My Orders</span>
            </button>
          )}
        </div>
      </div>
    </main>
  );
}
