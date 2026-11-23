import { ArrowRight, ChevronDown, PackageCheck, RefreshCw, ShoppingBag } from 'lucide-react';
import { useState } from 'react';
import type { OrderRecord, OrderStatus } from '../types/store';
import { formatCurrency, getNextDemoOrderStatus } from '../utils/storeLogic';

interface OrdersTabProps {
  orders: OrderRecord[];
  onGoToShop: () => void;
  onAdvanceOrderStatus: (orderId: string, nextStatus: OrderStatus) => void;
}

const STATUS_BADGE_MAP: Record<string, string> = {
  'Order Received (DEMO)': 'bg-[#EBF2FC] text-[#164A91] border-[#164A91]/20',
  'Pending Verification (DEMO)': 'bg-amber-50 text-amber-800 border-amber-200',
  'Processing (DEMO)': 'bg-blue-50 text-blue-800 border-blue-200',
  'Shipped (DEMO)': 'bg-indigo-50 text-indigo-800 border-indigo-200',
  'Delivered (DEMO)': 'bg-emerald-50 text-emerald-800 border-emerald-200',
  'Cancelled (DEMO)': 'bg-red-50 text-red-700 border-red-200',
};

export function OrdersTab({ orders, onGoToShop, onAdvanceOrderStatus }: OrdersTabProps) {
  const [expandedId, setExpandedId] = useState<string | null>(orders[0]?.orderId ?? null);

  return (
    <div data-testid="orders-tab" className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <p className="text-xs font-semibold uppercase tracking-wider text-[#164A91]">
              Order History
            </p>
            <span className="px-2 py-0.5 rounded bg-[#F5A623]/20 text-[#9A5B00] font-mono text-[10px] font-bold">
              DEMO STORAGE
            </span>
          </div>
          <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1E36]">
            My Orders ({orders.length})
          </h1>
          <p className="text-xs sm:text-sm text-slate-600">
            All orders placed in this prototype are marked <strong>DEMO</strong> and persisted
            locally in browser storage.
          </p>
        </div>

        <button
          type="button"
          onClick={onGoToShop}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] text-[#0F1E36] font-display font-extrabold text-xs sm:text-sm cursor-pointer self-start sm:self-auto"
        >
          <ShoppingBag className="w-4 h-4" aria-hidden="true" />
          <span>New Demo Order</span>
        </button>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-3xl bg-white border border-slate-200 p-8 sm:p-12 text-center space-y-4">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-[#EBF2FC] text-[#164A91] flex items-center justify-center">
            <PackageCheck className="w-7 h-7" aria-hidden="true" />
          </div>
          <div className="space-y-1">
            <h2 className="font-display font-bold text-lg text-[#0F1E36]">No Demo Orders Yet</h2>
            <p className="text-sm text-slate-500 max-w-md mx-auto">
              Visit the Shop tab, choose any IQMAX+ package, and complete simulated checkout to see
              your DEMO orders listed here.
            </p>
          </div>
          <button
            type="button"
            onClick={onGoToShop}
            className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-sm cursor-pointer"
          >
            <span>Browse Packages</span>
            <ArrowRight className="w-4 h-4" aria-hidden="true" />
          </button>
        </div>
      ) : (
        <ul className="space-y-4">
          {orders.map((order) => {
            const isOpen = expandedId === order.orderId;
            const badgeStyle =
              STATUS_BADGE_MAP[order.orderStatus] ??
              'bg-slate-100 text-slate-700 border-slate-200';
            const nextStatus = getNextDemoOrderStatus(order.orderStatus);

            return (
              <li
                key={order.orderId}
                data-testid={`order-card-${order.reference}`}
                className="rounded-2xl bg-white border border-slate-200 shadow-2xs overflow-hidden"
              >
                <button
                  type="button"
                  onClick={() => setExpandedId((curr) => (curr === order.orderId ? null : order.orderId))}
                  aria-expanded={isOpen}
                  className="w-full p-5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-50/70 transition-colors cursor-pointer"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="px-2 py-0.5 rounded bg-[#164A91] text-white font-mono text-[10px] font-bold">
                        DEMO ORDER
                      </span>
                      <span className="font-mono font-bold text-sm text-[#0F1E36]">
                        {order.reference}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 tabular-nums">
                      {new Date(order.createdAtIso).toLocaleString()} · {order.totalBottles}{' '}
                      {order.totalBottles === 1 ? 'Bottle' : 'Bottles'} ({order.totalTablets}{' '}
                      Tablets) ·{' '}
                      {order.paymentMethod === 'cod'
                        ? 'Cash on Delivery (COD)'
                        : 'Online Bank Transfer'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end gap-3">
                    <div className="text-left sm:text-right space-y-1">
                      <span
                        className={`inline-block px-2.5 py-1 rounded-lg border text-[11px] font-mono font-bold ${badgeStyle}`}
                      >
                        {order.orderStatus}
                      </span>
                      <p className="font-mono font-extrabold text-base text-[#164A91] tabular-nums">
                        {formatCurrency(order.grandTotal)}
                      </p>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-slate-400 transition-transform shrink-0 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                      aria-hidden="true"
                    />
                  </div>
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-3 border-t border-slate-100 bg-[#F6F8FB]/70 space-y-4 text-xs sm:text-sm">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="rounded-xl bg-white p-4 border border-slate-200 space-y-1.5">
                        <p className="font-display font-bold text-xs uppercase tracking-wider text-[#164A91]">
                          Delivery &amp; Payment (DEMO)
                        </p>
                        <p className="font-semibold text-[#0F1E36]">{order.customerName}</p>
                        <p className="text-xs text-slate-600">
                          {order.customerPhone} · {order.customerEmail}
                        </p>
                        <p className="text-xs text-slate-600 leading-relaxed">
                          {order.address}, {order.postcode} {order.city}, {order.state}
                        </p>
                        <p className="text-xs font-semibold text-[#164A91] pt-1">
                          Region:{' '}
                          {order.shippingRegion === 'sabah_sarawak'
                            ? 'Sabah / Sarawak'
                            : 'Peninsular Malaysia'}{' '}
                          · {order.paymentStatus}
                        </p>
                        {order.hasReceipt && order.receiptFileName && (
                          <p className="text-xs text-emerald-700 font-medium">
                            Attached slip: {order.receiptFileName}
                          </p>
                        )}
                      </div>

                      <div className="rounded-xl bg-white p-4 border border-slate-200 space-y-2">
                        <p className="font-display font-bold text-xs uppercase tracking-wider text-[#164A91]">
                          Package Breakdown
                        </p>
                        <ul className="divide-y divide-slate-100">
                          {order.items.map((item) => (
                            <li
                              key={item.packageId}
                              className="py-2 flex items-start justify-between gap-2 text-xs"
                            >
                              <div>
                                <p className="font-bold text-[#0F1E36]">
                                  {item.packageCode} — {item.packageName}
                                </p>
                                <p className="text-slate-500 tabular-nums">
                                  Qty: {item.quantity} · {item.totalBottles} Bottles (
                                  {item.paidBottles} + {item.freeBottles} FREE) ·{' '}
                                  {item.totalTablets} Tablets
                                </p>
                              </div>
                              <span className="font-mono font-bold text-[#164A91] tabular-nums">
                                {formatCurrency(item.lineSubtotal)}
                              </span>
                            </li>
                          ))}
                        </ul>
                        <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600">
                          <span>
                            Subtotal {formatCurrency(order.subtotal)} + Shipping{' '}
                            {formatCurrency(order.shippingFee)}
                          </span>
                          <span className="font-mono font-extrabold text-[#164A91] tabular-nums">
                            {formatCurrency(order.grandTotal)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {nextStatus && (
                      <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                        <span className="text-xs text-slate-500">
                          Presentation control: preview how order tracking progresses locally.
                        </span>
                        <button
                          type="button"
                          onClick={() => onAdvanceOrderStatus(order.orderId, nextStatus)}
                          data-testid={`advance-status-${order.reference}`}
                          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-xs cursor-pointer"
                        >
                          <RefreshCw className="w-3.5 h-3.5" aria-hidden="true" />
                          <span>Simulate Next Status: {nextStatus}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
