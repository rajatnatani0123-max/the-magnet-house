import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import {
  ShieldCheck,
  CheckCircle2,
  Lock,
  ArrowRight,
  ArrowLeft,
  Truck,
  CreditCard,
  QrCode,
  AlertCircle,
  Sparkles,
} from 'lucide-react';
import { CartItem, ShippingAddress, Order } from '../types';
import { storage } from '../lib/storage';
import { calculateOrderPricing, formatCurrency } from '../lib/pricing';

interface CheckoutViewProps {
  onSuccess: (order: Order) => void;
  onBackToCart: () => void;
  onNavigateHome: () => void;
}

export const CheckoutView: React.FC<CheckoutViewProps> = ({
  onSuccess,
  onBackToCart,
  onNavigateHome,
}) => {
  const [step, setStep] = useState<1 | 2 | 3>(1); // 1: Address, 2: Review, 3: Payment
  const [items] = useState<CartItem[]>(() => storage.getCart());
  const [appliedCoupon] = useState<string>(() => storage.getAppliedDiscount());

  // Address form
  const [address, setAddress] = useState<ShippingAddress>({
    fullName: 'Aarav Sharma',
    phone: '+91 98201 12345',
    email: 'aarav.sharma@example.com',
    addressLine1: 'B-402, Sunset Boulevard, Bandra West',
    addressLine2: 'Near Joggers Park',
    city: 'Mumbai',
    state: 'Maharashtra',
    postalCode: '400050',
    country: 'India',
  });

  // Payment states
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'upi' | 'card'>('razorpay');
  const [upiId, setUpiId] = useState('aarav@okaxis');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState('');
  const [failSimulation, setFailSimulation] = useState(false);

  const pricing = calculateOrderPricing(items, appliedCoupon);

  if (items.length === 0) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <h2 className="text-xl font-bold font-display text-stone-900">Your bag is empty</h2>
        <p className="text-xs text-stone-500 mt-2">Add custom magnets before heading to checkout.</p>
        <button
          onClick={onNavigateHome}
          className="mt-6 px-6 py-2.5 bg-stone-950 text-white rounded-xl text-xs font-semibold"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  const handleNextToReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!address.fullName || !address.phone || !address.addressLine1 || !address.postalCode) {
      alert('Please fill out all required shipping fields.');
      return;
    }
    setStep(2);
  };

  const handleExecutePayment = async () => {
    setIsProcessing(true);
    setPaymentError('');

    // Simulate server-side order & Razorpay transaction verification
    await new Promise((resolve) => setTimeout(resolve, 1400));

    if (failSimulation) {
      setIsProcessing(false);
      setPaymentError('Payment declined by issuing bank (Simulated Test Mode). Please retry with UPI or Card.');
      return;
    }

    const orderNumber = `TMH-ORD-${Math.floor(1000 + Math.random() * 9000)}`;

    const newOrder: Order = {
      id: `ord-${Date.now()}`,
      orderNumber,
      customerName: address.fullName,
      customerEmail: address.email,
      customerPhone: address.phone,
      shippingAddress: address,
      items,
      subtotal: pricing.subtotal,
      discount: pricing.discount,
      discountCode: pricing.discountCode,
      shipping: pricing.shipping,
      tax: pricing.tax,
      total: pricing.total,
      status: 'Paid',
      paymentMethod,
      paymentId: `pay_rzp_${Math.random().toString(36).substring(2, 10)}`,
      trackingCourier: 'BlueDart Air Express',
      estimatedDeliveryDate: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toLocaleDateString(
        'en-US',
        { month: 'short', day: 'numeric', year: 'numeric' }
      ),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Commit order and clear cart
    storage.createOrder(newOrder);
    storage.clearCart();
    storage.setAppliedDiscount('');

    // Confetti celebration
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch {
      // ignore
    }

    setIsProcessing(false);
    onSuccess(newOrder);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Checkout Stepper Progress */}
      <div className="mb-8">
        <div className="flex items-center justify-center gap-2 sm:gap-6 text-xs font-semibold">
          <div className={`flex items-center gap-2 ${step >= 1 ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 1 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              1
            </span>
            <span>Shipping</span>
          </div>

          <span className="w-8 sm:w-16 h-px bg-stone-300" />

          <div className={`flex items-center gap-2 ${step >= 2 ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step >= 2 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              2
            </span>
            <span>Review</span>
          </div>

          <span className="w-8 sm:w-16 h-px bg-stone-300" />

          <div className={`flex items-center gap-2 ${step === 3 ? 'text-stone-900' : 'text-stone-400'}`}>
            <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
              step === 3 ? 'bg-stone-900 text-white' : 'bg-stone-200 text-stone-600'
            }`}>
              3
            </span>
            <span>Payment</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Step Interactive Forms */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs">
          {/* STEP 1: Address */}
          {step === 1 && (
            <form onSubmit={handleNextToReview} className="space-y-4">
              <div>
                <h3 className="text-lg font-bold font-display text-stone-950">
                  Shipping & Contact Details
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Where should we ship your handcrafted custom magnets?
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={address.fullName}
                    onChange={(e) => setAddress({ ...address, fullName: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">
                    Phone (for Courier Tracking updates) *
                  </label>
                  <input
                    type="tel"
                    required
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  required
                  value={address.email}
                  onChange={(e) => setAddress({ ...address, email: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Address Line 1 (Flat, House no., Building) *
                </label>
                <input
                  type="text"
                  required
                  value={address.addressLine1}
                  onChange={(e) => setAddress({ ...address, addressLine1: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Address Line 2 (Area, Street, Landmark)
                </label>
                <input
                  type="text"
                  value={address.addressLine2 || ''}
                  onChange={(e) => setAddress({ ...address, addressLine2: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">City *</label>
                  <input
                    type="text"
                    required
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">State *</label>
                  <input
                    type="text"
                    required
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold text-stone-800 block mb-1">PIN Code *</label>
                  <input
                    type="text"
                    required
                    value={address.postalCode}
                    onChange={(e) => setAddress({ ...address, postalCode: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900 font-mono"
                  />
                </div>
              </div>

              <div className="pt-4 flex justify-between items-center">
                <button
                  type="button"
                  onClick={onBackToCart}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Bag
                </button>

                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>Continue to Review</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          )}

          {/* STEP 2: Review Order */}
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-display text-stone-950">Review Your Order</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Confirm shipping address and customized designs before payment.
                </p>
              </div>

              {/* Delivery Destination card */}
              <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 text-xs space-y-1">
                <div className="flex justify-between items-center text-stone-900 font-bold mb-1">
                  <span>Shipping Address:</span>
                  <button
                    onClick={() => setStep(1)}
                    className="text-emerald-700 hover:underline font-normal text-[11px]"
                  >
                    Edit
                  </button>
                </div>
                <p className="font-semibold text-stone-900">{address.fullName} ({address.phone})</p>
                <p className="text-stone-600">
                  {address.addressLine1}, {address.addressLine2 && `${address.addressLine2}, `}
                  {address.city}, {address.state} - {address.postalCode}
                </p>
              </div>

              {/* Itemized summary */}
              <div className="space-y-3">
                <span className="text-xs font-bold text-stone-900 uppercase tracking-wider block">
                  Items to Craft:
                </span>
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-3 p-3 bg-white border border-stone-200 rounded-xl text-xs"
                  >
                    <img
                      src={item.customDesign?.previewImageUrl || item.product.images[0]}
                      alt={item.product.name}
                      className="w-14 h-14 rounded-lg object-cover bg-stone-100 shrink-0"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between font-semibold text-stone-900">
                        <span>{item.customDesign?.magnetText || item.product.name}</span>
                        <span className="font-mono tabular-nums">
                          {formatCurrency(item.price * item.quantity)}
                        </span>
                      </div>
                      <p className="text-stone-500 text-[11px]">
                        Qty: {item.quantity} · {item.variant.sizeLabel} · {item.variant.material}
                      </p>
                      {item.customDesign?.nfcDestinationUrl && (
                        <p className="text-emerald-700 text-[11px] font-mono mt-0.5 truncate max-w-xs">
                          NFC Destination: {item.customDesign.nfcDestinationUrl}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-4 flex justify-between items-center border-t border-stone-200">
                <button
                  onClick={() => setStep(1)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Address
                </button>

                <button
                  onClick={() => setStep(3)}
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-3 px-6 rounded-xl transition-colors flex items-center gap-2"
                >
                  <span>Proceed to Payment ({formatCurrency(pricing.total)})</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: Payment */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold font-display text-stone-950">
                  Select Payment Method
                </h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Secured by Razorpay. 100% encrypted bank-grade authentication.
                </p>
              </div>

              {/* Payment selector */}
              <div className="space-y-2.5">
                {[
                  {
                    id: 'razorpay',
                    title: 'Razorpay All-in-One Gateway',
                    desc: 'UPI, Google Pay, Cards, NetBanking, PayTM',
                    icon: ShieldCheck,
                  },
                  {
                    id: 'upi',
                    title: 'Instant UPI (Google Pay / PhonePe / CRED)',
                    desc: 'Zero payment processing fees',
                    icon: QrCode,
                  },
                  {
                    id: 'card',
                    title: 'Credit / Debit Card',
                    desc: 'Visa, Mastercard, RuPay, Amex',
                    icon: CreditCard,
                  },
                ].map((opt) => (
                  <button
                    key={opt.id}
                    onClick={() => setPaymentMethod(opt.id as typeof paymentMethod)}
                    className={`w-full p-4 rounded-xl border text-left flex items-start gap-3 transition-all ${
                      paymentMethod === opt.id
                        ? 'border-stone-900 bg-stone-50 shadow-xs'
                        : 'border-stone-200 bg-white hover:border-stone-300'
                    }`}
                  >
                    <opt.icon className="w-5 h-5 text-stone-900 shrink-0 mt-0.5" />
                    <div className="flex-1">
                      <div className="text-xs font-bold text-stone-900">{opt.title}</div>
                      <div className="text-[11px] text-stone-500 mt-0.5">{opt.desc}</div>
                    </div>
                  </button>
                ))}
              </div>

              {/* Payment specific details */}
              {paymentMethod === 'upi' && (
                <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 text-xs space-y-2">
                  <label className="font-semibold text-stone-800 block">Your UPI VPA / ID:</label>
                  <input
                    type="text"
                    value={upiId}
                    onChange={(e) => setUpiId(e.target.value)}
                    placeholder="mobile@okhdfcbank"
                    className="w-full bg-white border border-stone-300 rounded-lg p-2.5 text-xs font-mono"
                  />
                  <p className="text-[11px] text-stone-500">
                    A payment prompt of {formatCurrency(pricing.total)} will be sent to your UPI app.
                  </p>
                </div>
              )}

              {/* Failure Simulator Toggle for QA Edge Case Testing */}
              <div className="p-3 bg-stone-100 rounded-xl text-xs flex items-center justify-between">
                <div>
                  <span className="font-bold text-stone-800">Edge Case QA Toggle:</span>
                  <span className="text-stone-500 ml-2">Simulate Declined Payment</span>
                </div>
                <input
                  type="checkbox"
                  checked={failSimulation}
                  onChange={(e) => setFailSimulation(e.target.checked)}
                  className="accent-rose-600 cursor-pointer"
                />
              </div>

              {paymentError && (
                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold">Transaction Failed:</span>
                    <p className="text-[11px] mt-0.5">{paymentError}</p>
                  </div>
                </div>
              )}

              <div className="pt-4 flex justify-between items-center border-t border-stone-200">
                <button
                  onClick={() => setStep(2)}
                  className="text-xs font-semibold text-stone-500 hover:text-stone-900 flex items-center gap-1"
                >
                  <ArrowLeft className="w-3.5 h-3.5" /> Back to Review
                </button>

                <button
                  onClick={handleExecutePayment}
                  disabled={isProcessing}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs sm:text-sm py-3 px-8 rounded-xl transition-all shadow-md flex items-center gap-2 disabled:opacity-50"
                >
                  <Lock className="w-4 h-4" />
                  <span>
                    {isProcessing ? 'Verifying with Razorpay...' : `Pay ${formatCurrency(pricing.total)}`}
                  </span>
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right: Transparent Cost Breakdown */}
        <div className="lg:col-span-5 bg-stone-50 p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs h-fit space-y-4">
          <h4 className="text-sm font-bold font-display text-stone-950 uppercase tracking-wider">
            Order Summary ({pricing.itemCount} Magnets)
          </h4>

          <div className="space-y-2 text-xs text-stone-600 pt-2 border-t border-stone-200">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span className="font-mono tabular-nums text-stone-900">
                {formatCurrency(pricing.subtotal)}
              </span>
            </div>

            {pricing.discount > 0 && (
              <div className="flex justify-between text-emerald-800 font-semibold">
                <span>Discount ({pricing.discountCode})</span>
                <span className="font-mono tabular-nums">
                  -{formatCurrency(pricing.discount)}
                </span>
              </div>
            )}

            <div className="flex justify-between">
              <span>Express Delivery</span>
              <span className="font-mono tabular-nums text-stone-900">
                {pricing.shipping === 0 ? 'FREE' : formatCurrency(pricing.shipping)}
              </span>
            </div>

            <div className="flex justify-between text-stone-400 text-[11px]">
              <span>Taxes (18% GST inclusive)</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(pricing.tax)}
              </span>
            </div>

            <div className="pt-3 border-t border-stone-200 flex justify-between text-base font-bold text-stone-950">
              <span>Grand Total</span>
              <span className="font-mono tabular-nums">
                {formatCurrency(pricing.total)}
              </span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-200 space-y-2 text-[11px] text-stone-500">
            <div className="flex items-center gap-2">
              <Truck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Free reprint if damaged in transit</span>
            </div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              <span>Lifetime hosting of your Smart Link Hub included</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
