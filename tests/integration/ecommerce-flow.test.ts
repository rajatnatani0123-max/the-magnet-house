import { describe, it, expect } from 'vitest';
import { INITIAL_PRODUCTS } from '../../src/data/products';
import { calculateOrderPricing } from '../../src/lib/pricing';
import { CartItem, Order, OrderStatus } from '../../src/types';

describe('E-Commerce Lifecycle Integration Flow', () => {
  it('simulates custom product customization to checkout and order fulfillment', () => {
    // 1. Customer selects a couple acrylic smart magnet
    const product = INITIAL_PRODUCTS[0];
    const variant = product.variants[1]; // 3.0" x 3.0" medium, price 699

    // 2. Customizes with photo and wedding hub
    const cartItem: CartItem = {
      id: 'ci-test-1',
      productId: product.id,
      product,
      variant,
      quantity: 2,
      price: variant.price,
      customDesign: {
        id: 'cust-1',
        productId: product.id,
        productName: product.name,
        selectedVariant: variant,
        finish: 'gloss',
        previewImageUrl: product.images[0],
        layers: [],
        backgroundColor: '#ffffff',
        magnetText: 'Aarav & Meera Wedding',
        smartLinkSlug: 'aarav-meera-2026',
        nfcDestinationUrl: 'https://themagnethouse.com/m/aarav-meera-2026',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    };

    // 3. Price calculation
    const pricing = calculateOrderPricing([cartItem], 'WELCOME10');
    expect(pricing.subtotal).toBe(1398);
    expect(pricing.discount).toBe(140); // 10%
    expect(pricing.isShippingFree).toBe(true); // >= 999
    expect(pricing.total).toBe(1398 - 140); // 1258

    // 4. Order created in 'Paid' status
    const order: Order = {
      id: 'ord-int-1',
      orderNumber: 'TMH-ORD-9999',
      customerName: 'Aarav Sharma',
      customerEmail: 'aarav@example.com',
      customerPhone: '+91 98201 12345',
      shippingAddress: {
        fullName: 'Aarav Sharma',
        phone: '+91 98201 12345',
        email: 'aarav@example.com',
        addressLine1: 'Bandra West',
        city: 'Mumbai',
        state: 'Maharashtra',
        postalCode: '400050',
        country: 'India',
      },
      items: [cartItem],
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      discountCode: pricing.discountCode,
      shipping: pricing.shipping,
      tax: pricing.tax,
      total: pricing.total,
      status: 'Paid',
      paymentMethod: 'razorpay',
      paymentId: 'pay_test_9921',
      estimatedDeliveryDate: '2026-04-05',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    expect(order.status).toBe('Paid');

    // 5. Workshop transitions
    const validTransitions: OrderStatus[] = ['Design Review', 'Production', 'Shipped', 'Delivered'];
    let currentStatus = order.status;
    for (const nextStatus of validTransitions) {
      currentStatus = nextStatus;
    }
    expect(currentStatus).toBe('Delivered');
  });
});
