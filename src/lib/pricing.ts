import { CartItem } from '../types';
import { DISCOUNT_CODES, FREE_SHIPPING_THRESHOLD, STANDARD_SHIPPING_FEE, GST_RATE } from './constants';

export interface OrderPricingBreakdown {
  subtotal: number;
  discount: number;
  discountCode?: string;
  discountDescription?: string;
  shipping: number;
  isShippingFree: boolean;
  amountNeededForFreeShipping: number;
  taxableAmount: number;
  tax: number;
  total: number;
  itemCount: number;
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateOrderPricing(
  items: CartItem[],
  discountCodeInput?: string
): OrderPricingBreakdown {
  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  let discount = 0;
  let validCode: string | undefined = undefined;
  let discountDescription: string | undefined = undefined;

  const normalizedCode = discountCodeInput ? discountCodeInput.trim().toUpperCase() : '';

  if (normalizedCode && DISCOUNT_CODES[normalizedCode]) {
    const rule = DISCOUNT_CODES[normalizedCode];
    if (subtotal >= rule.minSpend) {
      validCode = normalizedCode;
      discountDescription = rule.description;
      if (rule.percent > 0) {
        discount = Math.round((subtotal * rule.percent) / 100);
      }
    }
  }

  const postDiscountSubtotal = Math.max(0, subtotal - discount);

  // Free shipping check
  const isShippingFree = postDiscountSubtotal >= FREE_SHIPPING_THRESHOLD || normalizedCode === 'FREESHIP' || subtotal === 0;
  const shipping = isShippingFree || subtotal === 0 ? 0 : STANDARD_SHIPPING_FEE;
  const amountNeededForFreeShipping = Math.max(0, FREE_SHIPPING_THRESHOLD - postDiscountSubtotal);

  // Taxes are inclusive or added transparently. In India B2C e-commerce, prices are GST inclusive or GST breakdown is shown.
  // We calculate the GST component inside the subtotal for tax transparency
  const tax = Math.round((postDiscountSubtotal * GST_RATE) / (1 + GST_RATE));
  const taxableAmount = postDiscountSubtotal - tax;

  const total = postDiscountSubtotal + shipping;

  return {
    subtotal,
    discount,
    discountCode: validCode,
    discountDescription,
    shipping,
    isShippingFree,
    amountNeededForFreeShipping,
    taxableAmount,
    tax,
    total,
    itemCount,
  };
}
