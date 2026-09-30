import {
  CartItem,
  CustomizationDesign,
  Order,
  ProductReview,
  SmartLinkHub,
  SmartMagnet,
  SupportTicket,
  UserProfile,
} from '../types';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';
import { ASSET_IMAGES } from './constants';

const STORAGE_KEYS = {
  CART: 'tmh_cart_items_v1',
  WISHLIST: 'tmh_wishlist_ids_v1',
  SAVED_DESIGNS: 'tmh_saved_designs_v1',
  MAGNETS: 'tmh_smart_magnets_v1',
  SMART_LINKS: 'tmh_smart_links_v1',
  ORDERS: 'tmh_customer_orders_v1',
  REVIEWS: 'tmh_product_reviews_v1',
  TICKETS: 'tmh_support_tickets_v1',
  USER_PROFILE: 'tmh_user_profile_v1',
  APPLIED_DISCOUNT: 'tmh_applied_discount_v1',
};

// Seed initial smart links & magnets if none exist
function getInitialSmartLinks(): SmartLinkHub[] {
  return [
    {
      id: 'sl-1',
      slug: 'aarav-meera-wedding',
      title: 'Aarav & Meera',
      subtitle: 'December 14, 2024 · Udaipur Royal Palace',
      bio: 'Welcome to our wedding memories hub! Tap below to watch our wedding highlight film, browse guest photos, or stream our first dance playlist.',
      avatarUrl: ASSET_IMAGES.productCoupleAcrylic,
      theme: 'romantic',
      isPasswordProtected: true,
      password: '2024',
      passwordHint: 'Wedding Year (4 digits)',
      securityMode: 'pin',
      analytics: {
        totalTaps: 148,
        totalScans: 62,
        lastAccessed: '2026-03-29T18:22:00Z',
        topReferrer: 'NFC Touchscreen',
      },
      links: [
        {
          id: 'link-1',
          type: 'youtube',
          title: 'Watch Wedding Film (4K)',
          url: 'https://youtube.com',
          active: true,
          clicks: 94,
        },
        {
          id: 'link-2',
          type: 'photos',
          title: 'Official Photography Album',
          url: 'https://photos.google.com',
          active: true,
          clicks: 65,
        },
        {
          id: 'link-3',
          type: 'spotify',
          title: 'Our First Dance Song',
          url: 'https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT',
          active: true,
          clicks: 51,
        },
      ],
      createdAt: '2024-12-15T10:00:00Z',
      updatedAt: '2026-03-20T14:30:00Z',
    },
    {
      id: 'sl-2',
      slug: 'first-dance-playlist',
      title: 'Late Night Acoustic Vibes',
      subtitle: 'Curated by Kabir Verma',
      bio: 'Our cozy evening kitchen soundtrack. Tap to launch Spotify immediately.',
      avatarUrl: ASSET_IMAGES.productSpotifyBlack,
      theme: 'dark',
      analytics: {
        totalTaps: 320,
        totalScans: 85,
        lastAccessed: '2026-03-30T09:15:00Z',
        topReferrer: 'NTAG213 Direct',
      },
      links: [
        {
          id: 'link-sp-1',
          type: 'spotify',
          title: 'Open in Spotify',
          url: 'https://open.spotify.com/playlist/37i9dQZF1DXcBWIGoYBM5M',
          active: true,
          clicks: 298,
        },
        {
          id: 'link-sp-2',
          type: 'instagram',
          title: 'Follow Kabir on Instagram',
          url: 'https://instagram.com',
          active: true,
          clicks: 42,
        },
      ],
      createdAt: '2025-02-10T12:00:00Z',
      updatedAt: '2026-03-25T11:00:00Z',
    },
    {
      id: 'sl-3',
      slug: 'amalfi-coast-roadtrip',
      title: 'Amalfi Coast Memories',
      subtitle: 'Summer 2025 · Italy Roadtrip',
      bio: 'Positano, Amalfi, Ravello & Capri highlights. Our route, favorite trattorias, and seaside cliffs.',
      avatarUrl: ASSET_IMAGES.productTravelPolaroid,
      theme: 'amber',
      analytics: {
        totalTaps: 87,
        totalScans: 34,
        lastAccessed: '2026-03-28T16:40:00Z',
        topReferrer: 'Fridge Tap',
      },
      links: [
        {
          id: 'link-tr-1',
          type: 'maps',
          title: 'View Our Roadtrip Map',
          url: 'https://maps.google.com',
          active: true,
          clicks: 64,
        },
        {
          id: 'link-tr-2',
          type: 'photos',
          title: '35mm Film Travel Roll',
          url: 'https://photos.google.com',
          active: true,
          clicks: 45,
        },
      ],
      createdAt: '2025-08-20T10:00:00Z',
      updatedAt: '2026-03-15T08:00:00Z',
    },
  ];
}

function getInitialMagnets(): SmartMagnet[] {
  const initialLinks = getInitialSmartLinks();
  return [
    {
      id: 'mag-1',
      orderId: 'TMH-ORD-8941',
      name: 'Aarav & Meera Wedding Magnet',
      designPreview: ASSET_IMAGES.productCoupleAcrylic,
      nfcUid: 'TMH-NFC-7A8B9C',
      qrSlug: 'aarav-meera-wedding',
      smartLinkId: 'sl-1',
      smartLink: initialLinks[0],
      active: true,
      material: 'acrylic',
      shape: 'square',
      size: 'medium',
      isPasswordProtected: true,
      password: '2024',
      passwordHint: 'Wedding Year (4 digits)',
      securityMode: 'pin',
      createdAt: '2024-12-16T12:00:00Z',
    },
    {
      id: 'mag-2',
      orderId: 'TMH-ORD-9204',
      name: 'Our Song Soundwave Magnet',
      designPreview: ASSET_IMAGES.productSpotifyBlack,
      nfcUid: 'TMH-NFC-3D4E5F',
      qrSlug: 'first-dance-playlist',
      smartLinkId: 'sl-2',
      smartLink: initialLinks[1],
      active: true,
      material: 'metal',
      shape: 'rectangle',
      size: 'medium',
      createdAt: '2025-02-12T15:30:00Z',
    },
    {
      id: 'mag-3',
      orderId: 'TMH-ORD-9831',
      name: 'Amalfi Coast Polaroid Magnet',
      designPreview: ASSET_IMAGES.productTravelPolaroid,
      nfcUid: 'TMH-NFC-9X8Y7Z',
      qrSlug: 'amalfi-coast-roadtrip',
      smartLinkId: 'sl-3',
      smartLink: initialLinks[2],
      active: true,
      material: 'polaroid',
      shape: 'rectangle',
      size: 'medium',
      createdAt: '2025-08-22T09:15:00Z',
    },
  ];
}

function getInitialOrders(): Order[] {
  const magnets = getInitialMagnets();
  return [
    {
      id: 'ord-8941',
      orderNumber: 'TMH-ORD-8941',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav.sharma@example.com',
      customerPhone: '+91 98201 12345',
      shippingAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 98201 12345',
        email: 'aarav.sharma@example.com',
        addressLine1: 'B-402, Sunset Boulevard, Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
      },
      items: [
        {
          id: 'ci-1',
          productId: 'prod-couple-acrylic',
          product: INITIAL_PRODUCTS[0],
          variant: INITIAL_PRODUCTS[0].variants[1],
          quantity: 2,
          price: 699,
        },
      ],
      subtotal: 1398,
      discount: 140,
      discountCode: 'WELCOME10',
      shipping: 0,
      tax: 192,
      total: 1258,
      status: 'Delivered',
      paymentMethod: 'razorpay',
      paymentId: 'pay_Nfc992819284',
      trackingNumber: 'BLUEDART-88291041',
      trackingCourier: 'BlueDart Express',
      estimatedDeliveryDate: '2024-12-20',
      createdAt: '2024-12-16T12:00:00Z',
      updatedAt: '2024-12-20T16:00:00Z',
    },
  ];
}

class AppStorage {
  private listeners: Map<string, Set<() => void>> = new Map();

  private subscribe(key: string, callback: () => void) {
    if (!this.listeners.has(key)) {
      this.listeners.set(key, new Set());
    }
    this.listeners.get(key)!.add(callback);
    return () => {
      this.listeners.get(key)?.delete(callback);
    };
  }

  private notify(key: string) {
    this.listeners.get(key)?.forEach((cb) => cb());
  }

  // --- Cart ---
  public getCart(): CartItem[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.CART);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public setCart(items: CartItem[]) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(items));
    this.notify(STORAGE_KEYS.CART);
  }

  public addToCart(item: CartItem) {
    const cart = this.getCart();
    // Check if duplicate variant & custom design exists
    const existingIndex = cart.findIndex(
      (c) =>
        c.productId === item.productId &&
        c.variant.id === item.variant.id &&
        c.customDesign?.id === item.customDesign?.id
    );

    if (existingIndex > -1) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }
    this.setCart(cart);
  }

  public updateCartQuantity(cartItemId: string, quantity: number) {
    const cart = this.getCart();
    const updated = cart
      .map((item) => {
        if (item.id === cartItemId) {
          return { ...item, quantity: Math.max(0, quantity) };
        }
        return item;
      })
      .filter((item) => item.quantity > 0);
    this.setCart(updated);
  }

  public removeFromCart(cartItemId: string) {
    const cart = this.getCart().filter((item) => item.id !== cartItemId);
    this.setCart(cart);
  }

  public clearCart() {
    this.setCart([]);
  }

  public onCartChange(callback: () => void) {
    return this.subscribe(STORAGE_KEYS.CART, callback);
  }

  // --- Applied Discount ---
  public getAppliedDiscount(): string {
    if (typeof window === 'undefined') return '';
    return localStorage.getItem(STORAGE_KEYS.APPLIED_DISCOUNT) || '';
  }

  public setAppliedDiscount(code: string) {
    if (typeof window === 'undefined') return;
    localStorage.setItem(STORAGE_KEYS.APPLIED_DISCOUNT, code);
    this.notify(STORAGE_KEYS.APPLIED_DISCOUNT);
  }

  public onDiscountChange(callback: () => void) {
    return this.subscribe(STORAGE_KEYS.APPLIED_DISCOUNT, callback);
  }

  // --- Wishlist ---
  public getWishlist(): string[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.WISHLIST);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public toggleWishlist(productId: string): boolean {
    const list = this.getWishlist();
    const exists = list.includes(productId);
    const updated = exists ? list.filter((id) => id !== productId) : [...list, productId];
    localStorage.setItem(STORAGE_KEYS.WISHLIST, JSON.stringify(updated));
    this.notify(STORAGE_KEYS.WISHLIST);
    return !exists;
  }

  public onWishlistChange(callback: () => void) {
    return this.subscribe(STORAGE_KEYS.WISHLIST, callback);
  }

  // --- Saved Custom Designs ---
  public getSavedDesigns(): CustomizationDesign[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SAVED_DESIGNS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public saveDesign(design: CustomizationDesign) {
    const designs = this.getSavedDesigns();
    const existingIndex = designs.findIndex((d) => d.id === design.id);
    if (existingIndex > -1) {
      designs[existingIndex] = { ...design, updatedAt: new Date().toISOString() };
    } else {
      designs.unshift(design);
    }
    localStorage.setItem(STORAGE_KEYS.SAVED_DESIGNS, JSON.stringify(designs));
    this.notify(STORAGE_KEYS.SAVED_DESIGNS);
  }

  public deleteSavedDesign(id: string) {
    const designs = this.getSavedDesigns().filter((d) => d.id !== id);
    localStorage.setItem(STORAGE_KEYS.SAVED_DESIGNS, JSON.stringify(designs));
    this.notify(STORAGE_KEYS.SAVED_DESIGNS);
  }

  // --- Smart Links Hubs ---
  public getSmartLinks(): SmartLinkHub[] {
    if (typeof window === 'undefined') return getInitialSmartLinks();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SMART_LINKS);
      if (!data) {
        const initial = getInitialSmartLinks();
        localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return getInitialSmartLinks();
    }
  }

  public getSmartLinkBySlug(slug: string): SmartLinkHub | undefined {
    return this.getSmartLinks().find((sl) => sl.slug.toLowerCase() === slug.toLowerCase());
  }

  public saveSmartLink(smartLink: SmartLinkHub) {
    const list = this.getSmartLinks();
    const index = list.findIndex((item) => item.id === smartLink.id || item.slug === smartLink.slug);
    if (index > -1) {
      list[index] = { ...smartLink, updatedAt: new Date().toISOString() };
    } else {
      list.push(smartLink);
    }
    localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(list));
    this.notify(STORAGE_KEYS.SMART_LINKS);
  }

  public recordSmartLinkInteraction(slug: string, type: 'tap' | 'scan' | 'linkClick', linkId?: string) {
    const list = this.getSmartLinks();
    const index = list.findIndex((item) => item.slug.toLowerCase() === slug.toLowerCase());
    if (index > -1) {
      const item = list[index];
      if (type === 'tap') item.analytics.totalTaps += 1;
      if (type === 'scan') item.analytics.totalScans += 1;
      item.analytics.lastAccessed = new Date().toISOString();

      if (linkId) {
        const link = item.links.find((l) => l.id === linkId);
        if (link) link.clicks += 1;
      }
      list[index] = item;
      localStorage.setItem(STORAGE_KEYS.SMART_LINKS, JSON.stringify(list));
      this.notify(STORAGE_KEYS.SMART_LINKS);
    }
  }

  // --- Smart Magnets ---
  public getMagnets(): SmartMagnet[] {
    if (typeof window === 'undefined') return getInitialMagnets();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.MAGNETS);
      if (!data) {
        const initial = getInitialMagnets();
        localStorage.setItem(STORAGE_KEYS.MAGNETS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return getInitialMagnets();
    }
  }

  public saveMagnet(magnet: SmartMagnet) {
    const list = this.getMagnets();
    const index = list.findIndex((m) => m.id === magnet.id);
    if (index > -1) {
      list[index] = magnet;
    } else {
      list.unshift(magnet);
    }
    localStorage.setItem(STORAGE_KEYS.MAGNETS, JSON.stringify(list));
    this.notify(STORAGE_KEYS.MAGNETS);
  }

  public updateMagnetDestination(magnetId: string, updatedSmartLink: SmartLinkHub) {
    const magnets = this.getMagnets();
    const index = magnets.findIndex((m) => m.id === magnetId);
    if (index > -1) {
      magnets[index].smartLink = updatedSmartLink;
      this.saveSmartLink(updatedSmartLink);
      localStorage.setItem(STORAGE_KEYS.MAGNETS, JSON.stringify(magnets));
      this.notify(STORAGE_KEYS.MAGNETS);
    }
  }

  // --- Orders ---
  public getOrders(): Order[] {
    if (typeof window === 'undefined') return getInitialOrders();
    try {
      const data = localStorage.getItem(STORAGE_KEYS.ORDERS);
      if (!data) {
        const initial = getInitialOrders();
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(initial));
        return initial;
      }
      return JSON.parse(data);
    } catch {
      return getInitialOrders();
    }
  }

  public createOrder(order: Order): Order {
    const orders = this.getOrders();
    orders.unshift(order);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notify(STORAGE_KEYS.ORDERS);

    // If order contains customized smart magnets, also provision them in My Magnets
    order.items.forEach((item) => {
      const generatedSlug = item.customDesign?.smartLinkSlug || `magnet-${Math.random().toString(36).substring(2, 8)}`;
      const newSmartLink: SmartLinkHub = {
        id: `sl-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        slug: generatedSlug,
        title: item.customDesign?.magnetText || item.product.name,
        subtitle: item.customDesign?.magnetSubtext || 'Custom Smart Magnet Hub',
        bio: 'Turned into an interactive smart magnet by The Magnet House.',
        avatarUrl: item.customDesign?.previewImageUrl || item.product.images[0],
        theme: 'minimal',
        links: [
          {
            id: `link-${Date.now()}`,
            type: 'website',
            title: 'Explore Memories',
            url: item.customDesign?.nfcDestinationUrl || 'https://themagnethouse.com',
            active: true,
            clicks: 0,
          },
        ],
        analytics: {
          totalTaps: 0,
          totalScans: 0,
        },
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };

      const newMagnet: SmartMagnet = {
        id: `mag-${Date.now()}-${Math.random().toString(36).substring(2, 5)}`,
        orderId: order.orderNumber,
        name: item.customDesign?.magnetText || `${item.product.name}`,
        designPreview: item.customDesign?.previewImageUrl || item.product.images[0],
        nfcUid: `TMH-NFC-${Math.random().toString(36).substring(2, 8).toUpperCase()}`,
        qrSlug: generatedSlug,
        smartLinkId: newSmartLink.id,
        smartLink: newSmartLink,
        active: true,
        material: item.variant.material,
        shape: item.variant.shape,
        size: item.variant.size,
        createdAt: new Date().toISOString(),
      };

      this.saveSmartLink(newSmartLink);
      this.saveMagnet(newMagnet);
    });

    return order;
  }

  public updateOrderStatus(orderId: string, status: Order['status'], trackingNumber?: string) {
    const orders = this.getOrders();
    const index = orders.findIndex((o) => o.id === orderId || o.orderNumber === orderId);
    if (index > -1) {
      orders[index].status = status;
      if (trackingNumber) orders[index].trackingNumber = trackingNumber;
      orders[index].updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify(STORAGE_KEYS.ORDERS);
    }
  }

  // --- Reviews ---
  public getReviews(productId?: string): ProductReview[] {
    if (typeof window === 'undefined') return INITIAL_REVIEWS;
    try {
      const data = localStorage.getItem(STORAGE_KEYS.REVIEWS);
      const allReviews: ProductReview[] = data ? JSON.parse(data) : INITIAL_REVIEWS;
      return productId ? allReviews.filter((r) => r.productId === productId) : allReviews;
    } catch {
      return INITIAL_REVIEWS;
    }
  }

  public addReview(review: Omit<ProductReview, 'id' | 'date' | 'helpfulCount'>) {
    const reviews = this.getReviews();
    const newReview: ProductReview = {
      ...review,
      id: `rev-${Date.now()}`,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      helpfulCount: 0,
    };
    reviews.unshift(newReview);
    localStorage.setItem(STORAGE_KEYS.REVIEWS, JSON.stringify(reviews));
    this.notify(STORAGE_KEYS.REVIEWS);
  }

  // --- Support Tickets ---
  public getTickets(): SupportTicket[] {
    if (typeof window === 'undefined') return [];
    try {
      const data = localStorage.getItem(STORAGE_KEYS.TICKETS);
      return data ? JSON.parse(data) : [];
    } catch {
      return [];
    }
  }

  public createTicket(ticket: Omit<SupportTicket, 'id' | 'ticketNumber' | 'status' | 'createdAt'>): SupportTicket {
    const tickets = this.getTickets();
    const newTicket: SupportTicket = {
      ...ticket,
      id: `tkt-${Date.now()}`,
      ticketNumber: `TMH-HELP-${Math.floor(1000 + Math.random() * 9000)}`,
      status: 'open',
      createdAt: new Date().toISOString(),
    };
    tickets.unshift(newTicket);
    localStorage.setItem(STORAGE_KEYS.TICKETS, JSON.stringify(tickets));
    this.notify(STORAGE_KEYS.TICKETS);
    return newTicket;
  }

  // --- User Profile & Role ---
  public getUserProfile(): UserProfile {
    if (typeof window === 'undefined') {
      return {
        id: 'usr-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+91 98201 12345',
        role: 'customer',
        savedAddresses: [],
      };
    }
    try {
      const data = localStorage.getItem(STORAGE_KEYS.USER_PROFILE);
      if (!data) {
        const defaultProfile: UserProfile = {
          id: 'usr-1',
          name: 'Aarav Sharma',
          email: 'aarav.sharma@example.com',
          phone: '+91 98201 12345',
          role: 'customer',
          savedAddresses: [
            {
              fullName: 'Aarav Sharma',
              phone: '+91 98201 12345',
              email: 'aarav.sharma@example.com',
              addressLine1: 'B-402, Sunset Boulevard, Bandra West',
              city: 'Mumbai',
              state: 'Maharashtra',
              postalCode: '400050',
              country: 'India',
            },
          ],
        };
        localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(defaultProfile));
        return defaultProfile;
      }
      return JSON.parse(data);
    } catch {
      return {
        id: 'usr-1',
        name: 'Aarav Sharma',
        email: 'aarav.sharma@example.com',
        phone: '+91 98201 12345',
        role: 'customer',
        savedAddresses: [],
      };
    }
  }

  public updateUserProfile(profile: Partial<UserProfile>) {
    const current = this.getUserProfile();
    const updated = { ...current, ...profile };
    localStorage.setItem(STORAGE_KEYS.USER_PROFILE, JSON.stringify(updated));
    this.notify(STORAGE_KEYS.USER_PROFILE);
  }

  // --- Device Password Authentication & Security ---
  public updateMagnetSecurity(
    magnetId: string,
    isPasswordProtected: boolean,
    password?: string,
    passwordHint?: string,
    securityMode: 'pin' | 'password' | 'unlocked' = 'pin'
  ) {
    const magnets = this.getMagnets();
    const magnet = magnets.find((m) => m.id === magnetId);
    if (!magnet) return;

    magnet.isPasswordProtected = isPasswordProtected;
    magnet.password = isPasswordProtected ? password : '';
    magnet.passwordHint = isPasswordProtected ? passwordHint : '';
    magnet.securityMode = isPasswordProtected ? securityMode : 'unlocked';

    if (magnet.smartLink) {
      magnet.smartLink.isPasswordProtected = isPasswordProtected;
      magnet.smartLink.password = isPasswordProtected ? password : '';
      magnet.smartLink.passwordHint = isPasswordProtected ? passwordHint : '';
      magnet.smartLink.securityMode = isPasswordProtected ? securityMode : 'unlocked';
      magnet.smartLink.updatedAt = new Date().toISOString();
      this.saveSmartLink(magnet.smartLink);
    }

    localStorage.setItem(STORAGE_KEYS.MAGNETS, JSON.stringify(magnets));
    this.notify(STORAGE_KEYS.MAGNETS);
  }

  public isDeviceUnlocked(slug: string): boolean {
    const hub = this.getSmartLinkBySlug(slug);
    if (!hub || !hub.isPasswordProtected) return true;
    if (typeof window === 'undefined') return false;
    try {
      return sessionStorage.getItem(`tmh_device_unlocked_${slug}`) === 'true';
    } catch {
      return false;
    }
  }

  public unlockDeviceSession(
    slug: string,
    passwordAttempt: string
  ): { success: boolean; error?: string } {
    const hub = this.getSmartLinkBySlug(slug);
    if (!hub) return { success: false, error: 'Smart device not found' };
    if (!hub.isPasswordProtected) return { success: true };

    const expected = (hub.password || '').trim();
    const entered = (passwordAttempt || '').trim();

    if (expected === entered) {
      if (typeof window !== 'undefined') {
        try {
          sessionStorage.setItem(`tmh_device_unlocked_${slug}`, 'true');
        } catch {
          // ignore
        }
      }
      return { success: true };
    }

    return {
      success: false,
      error: hub.passwordHint
        ? `Incorrect passcode. Hint: ${hub.passwordHint}`
        : 'Incorrect device passcode. Please try again.',
    };
  }

  public lockDeviceSession(slug: string) {
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.removeItem(`tmh_device_unlocked_${slug}`);
      } catch {
        // ignore
      }
    }
  }
}

export const storage = new AppStorage();
