/**
 * Phase 0 Security Specification Test Vectors for firestore.rules
 * Intended for verification against Firebase Rules Unit Testing when Emulator is attached,
 * and static invariant inspection alongside eslint-plugin-security-rules.
 */

export const DIRTY_DOZEN_SECURITY_CASES = [
  {
    id: 'DD-01',
    name: 'Identity spoofing on profile write',
    targetPath: '/users/uid_victim',
    actorUid: 'uid_attacker',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-02',
    name: 'Shadow admin field injection on profile create',
    targetPath: '/users/uid_attacker',
    payloadExtras: { isAdmin: true, role: 'superadmin' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-03',
    name: 'Blanket users collection listing',
    targetPath: '/users',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-04',
    name: 'Cross-user profile get',
    targetPath: '/users/uid_victim',
    actorUid: 'uid_attacker',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-05',
    name: 'Cross-user order get',
    targetPath: '/orders/ord_victim_1',
    actorUid: 'uid_attacker',
    operation: 'get',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-06',
    name: 'Unfiltered orders list query without owner where clause',
    targetPath: '/orders',
    actorUid: 'uid_attacker',
    operation: 'list',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-07',
    name: 'Oversized / malformed document ID poisoning',
    targetPath: `/orders/${'a'.repeat(160)}`,
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-08',
    name: 'Pricing & shipping integrity bypass',
    targetPath: '/orders/ord_tamper_1',
    payloadOverrides: { subtotal: 5, shippingFee: 0, grandTotal: 5 },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-09',
    name: 'Forged historical timestamp instead of serverTimestamp',
    targetPath: '/orders/ord_time_1',
    payloadOverrides: { createdAt: '2020-01-01T00:00:00Z' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-10',
    name: 'Order created directly in Completed/VERIFIED state',
    targetPath: '/orders/ord_skip_1',
    payloadOverrides: { orderStatus: 'Completed', paymentStatus: 'VERIFIED' },
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-11',
    name: 'Mutating terminal Cancelled or Completed order',
    targetPath: '/orders/ord_completed_1',
    operation: 'update',
    expected: 'PERMISSION_DENIED',
  },
  {
    id: 'DD-12',
    name: 'Oversized receipt payload (>350KB) or >10 line items',
    targetPath: '/orders/ord_huge_1',
    expected: 'PERMISSION_DENIED',
  },
] as const;
