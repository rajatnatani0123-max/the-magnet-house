export type MagnetMaterial = 'acrylic' | 'wood' | 'metal' | 'polaroid' | 'stone';
export type MagnetShape = 'square' | 'rectangle' | 'circle' | 'arch';
export type MagnetSize = 'small' | 'medium' | 'large';

export type ProductTheme = 
  | 'photo'
  | 'couple'
  | 'wedding'
  | 'family'
  | 'pets'
  | 'birthday'
  | 'travel'
  | 'spotify'
  | 'instagram'
  | 'business'
  | 'memorial'
  | 'custom';

export interface ProductVariant {
  id: string;
  size: MagnetSize;
  sizeLabel: string;
  dimensions: string;
  material: MagnetMaterial;
  shape: MagnetShape;
  price: number;
  originalPrice?: number;
  inStock: boolean;
  stockCount: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  authorName: string;
  rating: number; // 1 to 5
  title: string;
  comment: string;
  date: string;
  verifiedPurchase: boolean;
  helpfulCount: number;
  userPhotoUrl?: string;
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  basePrice: number;
  originalPrice?: number;
  category: ProductTheme;
  material: MagnetMaterial;
  shapes: MagnetShape[];
  images: string[];
  badges?: ('bestseller' | 'new' | 'limited' | 'trending')[];
  rating: number;
  reviewCount: number;
  nfcEnabled: boolean;
  qrEnabled: boolean;
  dimensions: string;
  weight: string;
  magnetStrength: string;
  productionTime: string;
  shippingEstimate: string;
  variants: ProductVariant[];
  features: string[];
}

export interface DesignLayer {
  id: string;
  type: 'image' | 'text' | 'sticker' | 'shape';
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
  width: number; // percentage
  height: number; // percentage
  rotation: number; // degrees
  content: string; // image data URL or text or sticker SVG name
  fontFamily?: string;
  fontSize?: number; // pt
  color?: string;
  backgroundColor?: string;
  opacity?: number;
  zIndex: number;
}

export interface CustomizationDesign {
  id: string;
  productId: string;
  productName: string;
  selectedVariant: ProductVariant;
  finish: 'gloss' | 'matte' | 'brushed';
  previewImageUrl: string;
  userImageUrl?: string;
  imageDpi?: number;
  isDpiSufficient?: boolean;
  layers: DesignLayer[];
  backgroundColor: string;
  magnetText?: string;
  magnetSubtext?: string;
  nfcDestinationUrl?: string;
  smartLinkSlug?: string;
  createdAt: string;
  updatedAt: string;
}

export type SmartLinkType = 
  | 'spotify'
  | 'instagram'
  | 'youtube'
  | 'website'
  | 'whatsapp'
  | 'contact'
  | 'photos'
  | 'maps'
  | 'custom';

export interface SmartLinkItem {
  id: string;
  type: SmartLinkType;
  title: string;
  url: string;
  iconName?: string;
  active: boolean;
  clicks: number;
}

export interface SmartLinkHub {
  id: string;
  slug: string;
  title: string;
  subtitle: string;
  bio: string;
  avatarUrl?: string;
  coverUrl?: string;
  theme: 'minimal' | 'romantic' | 'dark' | 'emerald' | 'amber';
  links: SmartLinkItem[];
  vcardData?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    company?: string;
    note?: string;
  };
  analytics: {
    totalTaps: number;
    totalScans: number;
    lastAccessed?: string;
    topReferrer?: string;
  };
  isPasswordProtected?: boolean;
  password?: string; // Device passcode / PIN for hub access
  passwordHint?: string;
  securityMode?: 'pin' | 'password' | 'unlocked';
  createdAt: string;
  updatedAt: string;
}

export interface SmartMagnet {
  id: string;
  orderId?: string;
  name: string;
  designPreview: string;
  nfcUid: string;
  qrSlug: string;
  smartLinkId: string;
  smartLink: SmartLinkHub;
  active: boolean;
  material: MagnetMaterial;
  shape: MagnetShape;
  size: MagnetSize;
  isPasswordProtected?: boolean;
  password?: string;
  passwordHint?: string;
  securityMode?: 'pin' | 'password' | 'unlocked';
  createdAt: string;
}

export interface CartItem {
  id: string;
  productId: string;
  product: Product;
  variant: ProductVariant;
  customDesign?: CustomizationDesign;
  quantity: number;
  price: number;
}

export interface ShippingAddress {
  fullName: string;
  phone: string;
  email: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export type OrderStatus = 
  | 'Pending'
  | 'Paid'
  | 'Design Review'
  | 'Production'
  | 'Shipped'
  | 'Delivered'
  | 'Cancelled';

export interface Order {
  id: string;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  shippingAddress: ShippingAddress;
  items: CartItem[];
  subtotal: number;
  discount: number;
  discountCode?: string;
  shipping: number;
  tax: number;
  total: number;
  status: OrderStatus;
  paymentMethod: 'razorpay' | 'upi' | 'card';
  paymentId?: string;
  trackingNumber?: string;
  trackingCourier?: string;
  estimatedDeliveryDate: string;
  createdAt: string;
  updatedAt: string;
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'customer' | 'staff' | 'admin';
  password?: string;
  passwordAuthEnabled?: boolean;
  twoFactorDeviceEnabled?: boolean;
  savedAddresses: ShippingAddress[];
}

export interface SupportTicket {
  id: string;
  ticketNumber: string;
  customerEmail: string;
  customerName: string;
  orderNumber?: string;
  category: 'order' | 'customization' | 'nfc' | 'shipping' | 'general';
  subject: string;
  message: string;
  status: 'open' | 'in_progress' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
}
