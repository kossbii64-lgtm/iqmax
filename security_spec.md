# IQMAX+ Firestore Security Specification (Phase 0 TDD)

## 1. Data Invariants
1. **UserProfile (`/users/{userId}`)**:
   - Every profile belongs exclusively to the authenticated owner (`userId == request.auth.uid`).
   - Document ID `{userId}` must match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars).
   - No client may list all user profiles (`allow list: if false`).
   - `userId` and `createdAt` are immutable after creation; `createdAt` and `updatedAt` must equal `request.time`.
   - Every string and postcode field is bounded by strict `.size()` limits matching `firebase-blueprint.json`.

2. **Order (`/orders/{orderId}`)**:
   - Document ID `{orderId}` and `orderId` field must match `^[a-zA-Z0-9_\-]+$` (`<= 128` chars) and match each other.
   - Customer order `get` and `list` queries are strictly restricted to authenticated owners (`resource.data.userId == request.auth.uid`); guest checkouts cannot read, enumerate, or update existing orders.
   - `items` list is bounded to `1..10` items and checked for map structure (`items[0] is map`).
   - Numeric totals (`subtotal`, `shippingFee`, `grandTotal`, bottle counts) are validated as numbers with strict bounds (`subtotal >= 59`, `shippingFee in [8, 10, 17]`, `grandTotal == subtotal + shippingFee`).
   - Terminal State Locking: Once `orderStatus` reaches `'Completed'` or `'Cancelled'`, no client update is permitted.
   - Immutable pricing/item snapshots (`items`, `subtotal`, `shippingFee`, `grandTotal`, `userId`, `reference`, `createdAt`) cannot be altered after order creation.

## 2. The "Dirty Dozen" Adversarial Payloads
1. **Identity Spoofing on Profile**: Authenticated user `uidA` tries creating `/users/uidB` with `userId: "uidA"`. -> `PERMISSION_DENIED`.
2. **Ghost Field Injection on Profile**: User adds `{ "isAdmin": true }` or `{ "role": "admin" }` when creating/updating their profile. -> `PERMISSION_DENIED` (`hasOnly` rejects extra keys).
3. **Blanket User List Scraping**: Signed-in user runs `getDocs(collection(db, 'users'))`. -> `PERMISSION_DENIED`.
4. **Cross-User PII Read on Profile**: `uidA` tries `getDoc(doc(db, 'users', 'uidB'))`. -> `PERMISSION_DENIED`.
5. **Cross-User Order Read**: `uidA` tries reading an order owned by `uidB`. -> `PERMISSION_DENIED`.
6. **Unbounded Order Query Listing**: Client omits `where('userId', '==', uidA)` on `/orders`. -> `PERMISSION_DENIED`.
7. **ID Poisoning Attack**: Client attempts `setDoc(doc(db, 'orders', 'invalid/..%20' + 'x'.repeat(200)), ...)`. -> `PERMISSION_DENIED`.
8. **Client Price Tampering**: Client creates order claiming `subtotal: 1, shippingFee: 0, grandTotal: 1` for a package. -> `PERMISSION_DENIED`.
9. **Client Timestamp Forgery**: Client sets `createdAt: new Date('2020-01-01')` instead of `serverTimestamp()`. -> `PERMISSION_DENIED`.
10. **State Shortcutting on Create**: Client sets `orderStatus: 'Completed'` and `paymentStatus: 'VERIFIED'` when creating a new order. -> `PERMISSION_DENIED`.
11. **Terminal State Mutation**: Owner attempts to reopen or modify an order whose `orderStatus` is `'Cancelled'` or `'Completed'`. -> `PERMISSION_DENIED`.
12. **Receipt / Oversized Payload Denial-of-Wallet**: Client submits `receiptPreviewDataUrl` > 350KB or `items` array > 10 entries. -> `PERMISSION_DENIED`.
