import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Minus, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';
import { CartItem } from '../types';
import { storage } from '../lib/storage';
import { calculateOrderPricing, formatCurrency } from '../lib/pricing';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
  onNavigateShop: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  onCheckout,
  onNavigateShop,
}) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [couponInput, setCouponInput] = useState('');
  const [appliedCoupon, setAppliedCoupon] = useState('');
  const [couponError, setCouponError] = useState('');

  useEffect(() => {
    const updateCart = () => {
      setItems(storage.getCart());
      setAppliedCoupon(storage.getAppliedDiscount());
    };
    updateCart();

    const unsubCart = storage.onCartChange(updateCart);
    const unsubDiscount = storage.onDiscountChange(updateCart);
    return () => {
      unsubCart();
      unsubDiscount();
    };
  }, []);

  if (!isOpen) return null;

  const pricing = calculateOrderPricing(items, appliedCoupon);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponInput.trim().toUpperCase();
    if (!code) return;

    const testPricing = calculateOrderPricing(items, code);
    if (testPricing.discountCode) {
      storage.setAppliedDiscount(code);
      setAppliedCoupon(code);
      setCouponInput('');
    } else {
      setCouponError('Invalid coupon or minimum order value not reached.');
    }
  };

  const handleRemoveCoupon = () => {
    storage.setAppliedDiscount('');
    setAppliedCoupon('');
    setCouponError('');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/50 backdrop-blur-xs">
      <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-stone-200">
          {/* Header */}
          <div className="p-4 sm:p-6 border-b border-stone-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <h2 className="text-lg font-bold text-stone-900 font-display">Your Bag</h2>
              <span className="text-xs font-mono text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                {pricing.itemCount} items
              </span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="bg-stone-50 px-6 py-3 border-b border-stone-200/80 text-xs">
            {pricing.isShippingFree ? (
              <div className="flex items-center gap-2 text-emerald-800 font-medium">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                <span>You unlocked <strong>FREE Express Shipping</strong>!</span>
              </div>
            ) : (
              <div>
                <p className="text-stone-700">
                  Add <strong>{formatCurrency(pricing.amountNeededForFreeShipping)}</strong> more to get <strong>Free Express Delivery</strong>
                </p>
                <div className="w-full bg-stone-200 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="bg-stone-900 h-full transition-all duration-300"
                    style={{
                      width: `${Math.min(100, ((pricing.subtotal - pricing.discount) / 999) * 100)}%`,
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Cart Item List */}
          <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4">
            {items.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-4 text-stone-400">
                  <Sparkles className="w-8 h-8" />
                </div>
                <h3 className="text-base font-semibold text-stone-900">Your bag is empty</h3>
                <p className="text-xs text-stone-500 mt-1 max-w-xs mx-auto">
                  Bring your favorite memories to your fridge with personalized NFC smart magnets.
                </p>
                <button
                  onClick={() => {
                    onClose();
                    onNavigateShop();
                  }}
                  className="mt-6 inline-flex items-center gap-2 bg-stone-900 text-white text-xs font-semibold px-4 py-2.5 rounded-lg hover:bg-stone-800 transition-colors"
                >
                  <span>Explore Smart Magnets</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 p-3 rounded-xl border border-stone-200/80 bg-stone-50/50 hover:bg-stone-50 transition-colors"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-20 rounded-lg overflow-hidden bg-white border border-stone-200 shrink-0">
                    <img
                      src={item.customDesign?.previewImageUrl || item.product.images[0]}
                      alt={item.product.name}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="text-xs sm:text-sm font-semibold text-stone-900 line-clamp-1">
                          {item.customDesign?.magnetText || item.product.name}
                        </h4>
                        <button
                          onClick={() => storage.removeFromCart(item.id)}
                          className="text-stone-400 hover:text-rose-600 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="text-[11px] text-stone-500 mt-0.5">
                        <span>{item.variant.sizeLabel}</span> ·{' '}
                        <span className="capitalize">{item.variant.material}</span>
                        {item.customDesign && (
                          <span className="block text-emerald-700 font-medium mt-0.5">
                            Custom Smart Link configured
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      <div className="flex items-center border border-stone-300 rounded-lg bg-white">
                        <button
                          onClick={() => storage.updateCartQuantity(item.id, item.quantity - 1)}
                          className="p-1 text-stone-600 hover:text-stone-950 transition-colors"
                          aria-label="Decrease quantity"
                        >
                          <Minus className="w-3 h-3" />
                        </button>
                        <span className="px-2 text-xs font-mono font-semibold tabular-nums">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => storage.updateCartQuantity(item.id, item.quantity + 1)}
                          className="p-1 text-stone-600 hover:text-stone-950 transition-colors"
                          aria-label="Increase quantity"
                        >
                          <Plus className="w-3 h-3" />
                        </button>
                      </div>

                      <span className="text-xs sm:text-sm font-bold text-stone-950 font-mono tabular-nums">
                        {formatCurrency(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {items.length > 0 && (
            <div className="border-t border-stone-200 p-4 sm:p-6 bg-stone-50 space-y-4">
              {/* Promo code */}
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-emerald-50 border border-emerald-200 text-emerald-900 rounded-lg px-3 py-2 text-xs">
                  <div>
                    <span className="font-bold font-mono">{appliedCoupon}</span> applied:{' '}
                    <span>{pricing.discountDescription}</span>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-emerald-700 hover:text-emerald-950 underline font-medium ml-2"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value)}
                    placeholder="Coupon code (e.g. WELCOME10)"
                    className="flex-1 bg-white border border-stone-300 rounded-lg px-3 py-1.5 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
                  />
                  <button
                    type="submit"
                    className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-1.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-[11px] text-rose-600">{couponError}</p>
              )}

              {/* Price summary */}
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {formatCurrency(pricing.subtotal)}
                  </span>
                </div>

                {pricing.discount > 0 && (
                  <div className="flex justify-between text-emerald-700">
                    <span>Discount</span>
                    <span className="font-mono tabular-nums">
                      -{formatCurrency(pricing.discount)}
                    </span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Estimated Delivery</span>
                  <span className="font-mono tabular-nums text-stone-900">
                    {pricing.shipping === 0 ? 'FREE' : formatCurrency(pricing.shipping)}
                  </span>
                </div>

                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>GST (18% inclusive)</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(pricing.tax)}
                  </span>
                </div>

                <div className="pt-2 border-t border-stone-200 flex justify-between text-sm sm:text-base font-bold text-stone-950">
                  <span>Total</span>
                  <span className="font-mono tabular-nums">
                    {formatCurrency(pricing.total)}
                  </span>
                </div>
              </div>

              {/* Checkout CTA */}
              <button
                onClick={() => {
                  onClose();
                  onCheckout();
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-3 px-4 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-2 text-[11px] text-stone-400">
                <ShieldCheck className="w-3.5 h-3.5 text-stone-500" />
                <span>Encrypted 256-bit checkout by Razorpay</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
