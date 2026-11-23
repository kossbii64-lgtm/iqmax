import assert from 'node:assert/strict';
import test from 'node:test';
import {
  createDemoOrder,
  DEFAULT_DEMO_PROFILE,
  enterMasukDemo,
  getOrdersForUser,
  loginWithDemoAccount,
  logoutDemoSession,
  registerDemoAccount,
  restoreDemoSession,
  saveDemoUserProfile,
  simulatePasswordReset,
  updateDemoOrderStatus,
  type StorageAdapter,
} from './demoStore';
import {
  addItemToCart,
  calculateCartSummary,
  calculateShippingFee,
  clampQuantity,
  getNextDemoOrderStatus,
  inferRegionFromState,
  removeItemFromCart,
  sanitizeStoredCart,
  updateItemQuantity,
  validateCheckoutForm,
  validateLoginInput,
  validateRegisterInput,
} from './storeLogic';

function createMemoryStorage(): StorageAdapter {
  const map = new Map<string, string>();
  return {
    getItem: (key) => map.get(key) ?? null,
    setItem: (key, value) => {
      map.set(key, value);
    },
    removeItem: (key) => {
      map.delete(key);
    },
  };
}

test('shipping matrix matches exact regional + payment rules', () => {
  assert.equal(calculateShippingFee('semenanjung', 'online_transfer', true), 8);
  assert.equal(calculateShippingFee('sabah_sarawak', 'online_transfer', true), 10);
  assert.equal(calculateShippingFee('semenanjung', 'cod', true), 10);
  assert.equal(calculateShippingFee('sabah_sarawak', 'cod', true), 17);
  assert.equal(calculateShippingFee('sabah_sarawak', 'cod', false), 0);
});

test('all package + region + payment total examples calculate accurately including 5-bottle Package 3', () => {
  // 1) Package 1 (RM59) + Peninsular + Online Transfer (RM8) = RM67
  const s1 = calculateCartSummary([{ packageId: 'package-1', quantity: 1 }], 'semenanjung', 'online_transfer');
  assert.equal(s1.subtotal, 59);
  assert.equal(s1.shippingFee, 8);
  assert.equal(s1.grandTotal, 67);
  assert.equal(s1.totalPaidBottles, 1);
  assert.equal(s1.totalFreeBottles, 0);
  assert.equal(s1.totalBottles, 1);

  // 2) Package 2 (RM100) + Peninsular + COD (RM10) = RM110
  const s2 = calculateCartSummary([{ packageId: 'package-2', quantity: 1 }], 'semenanjung', 'cod');
  assert.equal(s2.subtotal, 100);
  assert.equal(s2.shippingFee, 10);
  assert.equal(s2.grandTotal, 110);
  assert.equal(s2.totalPaidBottles, 2);
  assert.equal(s2.totalFreeBottles, 1);
  assert.equal(s2.totalBottles, 3);
  assert.equal(s2.totalTablets, 90);

  // 3) Package 3 (RM150, 3 paid + 2 FREE = 5 bottles, 150 tablets) + Sabah/Sarawak + Online Transfer (RM10) = RM160
  const s3 = calculateCartSummary([{ packageId: 'package-3', quantity: 1 }], 'sabah_sarawak', 'online_transfer');
  assert.equal(s3.subtotal, 150);
  assert.equal(s3.shippingFee, 10);
  assert.equal(s3.grandTotal, 160);
  assert.equal(s3.totalPaidBottles, 3);
  assert.equal(s3.totalFreeBottles, 2);
  assert.equal(s3.totalBottles, 5);
  assert.equal(s3.totalTablets, 150);

  // 4) Package 3 (RM150) + Sabah/Sarawak + COD (RM17) = RM167
  const s4 = calculateCartSummary([{ packageId: 'package-3', quantity: 1 }], 'sabah_sarawak', 'cod');
  assert.equal(s4.subtotal, 150);
  assert.equal(s4.shippingFee, 17);
  assert.equal(s4.grandTotal, 167);
});

test('multi-quantity packages scale bottle counts and charge shipping only once per order', () => {
  const cart = addItemToCart([], 'package-3', 2); // 2 × RM150 = 300; (3+2)*2 = 10 bottles (6 paid + 4 free)
  const combined = addItemToCart(cart, 'package-1', 1); // + RM59 = 359; +1 bottle = 11 bottles
  const summary = calculateCartSummary(combined, 'semenanjung', 'online_transfer');

  assert.equal(summary.subtotal, 359);
  assert.equal(summary.shippingFee, 8);
  assert.equal(summary.grandTotal, 367);
  assert.equal(summary.totalBottles, 11);
  assert.equal(summary.totalFreeBottles, 4);
  assert.equal(summary.totalTablets, 330);

  const reduced = updateItemQuantity(combined, 'package-3', 0);
  assert.equal(reduced.length, 1);
  const emptied = removeItemFromCart(reduced, 'package-1');
  assert.equal(emptied.length, 0);
});

test('legacy cart keys migrate cleanly and clamp quantities', () => {
  assert.equal(clampQuantity(-4), 1);
  assert.equal(clampQuantity(99), 20);
  const migrated = sanitizeStoredCart([
    { packageId: 'package-a', quantity: 2 },
    { packageId: 'package-2', quantity: 1 },
    { packageId: 'bogus', quantity: 5 },
  ]);
  assert.deepEqual(migrated, [
    { packageId: 'package-1', quantity: 2 },
    { packageId: 'package-2', quantity: 1 },
  ]);
  assert.equal(inferRegionFromState('Sabah'), 'sabah_sarawak');
  assert.equal(inferRegionFromState('Sarawak'), 'sabah_sarawak');
  assert.equal(inferRegionFromState('Selangor'), 'semenanjung');
});

test('checkout validation enforces receipt upload for online transfer only', () => {
  const onlineErrors = validateCheckoutForm({
    fullName: 'Aina Ahmad',
    phoneNumber: '0123456789',
    email: 'aina@example.com',
    address: 'No 12 Jalan Universiti 4',
    city: 'Shah Alam',
    state: 'Selangor',
    postcode: '40100',
    shippingRegion: 'semenanjung',
    paymentMethod: 'online_transfer',
    receiptFileName: '',
    receiptPreviewDataUrl: '',
    acceptedTerms: true,
  });
  assert.ok(onlineErrors.receiptFileName);

  const codValid = validateCheckoutForm({
    fullName: 'Aina Ahmad',
    phoneNumber: '0123456789',
    email: 'aina@example.com',
    address: 'No 12 Jalan Universiti 4',
    city: 'Kuching',
    state: 'Sarawak',
    postcode: '93000',
    shippingRegion: 'sabah_sarawak',
    paymentMethod: 'cod',
    receiptFileName: '',
    receiptPreviewDataUrl: '',
    acceptedTerms: true,
  });
  assert.deepEqual(codValid, {});
});

test('auth form validators enforce email, password length, and confirmPassword matching', () => {
  const regErrors = validateRegisterInput('A', 'bad-email', '123', '456');
  assert.ok(regErrors.fullName);
  assert.ok(regErrors.email);
  assert.ok(regErrors.password);
  assert.ok(regErrors.confirmPassword);

  const regValid = validateRegisterInput('Nurul Aina', 'nurul@example.com', 'secret123', 'secret123');
  assert.deepEqual(regValid, {});

  assert.deepEqual(validateLoginInput('nurul@example.com', 'secret123'), {});
});

test('local demo auth, Masuk Demo, profile update, logout, and DEMO order persistence work end-to-end', () => {
  const storage = createMemoryStorage();
  assert.equal(restoreDemoSession(storage), null);

  // Masuk Demo creates demo profile, active session, and sample orders
  const demoProfile = enterMasukDemo(storage);
  assert.equal(demoProfile.email, DEFAULT_DEMO_PROFILE.email);
  assert.equal(demoProfile.isDemoAccount, true);
  assert.ok(restoreDemoSession(storage)?.userId === demoProfile.userId);
  assert.equal(getOrdersForUser(demoProfile.userId, storage).length, 2);

  // Save profile edit
  saveDemoUserProfile({ ...demoProfile, city: 'Subang Jaya', postcode: '47500' }, storage);
  assert.equal(restoreDemoSession(storage)?.city, 'Subang Jaya');

  // Logout returns null session
  logoutDemoSession(storage);
  assert.equal(restoreDemoSession(storage), null);

  // Register new user and log back in
  const student = registerDemoAccount('Ali Razak', 'ali@student.edu', 'pass1234', storage);
  assert.equal(student.isDemoAccount, false);
  assert.equal(restoreDemoSession(storage)?.email, 'ali@student.edu');

  logoutDemoSession(storage);
  assert.throws(() => loginWithDemoAccount('ali@student.edu', 'wrong', storage));
  const loggedBackIn = loginWithDemoAccount('ali@student.edu', 'pass1234', storage);
  assert.equal(loggedBackIn.fullName, 'Ali Razak');

  // Simulated forgot password message
  const reset = simulatePasswordReset('ali@student.edu', storage);
  assert.equal(reset.existsLocally, true);
  assert.ok(reset.message.includes('DEMO Confirmation'));

  // Place a Package 3 COD order and advance status
  const summary = calculateCartSummary(
    [{ packageId: 'package-3', quantity: 1 }],
    'sabah_sarawak',
    'cod'
  );
  const created = createDemoOrder(
    {
      orderId: 'DEMO-IQM-TEST-1',
      reference: 'DEMO-IQM-TEST-1',
      userId: student.userId,
      formData: {
        fullName: 'Ali Razak',
        phoneNumber: '0198887777',
        email: 'ali@student.edu',
        address: 'Lot 22 Taman Likas',
        city: 'Kota Kinabalu',
        state: 'Sabah',
        postcode: '88400',
        shippingRegion: 'sabah_sarawak',
        paymentMethod: 'cod',
        receiptFileName: '',
        receiptPreviewDataUrl: '',
        acceptedTerms: true,
      },
      summary,
    },
    storage
  );

  assert.equal(created.isDemoOrder, true);
  assert.equal(created.totalBottles, 5);
  assert.equal(created.grandTotal, 167);
  assert.equal(created.orderStatus, 'Order Received (DEMO)');

  const next = getNextDemoOrderStatus(created.orderStatus);
  assert.equal(next, 'Processing (DEMO)');
  if (next) {
    updateDemoOrderStatus(created.orderId, next, storage);
  }
  const orders = getOrdersForUser(student.userId, storage);
  assert.equal(orders[0]?.orderStatus, 'Processing (DEMO)');
});
