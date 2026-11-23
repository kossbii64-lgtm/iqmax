import { PRODUCT_PACKAGES, SHIPPING_RATES, STORE_CONFIG } from '../config/storeConfig';
import type {
  AuthValidationErrors,
  CartItem,
  CartLineSummary,
  CartSummary,
  CheckoutFormData,
  CheckoutValidationErrors,
  OrderStatus,
  PaymentMethod,
  ProductPackage,
  ShippingRegion,
} from '../types/store';

export const MIN_ITEM_QTY = 1;
export const MAX_ITEM_QTY = 20;

export function clampQuantity(value: number): number {
  if (!Number.isFinite(value) || Number.isNaN(value)) {
    return MIN_ITEM_QTY;
  }
  const rounded = Math.floor(value);
  if (rounded < MIN_ITEM_QTY) return MIN_ITEM_QTY;
  if (rounded > MAX_ITEM_QTY) return MAX_ITEM_QTY;
  return rounded;
}

export function formatCurrency(amount: number): string {
  const safeAmount = Number.isFinite(amount) ? amount : 0;
  return `${STORE_CONFIG.currencyCode} ${safeAmount.toFixed(2)}`;
}

export function inferRegionFromState(stateName: string): ShippingRegion {
  const normalized = stateName.trim().toLowerCase();
  if (normalized === 'sabah' || normalized === 'sarawak' || normalized === 'labuan') {
    return 'sabah_sarawak';
  }
  return 'semenanjung';
}

export function calculateShippingFee(
  region: ShippingRegion,
  paymentMethod: PaymentMethod,
  hasItems: boolean
): number {
  if (!hasItems) return 0;
  return SHIPPING_RATES[region][paymentMethod];
}

export function addItemToCart(
  cart: CartItem[],
  packageId: ProductPackage['id'],
  quantityToAdd: number = 1
): CartItem[] {
  const safeAdd = clampQuantity(quantityToAdd);
  const existing = cart.find((item) => item.packageId === packageId);
  if (existing) {
    return cart.map((item) =>
      item.packageId === packageId
        ? { ...item, quantity: clampQuantity(item.quantity + safeAdd) }
        : item
    );
  }
  return [...cart, { packageId, quantity: safeAdd }];
}

export function updateItemQuantity(
  cart: CartItem[],
  packageId: ProductPackage['id'],
  nextQuantity: number
): CartItem[] {
  if (!Number.isFinite(nextQuantity) || nextQuantity <= 0) {
    return removeItemFromCart(cart, packageId);
  }
  const safeQty = clampQuantity(nextQuantity);
  return cart.map((item) =>
    item.packageId === packageId ? { ...item, quantity: safeQty } : item
  );
}

export function removeItemFromCart(
  cart: CartItem[],
  packageId: ProductPackage['id']
): CartItem[] {
  return cart.filter((item) => item.packageId !== packageId);
}

function migrateLegacyPackageId(rawId: string): ProductPackage['id'] | null {
  switch (rawId) {
    case 'package-1':
    case 'package-a':
      return 'package-1';
    case 'package-2':
    case 'package-b':
      return 'package-2';
    case 'package-3':
    case 'package-c':
      return 'package-3';
    default:
      return null;
  }
}

export function sanitizeStoredCart(raw: unknown): CartItem[] {
  if (!Array.isArray(raw)) return [];
  const merged = new Map<ProductPackage['id'], number>();

  for (const entry of raw) {
    if (
      entry &&
      typeof entry === 'object' &&
      'packageId' in entry &&
      'quantity' in entry &&
      typeof entry.packageId === 'string' &&
      typeof entry.quantity === 'number' &&
      entry.quantity > 0
    ) {
      const migratedId = migrateLegacyPackageId(entry.packageId);
      if (migratedId) {
        const current = merged.get(migratedId) ?? 0;
        merged.set(migratedId, clampQuantity(current + entry.quantity));
      }
    }
  }

  return Array.from(merged.entries()).map(([packageId, quantity]) => ({
    packageId,
    quantity,
  }));
}

export function calculateCartSummary(
  cart: CartItem[],
  shippingRegion: ShippingRegion = 'semenanjung',
  paymentMethod: PaymentMethod = 'online_transfer',
  packages: ProductPackage[] = PRODUCT_PACKAGES
): CartSummary {
  const packageMap = new Map(packages.map((p) => [p.id, p]));
  const lines: CartLineSummary[] = [];

  let totalItems = 0;
  let totalPaidBottles = 0;
  let totalFreeBottles = 0;
  let totalBottles = 0;
  let totalTablets = 0;
  let numericSubtotal = 0;

  for (const item of cart) {
    const pkg = packageMap.get(item.packageId);
    if (!pkg || item.quantity <= 0) continue;

    const quantity = clampQuantity(item.quantity);
    const paid = pkg.paidBottles * quantity;
    const free = pkg.freeBottles * quantity;
    const totalLineBottles = pkg.totalBottles * quantity;
    const lineTablets = pkg.totalTablets * quantity;
    const lineSubtotal = Number((pkg.unitPrice * quantity).toFixed(2));

    totalItems += quantity;
    totalPaidBottles += paid;
    totalFreeBottles += free;
    totalBottles += totalLineBottles;
    totalTablets += lineTablets;
    numericSubtotal += lineSubtotal;

    lines.push({
      pkg,
      quantity,
      totalPaidBottles: paid,
      totalFreeBottles: free,
      totalBottles: totalLineBottles,
      totalTablets: lineTablets,
      lineSubtotal,
      formattedUnitPrice: formatCurrency(pkg.unitPrice),
      formattedLineTotal: formatCurrency(lineSubtotal),
    });
  }

  const subtotal = Number(numericSubtotal.toFixed(2));
  const shippingFee = calculateShippingFee(shippingRegion, paymentMethod, lines.length > 0);
  const grandTotal = lines.length > 0 ? Number((subtotal + shippingFee).toFixed(2)) : 0;

  return {
    lines,
    totalItems,
    totalPaidBottles,
    totalFreeBottles,
    totalBottles,
    totalTablets,
    subtotal,
    shippingFee,
    shippingRegion,
    paymentMethod,
    grandTotal,
    formattedSubtotal: formatCurrency(subtotal),
    formattedShippingFee: formatCurrency(shippingFee),
    formattedGrandTotal: formatCurrency(grandTotal),
  };
}

export function validateCheckoutForm(data: CheckoutFormData): CheckoutValidationErrors {
  const errors: CheckoutValidationErrors = {};

  if (!data.fullName.trim() || data.fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }

  const cleanedPhone = data.phoneNumber.replace(/[\s\-()]/g, '');
  if (!cleanedPhone || !/^\+?\d{8,15}$/.test(cleanedPhone)) {
    errors.phoneNumber = 'Please enter a valid contact phone number (8–15 digits).';
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!data.email.trim() || !emailRegex.test(data.email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }

  if (!data.address.trim() || data.address.trim().length < 8) {
    errors.address = 'Please enter your full street or unit delivery address.';
  }

  if (!data.city.trim() || data.city.trim().length < 2) {
    errors.city = 'Please enter your city.';
  }

  if (!data.state.trim()) {
    errors.state = 'Please select your delivery state.';
  }

  if (!/^\d{5}$/.test(data.postcode.trim())) {
    errors.postcode = 'Please enter a valid 5-digit postcode.';
  }

  if (data.paymentMethod === 'online_transfer' && !data.receiptFileName.trim()) {
    errors.receiptFileName =
      'Please upload your simulated Online Bank Transfer receipt screenshot or PDF.';
  }

  if (!data.acceptedTerms) {
    errors.acceptedTerms = 'Please confirm this DEMO order acknowledgement to proceed.';
  }

  return errors;
}

export function generateOrderIdAndReference(seedTimestamp: number = Date.now()): {
  orderId: string;
  reference: string;
} {
  const dt = new Date(seedTimestamp);
  const ym = `${dt.getFullYear()}${String(dt.getMonth() + 1).padStart(2, '0')}`;
  const seq = (seedTimestamp % 100000).toString().padStart(5, '0');
  const suffix = Math.floor(100 + Math.random() * 900);
  const reference = `DEMO-IQM-${ym}-${seq}${suffix}`;
  return {
    orderId: reference,
    reference,
  };
}

export function getNextDemoOrderStatus(current: OrderStatus): OrderStatus | null {
  switch (current) {
    case 'Pending Verification (DEMO)':
      return 'Order Received (DEMO)';
    case 'Order Received (DEMO)':
      return 'Processing (DEMO)';
    case 'Processing (DEMO)':
      return 'Shipped (DEMO)';
    case 'Shipped (DEMO)':
      return 'Delivered (DEMO)';
    default:
      return null;
  }
}

export function validateLoginInput(email: string, password: string): AuthValidationErrors {
  const errors: AuthValidationErrors = {};
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim() || !emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  return errors;
}

export function validateRegisterInput(
  fullName: string,
  email: string,
  password: string,
  confirmPassword: string
): AuthValidationErrors {
  const errors: AuthValidationErrors = {};
  if (!fullName.trim() || fullName.trim().length < 2) {
    errors.fullName = 'Please enter your full name (at least 2 characters).';
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim() || !emailRegex.test(email.trim())) {
    errors.email = 'Please enter a valid email address.';
  }
  if (!password || password.length < 6) {
    errors.password = 'Password must be at least 6 characters.';
  }
  if (confirmPassword !== password) {
    errors.confirmPassword = 'Passwords do not match. Please re-enter the same password.';
  }
  return errors;
}

export function validateForgotPasswordEmail(email: string): string | undefined {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email.trim() || !emailRegex.test(email.trim())) {
    return 'Please enter the registered email address for your demo account.';
  }
  return undefined;
}
