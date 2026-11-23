import { STORE_CONFIG } from '../config/storeConfig';
import type {
  AuthSession,
  CartSummary,
  CheckoutFormData,
  OrderRecord,
  OrderStatus,
  PaymentStatus,
  StoredDemoAccount,
  UserProfile,
} from '../types/store';

export interface StorageAdapter {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

const noopStorage: StorageAdapter = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function getDefaultStorage(): StorageAdapter {
  if (typeof window !== 'undefined' && window.localStorage) {
    return window.localStorage;
  }
  return noopStorage;
}

export const DEMO_ACCOUNT_ID = 'DEMO-USER-001';

export const DEFAULT_DEMO_PROFILE: UserProfile = {
  userId: DEMO_ACCOUNT_ID,
  fullName: 'Nurul Aina (Demo User)',
  email: 'demo@youedu-iqmax.demo',
  phoneNumber: '+60 12-345 6789',
  address: 'No. 18, Jalan Kristal 7/68, Seksyen 7',
  city: 'Shah Alam',
  state: 'Selangor',
  postcode: '40000',
  defaultRegion: 'semenanjung',
  isDemoAccount: true,
};

function createSampleDemoOrders(): OrderRecord[] {
  const now = Date.now();
  const fiveDaysAgo = new Date(now - 5 * 24 * 60 * 60 * 1000).toISOString();
  const twoDaysAgo = new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString();

  return [
    {
      orderId: 'DEMO-IQM-SAMPLE-02',
      reference: 'DEMO-IQM-SAMPLE-02',
      userId: DEMO_ACCOUNT_ID,
      isDemoOrder: true,
      customerName: DEFAULT_DEMO_PROFILE.fullName,
      customerPhone: DEFAULT_DEMO_PROFILE.phoneNumber,
      customerEmail: DEFAULT_DEMO_PROFILE.email,
      address: DEFAULT_DEMO_PROFILE.address,
      city: DEFAULT_DEMO_PROFILE.city,
      state: DEFAULT_DEMO_PROFILE.state,
      postcode: DEFAULT_DEMO_PROFILE.postcode,
      shippingRegion: 'semenanjung',
      paymentMethod: 'online_transfer',
      paymentStatus: 'VERIFIED (DEMO)',
      orderStatus: 'Shipped (DEMO)',
      items: [
        {
          packageId: 'package-2',
          packageCode: 'PACKAGE 2',
          packageName: 'Most Popular Pack',
          quantity: 1,
          unitPrice: 100,
          paidBottles: 2,
          freeBottles: 1,
          totalBottles: 3,
          totalTablets: 90,
          lineSubtotal: 100,
        },
      ],
      totalPackages: 1,
      totalPaidBottles: 2,
      totalFreeBottles: 1,
      totalBottles: 3,
      totalTablets: 90,
      subtotal: 100,
      shippingFee: 8,
      grandTotal: 108,
      hasReceipt: true,
      receiptFileName: 'demo-transfer-slip.png',
      receiptPreviewDataUrl: '',
      createdAtIso: twoDaysAgo,
      updatedAtIso: twoDaysAgo,
    },
    {
      orderId: 'DEMO-IQM-SAMPLE-01',
      reference: 'DEMO-IQM-SAMPLE-01',
      userId: DEMO_ACCOUNT_ID,
      isDemoOrder: true,
      customerName: DEFAULT_DEMO_PROFILE.fullName,
      customerPhone: DEFAULT_DEMO_PROFILE.phoneNumber,
      customerEmail: DEFAULT_DEMO_PROFILE.email,
      address: DEFAULT_DEMO_PROFILE.address,
      city: DEFAULT_DEMO_PROFILE.city,
      state: DEFAULT_DEMO_PROFILE.state,
      postcode: DEFAULT_DEMO_PROFILE.postcode,
      shippingRegion: 'semenanjung',
      paymentMethod: 'cod',
      paymentStatus: 'VERIFIED (DEMO)',
      orderStatus: 'Delivered (DEMO)',
      items: [
        {
          packageId: 'package-1',
          packageCode: 'PACKAGE 1',
          packageName: 'Starter Pack',
          quantity: 1,
          unitPrice: 59,
          paidBottles: 1,
          freeBottles: 0,
          totalBottles: 1,
          totalTablets: 30,
          lineSubtotal: 59,
        },
      ],
      totalPackages: 1,
      totalPaidBottles: 1,
      totalFreeBottles: 0,
      totalBottles: 1,
      totalTablets: 30,
      subtotal: 59,
      shippingFee: 10,
      grandTotal: 69,
      hasReceipt: false,
      receiptFileName: '',
      receiptPreviewDataUrl: '',
      createdAtIso: fiveDaysAgo,
      updatedAtIso: fiveDaysAgo,
    },
  ];
}

function readAccounts(storage: StorageAdapter): StoredDemoAccount[] {
  try {
    const raw = storage.getItem(STORE_CONFIG.demoUsersKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as StoredDemoAccount[]) : [];
  } catch {
    return [];
  }
}

function writeAccounts(accounts: StoredDemoAccount[], storage: StorageAdapter): void {
  storage.setItem(STORE_CONFIG.demoUsersKey, JSON.stringify(accounts));
}

function readAllOrders(storage: StorageAdapter): OrderRecord[] {
  try {
    const raw = storage.getItem(STORE_CONFIG.demoOrdersKey);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as OrderRecord[]) : [];
  } catch {
    return [];
  }
}

function writeAllOrders(orders: OrderRecord[], storage: StorageAdapter): void {
  storage.setItem(STORE_CONFIG.demoOrdersKey, JSON.stringify(orders));
}

function ensureDemoAccountAndSeedOrders(storage: StorageAdapter): StoredDemoAccount {
  const accounts = readAccounts(storage);
  let demoAcc = accounts.find((a) => a.profile.userId === DEMO_ACCOUNT_ID);

  if (!demoAcc) {
    demoAcc = {
      profile: { ...DEFAULT_DEMO_PROFILE },
      password: 'demo-user-pass',
      createdAtIso: new Date().toISOString(),
    };
    writeAccounts([demoAcc, ...accounts], storage);
  }

  const seededFlag = storage.getItem(STORE_CONFIG.demoOrdersSeededKey);
  if (!seededFlag) {
    const existingOrders = readAllOrders(storage);
    const hasDemoOrders = existingOrders.some((o) => o.userId === DEMO_ACCOUNT_ID);
    if (!hasDemoOrders) {
      writeAllOrders([...createSampleDemoOrders(), ...existingOrders], storage);
    }
    storage.setItem(STORE_CONFIG.demoOrdersSeededKey, '1');
  }

  return demoAcc;
}

export function restoreDemoSession(
  storage: StorageAdapter = getDefaultStorage()
): UserProfile | null {
  try {
    const rawSession = storage.getItem(STORE_CONFIG.demoSessionKey);
    if (!rawSession) return null;
    const session = JSON.parse(rawSession) as AuthSession;
    if (!session || typeof session.userId !== 'string') return null;

    if (session.userId === DEMO_ACCOUNT_ID) {
      const demoAcc = ensureDemoAccountAndSeedOrders(storage);
      return demoAcc.profile;
    }

    const accounts = readAccounts(storage);
    const matched = accounts.find((a) => a.profile.userId === session.userId);
    return matched ? matched.profile : null;
  } catch {
    return null;
  }
}

export function enterMasukDemo(
  storage: StorageAdapter = getDefaultStorage()
): UserProfile {
  const demoAcc = ensureDemoAccountAndSeedOrders(storage);
  const session: AuthSession = {
    userId: demoAcc.profile.userId,
    isDemoAccount: true,
    signedInAtIso: new Date().toISOString(),
  };
  storage.setItem(STORE_CONFIG.demoSessionKey, JSON.stringify(session));
  return demoAcc.profile;
}

export function registerDemoAccount(
  fullName: string,
  email: string,
  password: string,
  storage: StorageAdapter = getDefaultStorage()
): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts(storage);

  if (accounts.some((a) => a.profile.email.toLowerCase() === normalizedEmail)) {
    throw new Error(
      'An account with this email is already registered in this browser. Please Log In instead.'
    );
  }

  const nowIso = new Date().toISOString();
  const newUserId = `DEMO-USR-${Date.now().toString(36).toUpperCase()}`;
  const profile: UserProfile = {
    userId: newUserId,
    fullName: fullName.trim(),
    email: normalizedEmail,
    phoneNumber: '',
    address: '',
    city: '',
    state: '',
    postcode: '',
    defaultRegion: 'semenanjung',
    isDemoAccount: false,
  };

  const newAccount: StoredDemoAccount = {
    profile,
    password,
    createdAtIso: nowIso,
  };
  writeAccounts([...accounts, newAccount], storage);

  const session: AuthSession = {
    userId: profile.userId,
    isDemoAccount: false,
    signedInAtIso: nowIso,
  };
  storage.setItem(STORE_CONFIG.demoSessionKey, JSON.stringify(session));

  return profile;
}

export function loginWithDemoAccount(
  email: string,
  password: string,
  storage: StorageAdapter = getDefaultStorage()
): UserProfile {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts(storage);

  const matched = accounts.find(
    (a) => a.profile.email.toLowerCase() === normalizedEmail && a.password === password
  );

  if (!matched) {
    throw new Error(
      'Invalid email or password. Register a new account or tap "Masuk Demo" for instant access.'
    );
  }

  const session: AuthSession = {
    userId: matched.profile.userId,
    isDemoAccount: matched.profile.isDemoAccount,
    signedInAtIso: new Date().toISOString(),
  };
  storage.setItem(STORE_CONFIG.demoSessionKey, JSON.stringify(session));
  return matched.profile;
}

export function simulatePasswordReset(
  email: string,
  storage: StorageAdapter = getDefaultStorage()
): { existsLocally: boolean; message: string } {
  const normalizedEmail = email.trim().toLowerCase();
  const accounts = readAccounts(storage);
  const existsLocally = accounts.some((a) => a.profile.email.toLowerCase() === normalizedEmail);

  return {
    existsLocally,
    message: existsLocally
      ? `DEMO Confirmation: Password reset link simulated for ${normalizedEmail}. No real email was sent.`
      : `DEMO Confirmation: If ${normalizedEmail} exists in local storage, a simulated reset notice has been logged (no real email sent).`,
  };
}

export function logoutDemoSession(storage: StorageAdapter = getDefaultStorage()): void {
  storage.removeItem(STORE_CONFIG.demoSessionKey);
}

export function saveDemoUserProfile(
  updatedProfile: UserProfile,
  storage: StorageAdapter = getDefaultStorage()
): UserProfile {
  const accounts = readAccounts(storage);
  const idx = accounts.findIndex((a) => a.profile.userId === updatedProfile.userId);
  if (idx >= 0) {
    accounts[idx] = {
      ...accounts[idx],
      profile: { ...updatedProfile },
    };
    writeAccounts(accounts, storage);
  } else {
    writeAccounts(
      [
        ...accounts,
        {
          profile: { ...updatedProfile },
          password: 'demo-user-pass',
          createdAtIso: new Date().toISOString(),
        },
      ],
      storage
    );
  }
  return updatedProfile;
}

export function getOrdersForUser(
  userId: string,
  storage: StorageAdapter = getDefaultStorage()
): OrderRecord[] {
  const all = readAllOrders(storage);
  return all
    .filter((o) => o.userId === userId)
    .sort((a, b) => (a.createdAtIso < b.createdAtIso ? 1 : -1));
}

export function createDemoOrder(
  params: {
    orderId: string;
    reference: string;
    userId: string;
    formData: CheckoutFormData;
    summary: CartSummary;
  },
  storage: StorageAdapter = getDefaultStorage()
): OrderRecord {
  const { orderId, reference, userId, formData, summary } = params;
  const nowIso = new Date().toISOString();
  const isTransfer = formData.paymentMethod === 'online_transfer';

  const paymentStatus: PaymentStatus = isTransfer
    ? 'PENDING VERIFICATION (DEMO)'
    : 'PAY UPON DELIVERY (DEMO)';

  const orderStatus: OrderStatus = isTransfer
    ? 'Pending Verification (DEMO)'
    : 'Order Received (DEMO)';

  const record: OrderRecord = {
    orderId,
    reference,
    userId,
    isDemoOrder: true,
    customerName: formData.fullName.trim(),
    customerPhone: formData.phoneNumber.trim(),
    customerEmail: formData.email.trim(),
    address: formData.address.trim(),
    city: formData.city.trim(),
    state: formData.state.trim(),
    postcode: formData.postcode.trim(),
    shippingRegion: formData.shippingRegion,
    paymentMethod: formData.paymentMethod,
    paymentStatus,
    orderStatus,
    items: summary.lines.map((line) => ({
      packageId: line.pkg.id,
      packageCode: line.pkg.code,
      packageName: line.pkg.name,
      quantity: line.quantity,
      unitPrice: line.pkg.unitPrice,
      paidBottles: line.totalPaidBottles,
      freeBottles: line.totalFreeBottles,
      totalBottles: line.totalBottles,
      totalTablets: line.totalTablets,
      lineSubtotal: line.lineSubtotal,
    })),
    totalPackages: summary.totalItems,
    totalPaidBottles: summary.totalPaidBottles,
    totalFreeBottles: summary.totalFreeBottles,
    totalBottles: summary.totalBottles,
    totalTablets: summary.totalTablets,
    subtotal: summary.subtotal,
    shippingFee: summary.shippingFee,
    grandTotal: summary.grandTotal,
    hasReceipt: isTransfer && Boolean(formData.receiptFileName.trim()),
    receiptFileName: isTransfer ? formData.receiptFileName.trim() : '',
    receiptPreviewDataUrl: isTransfer ? formData.receiptPreviewDataUrl : '',
    createdAtIso: nowIso,
    updatedAtIso: nowIso,
  };

  const existing = readAllOrders(storage);
  writeAllOrders([record, ...existing], storage);
  return record;
}

export function updateDemoOrderStatus(
  orderId: string,
  nextStatus: OrderStatus,
  storage: StorageAdapter = getDefaultStorage()
): OrderRecord[] {
  const all = readAllOrders(storage);
  const nowIso = new Date().toISOString();

  const updated = all.map((order) => {
    if (order.orderId !== orderId) return order;
    let nextPaymentStatus = order.paymentStatus;
    if (nextStatus === 'Cancelled (DEMO)') {
      nextPaymentStatus = 'CANCELLED (DEMO)';
    } else if (
      nextStatus === 'Processing (DEMO)' ||
      nextStatus === 'Shipped (DEMO)' ||
      nextStatus === 'Delivered (DEMO)'
    ) {
      nextPaymentStatus = 'VERIFIED (DEMO)';
    }
    return {
      ...order,
      orderStatus: nextStatus,
      paymentStatus: nextPaymentStatus,
      updatedAtIso: nowIso,
    };
  });

  writeAllOrders(updated, storage);
  return updated;
}
