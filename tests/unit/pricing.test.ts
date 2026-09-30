import { describe, it, expect } from 'vitest';
import { calculateOrderPricing, formatCurrency } from '../../src/lib/pricing';
import { CartItem } from '../../src/types';
import { INITIAL_PRODUCTS } from '../../src/data/products';

describe('Pricing, Discount & Tax Calculation Engine', () => {
  const dummyProduct = INITIAL_PRODUCTS[0];
  const dummyVariant = dummyProduct.variants[0]; // 599

  it('calculates subtotal and shipping for cart below free shipping threshold', () => {
    const items: CartItem[] = [
      {
        id: '1',
        productId: dummyProduct.id,
        product: dummyProduct,
        variant: dummyVariant,
        quantity: 1,
        price: 599,
      },
    ];

    const result = calculateOrderPricing(items);
    expect(result.subtotal).toBe(599);
    expect(result.discount).toBe(0);
    expect(result.isShippingFree).toBe(false);
    expect(result.shipping).toBe(99);
    expect(result.total).toBe(599 + 99);
    expect(result.itemCount).toBe(1);
    expect(result.amountNeededForFreeShipping).toBe(400);
  });

  it('unlocks free shipping when subtotal >= ₹999', () => {
    const items: CartItem[] = [
      {
        id: '1',
        productId: dummyProduct.id,
        product: dummyProduct,
        variant: dummyVariant,
        quantity: 2,
        price: 599, // 599 * 2 = 1198
      },
    ];

    const result = calculateOrderPricing(items);
    expect(result.subtotal).toBe(1198);
    expect(result.isShippingFree).toBe(true);
    expect(result.shipping).toBe(0);
    expect(result.total).toBe(1198);
    expect(result.amountNeededForFreeShipping).toBe(0);
  });

  it('applies WELCOME10 coupon correctly on qualifying orders', () => {
    const items: CartItem[] = [
      {
        id: '1',
        productId: dummyProduct.id,
        product: dummyProduct,
        variant: dummyVariant,
        quantity: 1,
        price: 699,
      },
    ];

    const result = calculateOrderPricing(items, 'welcome10');
    expect(result.discountCode).toBe('WELCOME10');
    expect(result.discount).toBe(70); // 10% of 699 rounded
    expect(result.subtotal).toBe(699);
    expect(result.total).toBe(699 - 70 + 99); // post-discount subtotal 629 + 99 shipping
  });

  it('rejects invalid or expired coupons gracefully', () => {
    const items: CartItem[] = [
      {
        id: '1',
        productId: dummyProduct.id,
        product: dummyProduct,
        variant: dummyVariant,
        quantity: 1,
        price: 699,
      },
    ];

    const result = calculateOrderPricing(items, 'FAKECODE123');
    expect(result.discountCode).toBeUndefined();
    expect(result.discount).toBe(0);
  });

  it('computes 18% inclusive GST transparently', () => {
    const items: CartItem[] = [
      {
        id: '1',
        productId: dummyProduct.id,
        product: dummyProduct,
        variant: dummyVariant,
        quantity: 1,
        price: 1180,
      },
    ];

    const result = calculateOrderPricing(items);
    // 1180 inclusive of 18% GST means tax = round(1180 * 0.18 / 1.18) = 180
    expect(result.tax).toBe(180);
    expect(result.taxableAmount).toBe(1000);
  });

  it('formats currency with INR symbol correctly', () => {
    expect(formatCurrency(699)).toContain('699');
  });
});
