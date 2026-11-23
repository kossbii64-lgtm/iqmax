import {
  AlertCircle,
  ArrowLeft,
  Banknote,
  CheckCircle2,
  FileCheck,
  Landmark,
  Lock,
  MapPin,
  Truck,
  Upload,
} from 'lucide-react';
import { useEffect, useState, type ChangeEvent, type FormEvent } from 'react';
import { MALAYSIAN_STATES, SHIPPING_RATES, STORE_CONFIG } from '../config/storeConfig';
import type {
  CartItem,
  CheckoutFormData,
  CheckoutValidationErrors,
  PaymentMethod,
  ShippingRegion,
  UserProfile,
} from '../types/store';
import {
  calculateCartSummary,
  formatCurrency,
  inferRegionFromState,
  validateCheckoutForm,
} from '../utils/storeLogic';
import { BrandLogo } from './BrandLogo';

interface CheckoutViewProps {
  cart: CartItem[];
  shippingRegion: ShippingRegion;
  paymentMethod: PaymentMethod;
  currentUser: UserProfile | null;
  onChangeRegion: (region: ShippingRegion) => void;
  onChangePaymentMethod: (method: PaymentMethod) => void;
  onBackToStore: () => void;
  onOpenLogin: () => void;
  onEditCart: () => void;
  onPlaceOrder: (formData: CheckoutFormData) => Promise<void>;
}

async function compressReceiptFile(
  file: File
): Promise<{ fileName: string; previewDataUrl: string }> {
  const safeName = file.name.slice(0, 140);
  if (file.type === 'application/pdf' || safeName.toLowerCase().endsWith('.pdf')) {
    return { fileName: safeName, previewDataUrl: '' };
  }

  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      const rawUrl = typeof reader.result === 'string' ? reader.result : '';
      const img = new Image();
      img.onload = () => {
        try {
          const maxDim = 900;
          let { width, height } = img;
          if (width > maxDim || height > maxDim) {
            const scale = maxDim / Math.max(width, height);
            width = Math.round(width * scale);
            height = Math.round(height * scale);
          }
          const canvas = document.createElement('canvas');
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) {
            resolve({ fileName: safeName, previewDataUrl: '' });
            return;
          }
          ctx.drawImage(img, 0, 0, width, height);
          const compressed = canvas.toDataURL('image/jpeg', 0.72);
          resolve({
            fileName: safeName,
            previewDataUrl: compressed.length <= 320000 ? compressed : '',
          });
        } catch {
          resolve({ fileName: safeName, previewDataUrl: '' });
        }
      };
      img.onerror = () => resolve({ fileName: safeName, previewDataUrl: '' });
      img.src = rawUrl;
    };
    reader.onerror = () => resolve({ fileName: safeName, previewDataUrl: '' });
    reader.readAsDataURL(file);
  });
}

export function CheckoutView({
  cart,
  shippingRegion,
  paymentMethod,
  currentUser,
  onChangeRegion,
  onChangePaymentMethod,
  onBackToStore,
  onOpenLogin,
  onEditCart,
  onPlaceOrder,
}: CheckoutViewProps) {
  const summary = calculateCartSummary(cart, shippingRegion, paymentMethod);

  const [formData, setFormData] = useState<CheckoutFormData>(() => ({
    fullName: currentUser?.fullName ?? '',
    phoneNumber: currentUser?.phoneNumber ?? '',
    email: currentUser?.email ?? '',
    address: currentUser?.address ?? '',
    city: currentUser?.city ?? '',
    state: currentUser?.state ?? '',
    postcode: currentUser?.postcode ?? '',
    shippingRegion,
    paymentMethod,
    receiptFileName: '',
    receiptPreviewDataUrl: '',
    acceptedTerms: false,
  }));

  useEffect(() => {
    setFormData((prev) => ({
      ...prev,
      shippingRegion,
      paymentMethod,
    }));
  }, [shippingRegion, paymentMethod]);

  useEffect(() => {
    if (!currentUser) return;
    setFormData((prev) => ({
      ...prev,
      fullName: prev.fullName || currentUser.fullName,
      phoneNumber: prev.phoneNumber || currentUser.phoneNumber,
      email: prev.email || currentUser.email,
      address: prev.address || currentUser.address,
      city: prev.city || currentUser.city,
      state: prev.state || currentUser.state,
      postcode: prev.postcode || currentUser.postcode,
    }));
  }, [currentUser]);

  const [errors, setErrors] = useState<CheckoutValidationErrors>({});
  const [submitAttempted, setSubmitAttempted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const updateField = <K extends keyof CheckoutFormData>(key: K, value: CheckoutFormData[K]) => {
    setFormData((prev) => {
      const next = { ...prev, [key]: value };
      if (submitAttempted) {
        setErrors(validateCheckoutForm(next));
      }
      return next;
    });
  };

  const handleStateChange = (nextState: string) => {
    const inferredRegion = nextState ? inferRegionFromState(nextState) : shippingRegion;
    onChangeRegion(inferredRegion);
    setFormData((prev) => {
      const next = {
        ...prev,
        state: nextState,
        shippingRegion: inferredRegion,
      };
      if (submitAttempted) {
        setErrors(validateCheckoutForm(next));
      }
      return next;
    });
  };

  const handleRegionSelect = (nextRegion: ShippingRegion) => {
    onChangeRegion(nextRegion);
    updateField('shippingRegion', nextRegion);
  };

  const handlePaymentSelect = (nextMethod: PaymentMethod) => {
    onChangePaymentMethod(nextMethod);
    updateField('paymentMethod', nextMethod);
  };

  const handleReceiptUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const processed = await compressReceiptFile(file);
    setFormData((prev) => {
      const next = {
        ...prev,
        receiptFileName: processed.fileName,
        receiptPreviewDataUrl: processed.previewDataUrl,
      };
      if (submitAttempted) {
        setErrors(validateCheckoutForm(next));
      }
      return next;
    });
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitAttempted(true);
    setSubmitError('');

    const validationErrors = validateCheckoutForm(formData);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onPlaceOrder(formData);
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : 'Unable to submit order right now. Please check your details and try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (summary.lines.length === 0) {
    return (
      <main className="flex-1 max-w-3xl mx-auto px-4 sm:px-6 py-20 text-center space-y-5">
        <h1 className="font-display font-bold text-3xl text-[#0F1E36]">Your Cart Is Empty</h1>
        <p className="text-slate-600">
          Please choose an IQMAX+ package before proceeding to checkout.
        </p>
        <button
          type="button"
          onClick={onBackToStore}
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#164A91] hover:bg-[#0F3468] text-white font-display font-bold text-sm cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Browse Packages</span>
        </button>
      </main>
    );
  }

  return (
    <main className="flex-1 py-8 sm:py-12 bg-[#F6F8FB]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Checkout Header */}
        <div className="mb-6 flex flex-col md:flex-row md:items-center justify-between gap-4 pb-5 border-b border-slate-200">
          <div className="space-y-2.5">
            <button
              type="button"
              onClick={onBackToStore}
              className="inline-flex items-center gap-1.5 text-sm font-semibold text-[#164A91] hover:underline cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" aria-hidden="true" />
              <span>Return to App</span>
            </button>
            <div className="flex flex-wrap items-center gap-3">
              <BrandLogo variant="dark" size="sm" />
              <h1 className="font-display font-extrabold text-2xl sm:text-3xl text-[#0F1E36] tracking-tight">
                Checkout
              </h1>
              <span className="px-2.5 py-0.5 rounded-md bg-[#F5A623]/20 text-[#9A5B00] font-mono text-[11px] font-bold">
                DEMO MODE
              </span>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {currentUser ? (
              <div className="rounded-xl bg-emerald-50 border border-emerald-200 px-4 py-2 text-xs text-emerald-800 font-medium">
                Signed in as <strong>{currentUser.fullName}</strong> · Saved locally (DEMO)
              </div>
            ) : (
              <div className="rounded-xl bg-[#EBF2FC] border border-[#164A91]/20 px-4 py-2 text-xs text-[#164A91] flex items-center gap-2">
                <span>Demo Checkout</span>
                <button
                  type="button"
                  onClick={onOpenLogin}
                  className="font-bold underline cursor-pointer"
                >
                  Log In
                </button>
              </div>
            )}
          </div>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start"
        >
          {/* Left Column: Customer Info, Delivery Region, Payment Method */}
          <div className="lg:col-span-7 space-y-6">
            {/* 1. Customer Information */}
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 space-y-5">
              <div className="pb-3 border-b border-slate-100">
                <p className="font-mono text-xs font-semibold text-[#164A91]">STEP 1</p>
                <h2 className="font-display font-bold text-xl text-[#0F1E36]">
                  Customer Information
                </h2>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="checkout-fullName"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Full Name <span className="text-red-600">*</span>
                  </label>
                  <input
                    id="checkout-fullName"
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => updateField('fullName', e.target.value)}
                    placeholder="Enter recipient full name"
                    aria-invalid={Boolean(errors.fullName)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                      errors.fullName ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {errors.fullName && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.fullName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-phone"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Phone Number (WhatsApp) <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => updateField('phoneNumber', e.target.value)}
                      placeholder="e.g. 0123456789"
                      aria-invalid={Boolean(errors.phoneNumber)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                        errors.phoneNumber ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                      }`}
                    />
                    {errors.phoneNumber && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.phoneNumber}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-email"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Email Address <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => updateField('email', e.target.value)}
                      placeholder="you@example.com"
                      aria-invalid={Boolean(errors.email)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                        errors.email ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                      }`}
                    />
                    {errors.email && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.email}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 2. Delivery Address & Shipping Region */}
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <p className="font-mono text-xs font-semibold text-[#164A91]">STEP 2</p>
                  <h2 className="font-display font-bold text-xl text-[#0F1E36]">
                    Delivery Address &amp; Shipping Region
                  </h2>
                </div>
                <MapPin className="w-5 h-5 text-[#164A91]" aria-hidden="true" />
              </div>

              {/* Explicit Region Selector */}
              <div className="space-y-2">
                <span className="block text-xs font-semibold text-slate-700">
                  Select Shipping Region <span className="text-red-600">*</span>
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    type="button"
                    data-testid="region-semenanjung"
                    onClick={() => handleRegionSelect('semenanjung')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      shippingRegion === 'semenanjung'
                        ? 'border-[#164A91] bg-[#EBF2FC]/60 ring-1 ring-[#164A91]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="font-display font-bold text-sm text-[#0F1E36]">
                      1. Peninsular Malaysia
                    </p>
                    <p className="text-xs text-slate-600 mt-1 tabular-nums">
                      Transfer: RM {SHIPPING_RATES.semenanjung.online_transfer} · COD: RM{' '}
                      {SHIPPING_RATES.semenanjung.cod}
                    </p>
                  </button>

                  <button
                    type="button"
                    data-testid="region-sabah-sarawak"
                    onClick={() => handleRegionSelect('sabah_sarawak')}
                    className={`p-4 rounded-2xl border text-left transition-all cursor-pointer ${
                      shippingRegion === 'sabah_sarawak'
                        ? 'border-[#164A91] bg-[#EBF2FC]/60 ring-1 ring-[#164A91]'
                        : 'border-slate-200 hover:border-slate-300 bg-white'
                    }`}
                  >
                    <p className="font-display font-bold text-sm text-[#0F1E36]">
                      2. Sabah / Sarawak
                    </p>
                    <p className="text-xs text-slate-600 mt-1 tabular-nums">
                      Transfer: RM {SHIPPING_RATES.sabah_sarawak.online_transfer} · COD: RM{' '}
                      {SHIPPING_RATES.sabah_sarawak.cod}
                    </p>
                  </button>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label
                    htmlFor="checkout-address"
                    className="block text-xs font-semibold text-slate-700 mb-1.5"
                  >
                    Full Street / Unit Delivery Address <span className="text-red-600">*</span>
                  </label>
                  <textarea
                    id="checkout-address"
                    rows={3}
                    value={formData.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    placeholder="House / Unit No, Street Name, Taman / Neighbourhood"
                    aria-invalid={Boolean(errors.address)}
                    className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                      errors.address ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                    }`}
                  />
                  {errors.address && (
                    <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                      {errors.address}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label
                      htmlFor="checkout-city"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      City <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-city"
                      type="text"
                      value={formData.city}
                      onChange={(e) => updateField('city', e.target.value)}
                      placeholder="e.g. Shah Alam"
                      aria-invalid={Boolean(errors.city)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                        errors.city ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                      }`}
                    />
                    {errors.city && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.city}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-state"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      State <span className="text-red-600">*</span>
                    </label>
                    <select
                      id="checkout-state"
                      value={formData.state}
                      onChange={(e) => handleStateChange(e.target.value)}
                      aria-invalid={Boolean(errors.state)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                        errors.state ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                      }`}
                    >
                      <option value="">Select state</option>
                      {MALAYSIAN_STATES.map((st) => (
                        <option key={st} value={st}>
                          {st}
                        </option>
                      ))}
                    </select>
                    {errors.state && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.state}
                      </p>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="checkout-postcode"
                      className="block text-xs font-semibold text-slate-700 mb-1.5"
                    >
                      Postcode <span className="text-red-600">*</span>
                    </label>
                    <input
                      id="checkout-postcode"
                      type="text"
                      inputMode="numeric"
                      maxLength={5}
                      value={formData.postcode}
                      onChange={(e) => updateField('postcode', e.target.value)}
                      placeholder="e.g. 40100"
                      aria-invalid={Boolean(errors.postcode)}
                      className={`w-full px-3.5 py-2.5 rounded-xl border font-mono text-sm focus:outline-none focus:ring-2 focus:ring-[#164A91] ${
                        errors.postcode ? 'border-red-500 bg-red-50/40' : 'border-slate-300'
                      }`}
                    />
                    {errors.postcode && (
                      <p role="alert" className="mt-1 text-xs font-medium text-red-600">
                        {errors.postcode}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* 3. Payment Method (Online Bank Transfer OR COD) */}
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 space-y-5">
              <div className="pb-3 border-b border-slate-100 flex items-start justify-between gap-4">
                <div>
                  <p className="font-mono text-xs font-semibold text-[#164A91]">STEP 3</p>
                  <h2 className="font-display font-bold text-xl text-[#0F1E36]">
                    Payment Option
                  </h2>
                </div>
                <Lock className="w-4 h-4 text-slate-400 shrink-0 mt-1" aria-hidden="true" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <button
                  type="button"
                  data-testid="payment-online-transfer"
                  onClick={() => handlePaymentSelect('online_transfer')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'online_transfer'
                      ? 'border-[#164A91] bg-[#EBF2FC]/60 ring-1 ring-[#164A91]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Landmark className="w-5 h-5 text-[#164A91]" aria-hidden="true" />
                    <span className="font-mono text-xs font-extrabold text-[#164A91] tabular-nums">
                      +RM {SHIPPING_RATES[shippingRegion].online_transfer} Shipping
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="font-display font-bold text-sm text-[#0F1E36]">
                      Online Bank Transfer
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Transfer &amp; upload receipt for verification
                    </p>
                  </div>
                </button>

                <button
                  type="button"
                  data-testid="payment-cod"
                  onClick={() => handlePaymentSelect('cod')}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                    paymentMethod === 'cod'
                      ? 'border-[#164A91] bg-[#EBF2FC]/60 ring-1 ring-[#164A91]'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2">
                    <Banknote className="w-5 h-5 text-[#D98B0F]" aria-hidden="true" />
                    <span className="font-mono text-xs font-extrabold text-[#164A91] tabular-nums">
                      +RM {SHIPPING_RATES[shippingRegion].cod} Shipping
                    </span>
                  </div>
                  <div className="mt-3">
                    <p className="font-display font-bold text-sm text-[#0F1E36]">
                      Cash on Delivery (COD)
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      Pay cash directly to courier upon arrival
                    </p>
                  </div>
                </button>
              </div>

              {/* Option A: Online Bank Transfer Details + Receipt Upload */}
              {paymentMethod === 'online_transfer' && (
                <div
                  data-testid="bank-transfer-panel"
                  className="rounded-2xl bg-[#F6F8FB] border border-slate-200 p-5 space-y-4"
                >
                  <div className="space-y-1">
                    <p className="font-display font-bold text-sm text-[#0F1E36]">
                      Bank Transfer Details (DEMO Placeholder)
                    </p>
                    <p className="text-xs text-slate-500">
                      Simulated total of{' '}
                      <strong className="font-mono text-[#164A91]">
                        {summary.formattedGrandTotal}
                      </strong>
                      . Attach any sample transfer receipt image/PDF below to test upload. Status
                      starts as <strong>PENDING VERIFICATION (DEMO)</strong>.
                    </p>
                  </div>

                  <dl className="grid grid-cols-1 sm:grid-cols-3 gap-3 rounded-xl bg-white p-4 border border-slate-200 text-xs">
                    <div>
                      <dt className="text-slate-500">Bank Name</dt>
                      <dd className="font-semibold text-[#0F1E36] mt-0.5">
                        {STORE_CONFIG.bankTransferPlaceholder.bankName}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Account Holder</dt>
                      <dd className="font-semibold text-[#0F1E36] mt-0.5">
                        {STORE_CONFIG.bankTransferPlaceholder.accountHolder}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-slate-500">Account Number</dt>
                      <dd className="font-mono font-bold text-[#164A91] mt-0.5">
                        {STORE_CONFIG.bankTransferPlaceholder.accountNumber}
                      </dd>
                    </div>
                  </dl>

                  {/* Upload Payment Receipt */}
                  <div className="space-y-2">
                    <label
                      htmlFor="receipt-upload"
                      className="block text-xs font-semibold text-slate-700"
                    >
                      Upload Payment Receipt (Image or PDF) <span className="text-red-600">*</span>
                    </label>

                    <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                      <label
                        htmlFor="receipt-upload"
                        className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-slate-50 border border-[#164A91]/40 text-[#164A91] font-display font-bold text-xs cursor-pointer"
                      >
                        <Upload className="w-4 h-4" aria-hidden="true" />
                        <span>
                          {formData.receiptFileName ? 'Replace Receipt File' : 'Choose Receipt File'}
                        </span>
                      </label>
                      <input
                        id="receipt-upload"
                        data-testid="receipt-upload-input"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={handleReceiptUpload}
                        className="sr-only"
                      />

                      {formData.receiptFileName && (
                        <div
                          data-testid="receipt-uploaded-badge"
                          className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-2 rounded-xl border border-emerald-200"
                        >
                          <FileCheck className="w-4 h-4 shrink-0" aria-hidden="true" />
                          <span className="truncate max-w-[200px]">
                            {formData.receiptFileName}
                          </span>
                        </div>
                      )}
                    </div>

                    {formData.receiptPreviewDataUrl && (
                      <div className="mt-2">
                        <img
                          src={formData.receiptPreviewDataUrl}
                          alt="Uploaded bank transfer receipt preview"
                          className="max-h-36 rounded-xl border border-slate-200 bg-white p-1"
                        />
                      </div>
                    )}

                    {errors.receiptFileName && (
                      <p role="alert" className="text-xs font-medium text-red-600">
                        {errors.receiptFileName}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Option B: Cash on Delivery Explanation */}
              {paymentMethod === 'cod' && (
                <div
                  data-testid="cod-explanation-panel"
                  className="rounded-2xl bg-[#FFF9EE] border border-[#F5A623]/40 p-5 flex items-start gap-3 text-xs text-slate-700 leading-relaxed"
                >
                  <Truck className="w-5 h-5 text-[#D98B0F] shrink-0 mt-0.5" aria-hidden="true" />
                  <div className="space-y-1">
                    <p className="font-display font-bold text-sm text-[#0F1E36]">
                      Pay Upon Delivery (COD — DEMO)
                    </p>
                    <p>
                      No upfront bank transfer or receipt upload is required. In a live rollout,
                      prepare{' '}
                      <strong className="font-mono text-[#164A91]">
                        {summary.formattedGrandTotal}
                      </strong>{' '}
                      upon parcel arrival. Order status starts as{' '}
                      <strong>Order Received (DEMO)</strong>.
                    </p>
                  </div>
                </div>
              )}
            </section>
          </div>

          {/* Right Sticky Order Summary & Confirmation Submit */}
          <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-24">
            <section className="rounded-3xl bg-white p-6 sm:p-8 border border-slate-200 space-y-5 shadow-xs">
              <div className="pb-3 border-b border-slate-100 flex items-center justify-between gap-3">
                <div>
                  <p className="font-mono text-xs font-semibold text-[#164A91]">ORDER SUMMARY</p>
                  <h2 className="font-display font-bold text-xl text-[#0F1E36]">
                    Packages &amp; Totals
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={onEditCart}
                  className="text-xs font-semibold text-[#164A91] hover:underline cursor-pointer"
                >
                  Edit Cart
                </button>
              </div>

              <ul className="divide-y divide-slate-100">
                {summary.lines.map((line) => (
                  <li key={line.pkg.id} className="py-3.5 flex items-start justify-between gap-4">
                    <div className="flex items-start gap-3">
                      <div className="w-14 h-14 rounded-xl bg-white border border-slate-200 p-1 shrink-0">
                        <img
                          src={line.pkg.imageSrc}
                          alt={line.pkg.name}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-contain"
                        />
                      </div>
                      <div>
                        <p className="font-display font-bold text-sm text-[#0F1E36]">
                          {line.pkg.code} — {line.pkg.name}
                        </p>
                        <p className="text-xs text-slate-500 tabular-nums">
                          Qty: {line.quantity} &times; {line.formattedUnitPrice}
                        </p>
                        <p className="text-[11px] font-medium text-[#164A91] tabular-nums">
                          {line.totalBottles} Bottles Total
                          {line.totalFreeBottles > 0 &&
                            ` (${line.totalPaidBottles} + ${line.totalFreeBottles} FREE)`}{' '}
                          · {line.totalTablets} Tablets
                        </p>
                      </div>
                    </div>
                    <span className="font-mono text-sm font-bold text-[#164A91] tabular-nums whitespace-nowrap">
                      {line.formattedLineTotal}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="pt-4 border-t border-slate-200 space-y-2.5 text-sm">
                <div className="flex items-center justify-between text-slate-600">
                  <span>Product Subtotal</span>
                  <span
                    data-testid="checkout-subtotal"
                    className="font-mono font-semibold text-[#0F1E36] tabular-nums"
                  >
                    {summary.formattedSubtotal}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600">
                  <span>
                    Shipping (
                    {shippingRegion === 'sabah_sarawak'
                      ? 'Sabah / Sarawak'
                      : 'Peninsular Malaysia'}{' '}
                    · {paymentMethod === 'cod' ? 'COD' : 'Transfer'})
                  </span>
                  <span
                    data-testid="checkout-shipping-fee"
                    className="font-mono font-semibold text-[#0F1E36] tabular-nums"
                  >
                    {summary.formattedShippingFee}
                  </span>
                </div>
                <div className="pt-3 border-t border-slate-200 flex items-center justify-between text-base font-bold text-[#0F1E36]">
                  <span>Final Total</span>
                  <span
                    data-testid="checkout-grand-total"
                    className="font-mono text-2xl font-extrabold text-[#164A91] tabular-nums"
                  >
                    {summary.formattedGrandTotal}
                  </span>
                </div>
              </div>

              {/* Terms Acceptance */}
              <div className="pt-2 space-y-2">
                <label className="flex items-start gap-3 cursor-pointer">
                  <input
                    id="checkout-terms"
                    type="checkbox"
                    checked={formData.acceptedTerms}
                    onChange={(e) => updateField('acceptedTerms', e.target.checked)}
                    aria-invalid={Boolean(errors.acceptedTerms)}
                    className="mt-0.5 h-4 w-4 rounded border-slate-300 text-[#164A91] focus:ring-[#164A91]"
                  />
                  <span className="text-xs text-slate-600 leading-relaxed">
                    I confirm this is a{' '}
                    <strong className="text-[#0F1E36]">
                      DEMO order recorded locally in browser storage
                    </strong>{' '}
                    with no real payment or courier dispatch. <span className="text-red-600">*</span>
                  </span>
                </label>
                {errors.acceptedTerms && (
                  <p role="alert" className="text-xs font-medium text-red-600">
                    {errors.acceptedTerms}
                  </p>
                )}
              </div>

              {submitError && (
                <div
                  role="alert"
                  className="rounded-xl bg-red-50 border border-red-200 p-3 flex items-start gap-2 text-xs text-red-700"
                >
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{submitError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isSubmitting}
                data-testid="place-order-button"
                className="w-full py-4 px-6 rounded-xl bg-[#F5A623] hover:bg-[#D98B0F] disabled:opacity-60 text-[#0F1E36] font-display font-extrabold text-base transition-colors cursor-pointer shadow-sm flex items-center justify-center gap-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#164A91]"
              >
                <CheckCircle2 className="w-5 h-5" aria-hidden="true" />
                <span>
                  {isSubmitting
                    ? 'Submitting Order...'
                    : `Confirm Order (${summary.formattedGrandTotal})`}
                </span>
              </button>
            </section>
          </div>
        </form>
      </div>
    </main>
  );
}
