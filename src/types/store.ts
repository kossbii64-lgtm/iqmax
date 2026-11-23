export type ShippingRegion = 'semenanjung' | 'sabah_sarawak';

export type PaymentMethod = 'online_transfer' | 'cod';

export type PaymentStatus =
  | 'PENDING VERIFICATION (DEMO)'
  | 'PAY UPON DELIVERY (DEMO)'
  | 'VERIFIED (DEMO)'
  | 'CANCELLED (DEMO)';

export type OrderStatus =
  | 'Order Received (DEMO)'
  | 'Pending Verification (DEMO)'
  | 'Processing (DEMO)'
  | 'Shipped (DEMO)'
  | 'Delivered (DEMO)'
  | 'Cancelled (DEMO)';

export type AppTab = 'home' | 'shop' | 'orders' | 'profile';

export type AppScreen = 'auth' | 'main' | 'checkout' | 'confirmation';

export type PolicyKey = 'privacy' | 'terms' | 'shipping' | 'refund';

export interface UserProfile {
  userId: string;
  fullName: string;
  email: string;
  phoneNumber: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  defaultRegion: ShippingRegion;
  isDemoAccount: boolean;
}

export interface AuthSession {
  userId: string;
  isDemoAccount: boolean;
  signedInAtIso: string;
}

export interface StoredDemoAccount {
  profile: UserProfile;
  password: string;
  createdAtIso: string;
}

export interface AuthValidationErrors {
  fullName?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export interface ProductPackage {
  id: 'package-1' | 'package-2' | 'package-3';
  code: string;
  name: string;
  subtitle: string;
  paidBottles: number;
  freeBottles: number;
  totalBottles: number;
  tabletsPerBottle: number;
  totalTablets: number;
  estimatedSupplyDays: number;
  unitPrice: number;
  compareAtPrice?: number;
  badgeText?: string;
  freeBadgeText?: string;
  imageSrc: string;
  imageAlt: string;
  audienceNote: string;
  highlights: string[];
  featured?: boolean;
}

export interface CartItem {
  packageId: ProductPackage['id'];
  quantity: number;
}

export interface CartLineSummary {
  pkg: ProductPackage;
  quantity: number;
  totalPaidBottles: number;
  totalFreeBottles: number;
  totalBottles: number;
  totalTablets: number;
  lineSubtotal: number;
  formattedUnitPrice: string;
  formattedLineTotal: string;
}

export interface CartSummary {
  lines: CartLineSummary[];
  totalItems: number;
  totalPaidBottles: number;
  totalFreeBottles: number;
  totalBottles: number;
  totalTablets: number;
  subtotal: number;
  shippingFee: number;
  shippingRegion: ShippingRegion;
  paymentMethod: PaymentMethod;
  grandTotal: number;
  formattedSubtotal: string;
  formattedShippingFee: string;
  formattedGrandTotal: string;
}

export interface SupportPillar {
  id: string;
  indexLabel: string;
  title: string;
  summary: string;
  keyNutrients: string;
}

export interface IngredientItem {
  id: string;
  name: string;
  category:
    | 'Cognitive & Calm'
    | 'Gut & Pre-Probiotic'
    | 'Vitamins & Minerals'
    | 'Natural Fruit & Base';
  description: string;
  iconKey:
    | 'magnesium-threonate'
    | 'l-theanine'
    | 'centella'
    | 'probiotic'
    | 'inulin'
    | 'fos'
    | 'vitamins'
    | 'berries'
    | 'isomalt'
    | 'stevia';
}

export interface TestimonialItem {
  id: string;
  customerName: string;
  headline: string;
  segmentLabel: string;
  packageUsed: string;
  quote: string;
  imageSrc: string;
  imageAlt: string;
  contextNote: string;
}

export interface FaqItem {
  id: string;
  question: string;
  answer: string;
}

export interface CheckoutFormData {
  fullName: string;
  phoneNumber: string;
  email: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  shippingRegion: ShippingRegion;
  paymentMethod: PaymentMethod;
  receiptFileName: string;
  receiptPreviewDataUrl: string;
  acceptedTerms: boolean;
}

export type CheckoutValidationErrors = Partial<Record<keyof CheckoutFormData, string>>;

export interface OrderLineRecord {
  packageId: ProductPackage['id'];
  packageCode: string;
  packageName: string;
  quantity: number;
  unitPrice: number;
  paidBottles: number;
  freeBottles: number;
  totalBottles: number;
  totalTablets: number;
  lineSubtotal: number;
}

export interface OrderRecord {
  orderId: string;
  reference: string;
  userId: string;
  isDemoOrder: true;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  city: string;
  state: string;
  postcode: string;
  shippingRegion: ShippingRegion;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  items: OrderLineRecord[];
  totalPackages: number;
  totalPaidBottles: number;
  totalFreeBottles: number;
  totalBottles: number;
  totalTablets: number;
  subtotal: number;
  shippingFee: number;
  grandTotal: number;
  hasReceipt: boolean;
  receiptFileName: string;
  receiptPreviewDataUrl: string;
  createdAtIso: string;
  updatedAtIso: string;
}
