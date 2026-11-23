import { useEffect, useMemo, useState } from 'react';
import { AppHeader } from './components/AppHeader';
import { AuthScreen } from './components/AuthScreen';
import { BottomNavBar } from './components/BottomNavBar';
import { CartDrawer } from './components/CartDrawer';
import { CheckoutView } from './components/CheckoutView';
import { HomeTab } from './components/HomeTab';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { OrderConfirmationView } from './components/OrderConfirmationView';
import { OrdersTab } from './components/OrdersTab';
import { PackageDetailModal } from './components/PackageDetailModal';
import { PolicyModal } from './components/PolicyModal';
import { ProfileTab } from './components/ProfileTab';
import { ShopTab } from './components/ShopTab';
import { STORE_CONFIG } from './config/storeConfig';
import type {
  AppScreen,
  AppTab,
  CartItem,
  CheckoutFormData,
  OrderRecord,
  OrderStatus,
  PaymentMethod,
  PolicyKey,
  ProductPackage,
  ShippingRegion,
  UserProfile,
} from './types/store';
import {
  createDemoOrder,
  getOrdersForUser,
  logoutDemoSession,
  restoreDemoSession,
  saveDemoUserProfile,
  updateDemoOrderStatus,
} from './utils/demoStore';
import {
  addItemToCart,
  calculateCartSummary,
  generateOrderIdAndReference,
  removeItemFromCart,
  sanitizeStoredCart,
  updateItemQuantity,
} from './utils/storeLogic';

function loadInitialCart(): CartItem[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(STORE_CONFIG.storageKey);
    if (!raw) {
      const legacy = window.localStorage.getItem('youedu_iqmax_cart_v1');
      if (legacy) return sanitizeStoredCart(JSON.parse(legacy));
      return [];
    }
    return sanitizeStoredCart(JSON.parse(raw));
  } catch {
    return [];
  }
}

function loadInitialPrefs(): { region: ShippingRegion; method: PaymentMethod } {
  if (typeof window === 'undefined') {
    return { region: 'semenanjung', method: 'online_transfer' };
  }
  try {
    const raw = window.localStorage.getItem(STORE_CONFIG.preferencesStorageKey);
    if (!raw) return { region: 'semenanjung', method: 'online_transfer' };
    const parsed = JSON.parse(raw) as Record<string, unknown>;
    return {
      region: parsed.region === 'sabah_sarawak' ? 'sabah_sarawak' : 'semenanjung',
      method: parsed.method === 'cod' ? 'cod' : 'online_transfer',
    };
  } catch {
    return { region: 'semenanjung', method: 'online_transfer' };
  }
}

export default function App() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => restoreDemoSession());
  const [activeScreen, setActiveScreen] = useState<AppScreen>(() =>
    restoreDemoSession() ? 'main' : 'auth'
  );
  const [activeTab, setActiveTab] = useState<AppTab>('home');

  const [cart, setCart] = useState<CartItem[]>(loadInitialCart);
  const initialPrefs = useMemo(loadInitialPrefs, []);
  const [shippingRegion, setShippingRegion] = useState<ShippingRegion>(initialPrefs.region);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialPrefs.method);

  const [customerOrders, setCustomerOrders] = useState<OrderRecord[]>(() => {
    const restored = restoreDemoSession();
    return restored ? getOrdersForUser(restored.userId) : [];
  });
  const [latestReceipt, setLatestReceipt] = useState<OrderRecord | null>(null);

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [selectedPackageModal, setSelectedPackageModal] = useState<ProductPackage | null>(null);
  const [activePolicy, setActivePolicy] = useState<PolicyKey | null>(null);
  const [logoutModalOpen, setLogoutModalOpen] = useState(false);

  // Persist cart locally
  useEffect(() => {
    try {
      window.localStorage.setItem(STORE_CONFIG.storageKey, JSON.stringify(cart));
    } catch {
      // Ignore storage quota errors
    }
  }, [cart]);

  // Persist shipping & payment preferences locally
  useEffect(() => {
    try {
      window.localStorage.setItem(
        STORE_CONFIG.preferencesStorageKey,
        JSON.stringify({ region: shippingRegion, method: paymentMethod })
      );
    } catch {
      // Ignore storage quota errors
    }
  }, [shippingRegion, paymentMethod]);

  const cartSummary = useMemo(
    () => calculateCartSummary(cart, shippingRegion, paymentMethod),
    [cart, shippingRegion, paymentMethod]
  );

  const handleAuthenticated = (profile: UserProfile) => {
    setCurrentUser(profile);
    setShippingRegion(profile.defaultRegion);
    setCustomerOrders(getOrdersForUser(profile.userId));
    setActiveTab('home');
    setActiveScreen('main');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSelectTab = (tab: AppTab) => {
    setActiveTab(tab);
    setActiveScreen('main');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleAddToCart = (packageId: ProductPackage['id'], quantity: number) => {
    setCart((prev) => addItemToCart(prev, packageId, quantity));
    setIsCartOpen(true);
  };

  const handleUpdateQuantity = (packageId: ProductPackage['id'], nextQty: number) => {
    setCart((prev) => updateItemQuantity(prev, packageId, nextQty));
  };

  const handleRemoveItem = (packageId: ProductPackage['id']) => {
    setCart((prev) => removeItemFromCart(prev, packageId));
  };

  const handleProceedToCheckout = () => {
    setIsCartOpen(false);
    setActiveScreen('checkout');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handlePlaceOrder = async (formData: CheckoutFormData) => {
    if (!currentUser) {
      throw new Error('Please log in first to place a demo order.');
    }
    const computedSummary = calculateCartSummary(
      cart,
      formData.shippingRegion,
      formData.paymentMethod
    );
    const { orderId, reference } = generateOrderIdAndReference();
    const record = createDemoOrder({
      orderId,
      reference,
      userId: currentUser.userId,
      formData,
      summary: computedSummary,
    });
    setLatestReceipt(record);
    setCustomerOrders(getOrdersForUser(currentUser.userId));
    setCart([]);
    setActiveScreen('confirmation');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  const handleSaveProfile = (updated: UserProfile) => {
    const saved = saveDemoUserProfile(updated);
    setCurrentUser(saved);
    setShippingRegion(saved.defaultRegion);
  };

  const handleAdvanceOrderStatus = (orderId: string, nextStatus: OrderStatus) => {
    if (!currentUser) return;
    updateDemoOrderStatus(orderId, nextStatus);
    setCustomerOrders(getOrdersForUser(currentUser.userId));
  };

  const handleConfirmLogout = () => {
    setLogoutModalOpen(false);
    setIsCartOpen(false);
    logoutDemoSession();
    setCurrentUser(null);
    setCustomerOrders([]);
    setLatestReceipt(null);
    setActiveScreen('auth');
    window.scrollTo({ top: 0, behavior: 'auto' });
  };

  // Pre-app Authentication Gate
  if (activeScreen === 'auth' || !currentUser) {
    return <AuthScreen onAuthenticated={handleAuthenticated} />;
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#F6F8FB] text-[#0F1E36]">
      {activeScreen === 'main' && (
        <AppHeader
          activeTab={activeTab}
          cartItemCount={cartSummary.totalItems}
          currentUser={currentUser}
          onSelectHome={() => handleSelectTab('home')}
          onOpenCart={() => setIsCartOpen(true)}
        />
      )}

      {activeScreen === 'main' && (
        <main className="flex-1 w-full max-w-6xl mx-auto px-4 sm:px-6 pt-5 sm:pt-7 pb-24">
          {activeTab === 'home' && (
            <HomeTab
              onGoToShop={() => handleSelectTab('shop')}
              onAddToCart={handleAddToCart}
              onViewPackageDetails={(pkg) => setSelectedPackageModal(pkg)}
            />
          )}

          {activeTab === 'shop' && (
            <ShopTab
              onAddToCart={handleAddToCart}
              onViewPackageDetails={(pkg) => setSelectedPackageModal(pkg)}
            />
          )}

          {activeTab === 'orders' && (
            <OrdersTab
              orders={customerOrders}
              onGoToShop={() => handleSelectTab('shop')}
              onAdvanceOrderStatus={handleAdvanceOrderStatus}
            />
          )}

          {activeTab === 'profile' && (
            <ProfileTab
              userProfile={currentUser}
              ordersCount={customerOrders.length}
              onSaveProfile={handleSaveProfile}
              onGoToOrders={() => handleSelectTab('orders')}
              onOpenPolicy={(policy) => setActivePolicy(policy)}
              onRequestLogout={() => setLogoutModalOpen(true)}
            />
          )}
        </main>
      )}

      {activeScreen === 'main' && (
        <BottomNavBar
          activeTab={activeTab}
          ordersCount={customerOrders.length}
          onSelectTab={handleSelectTab}
        />
      )}

      {activeScreen === 'checkout' && (
        <CheckoutView
          cart={cart}
          shippingRegion={shippingRegion}
          paymentMethod={paymentMethod}
          currentUser={currentUser}
          onChangeRegion={setShippingRegion}
          onChangePaymentMethod={setPaymentMethod}
          onBackToStore={() => handleSelectTab('shop')}
          onOpenLogin={() => setActiveScreen('auth')}
          onEditCart={() => setIsCartOpen(true)}
          onPlaceOrder={handlePlaceOrder}
        />
      )}

      {activeScreen === 'confirmation' && latestReceipt && (
        <OrderConfirmationView
          receipt={latestReceipt}
          onBackToHome={() => handleSelectTab('home')}
          onContinueShopping={() => handleSelectTab('shop')}
          onViewDashboard={() => handleSelectTab('orders')}
        />
      )}

      <CartDrawer
        isOpen={isCartOpen}
        summary={cartSummary}
        shippingRegion={shippingRegion}
        paymentMethod={paymentMethod}
        onChangeRegion={setShippingRegion}
        onChangePaymentMethod={setPaymentMethod}
        onClose={() => setIsCartOpen(false)}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onProceedToCheckout={handleProceedToCheckout}
      />

      <PackageDetailModal
        pkg={selectedPackageModal}
        onClose={() => setSelectedPackageModal(null)}
        onAddToCart={handleAddToCart}
      />

      <PolicyModal policyKey={activePolicy} onClose={() => setActivePolicy(null)} />

      <LogoutConfirmModal
        isOpen={logoutModalOpen}
        onCancel={() => setLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
      />
    </div>
  );
}
