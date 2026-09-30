import React from 'react';
import {
  CheckCircle2,
  Package,
  Truck,
  ArrowRight,
  Printer,
  Sparkles,
  ExternalLink,
  ShieldCheck,
} from 'lucide-react';
import { Order } from '../types';
import { formatCurrency } from '../lib/pricing';

interface OrderConfirmationViewProps {
  order: Order;
  onNavigateHome: () => void;
  onViewAccountMagnets: () => void;
  onOpenSmartLink: (slug: string) => void;
}

export const OrderConfirmationView: React.FC<OrderConfirmationViewProps> = ({
  order,
  onNavigateHome,
  onViewAccountMagnets,
  onOpenSmartLink,
}) => {
  const handlePrintInvoice = () => {
    window.print();
  };

  const statusSteps = [
    { title: 'Paid', date: 'Just now', done: true },
    { title: 'Design Review', date: 'Next 2 hours', done: true },
    { title: 'Laser Production', date: 'Tomorrow', done: false },
    { title: 'Shipped', date: 'In 2 days', done: false },
    { title: 'Delivered', date: order.estimatedDeliveryDate, done: false },
  ];

  const firstCustomSlug = order.items.find((i) => i.customDesign?.smartLinkSlug)?.customDesign
    ?.smartLinkSlug;

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16">
      {/* Success Badge Banner */}
      <div className="text-center space-y-3 mb-10">
        <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto text-emerald-600 shadow-xs">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800 bg-emerald-50 px-3 py-1 rounded-full">
          Payment Confirmed · Razorpay ID: {order.paymentId}
        </span>

        <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-950">
          Order #{order.orderNumber}
        </h1>

        <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
          Thank you, <strong>{order.customerName}</strong>! We have received your custom designs and our Mumbai workshop is preparing the laser print & NFC encoding.
        </p>

        <div className="flex justify-center gap-3 pt-2">
          <button
            onClick={handlePrintInvoice}
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition-colors border border-stone-300"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Tax Invoice</span>
          </button>

          {firstCustomSlug && (
            <button
              onClick={() => onOpenSmartLink(firstCustomSlug)}
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-emerald-700 hover:bg-emerald-600 text-white text-xs font-semibold rounded-xl transition-colors shadow-xs"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Preview Live Smart Hub (/m/{firstCustomSlug})</span>
            </button>
          )}
        </div>
      </div>

      {/* Production & Shipment Tracker */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs mb-8">
        <h3 className="text-sm font-bold font-display text-stone-900 mb-6 flex items-center gap-2">
          <Package className="w-4 h-4 text-stone-600" />
          <span>Fulfillment & Delivery Progression</span>
        </h3>

        <div className="grid grid-cols-5 gap-2 relative text-center">
          {statusSteps.map((step, idx) => (
            <div key={idx} className="flex flex-col items-center">
              <div
                className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold mb-2 ${
                  step.done
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-100 text-stone-400 border border-stone-300'
                }`}
              >
                {step.done ? '✓' : idx + 1}
              </div>
              <span className={`text-[11px] font-semibold leading-tight ${step.done ? 'text-stone-900' : 'text-stone-400'}`}>
                {step.title}
              </span>
              <span className="text-[10px] text-stone-400 mt-0.5">{step.date}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Items in this Order */}
      <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs space-y-6">
        <div className="flex justify-between items-center pb-4 border-b border-stone-100">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Purchased Smart Magnets
            </h4>
            <span className="text-[11px] text-stone-500">
              Courier: {order.trackingCourier} (Est. {order.estimatedDeliveryDate})
            </span>
          </div>
          <button
            onClick={onViewAccountMagnets}
            className="text-xs font-semibold text-emerald-700 hover:underline flex items-center gap-1"
          >
            <span>Manage All in Dashboard</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-4">
          {order.items.map((item) => (
            <div key={item.id} className="flex gap-4 items-center">
              <img
                src={item.customDesign?.previewImageUrl || item.product.images[0]}
                alt={item.product.name}
                className="w-16 h-16 rounded-xl object-cover bg-stone-100 border border-stone-200 shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h5 className="text-xs sm:text-sm font-bold text-stone-900 truncate">
                  {item.customDesign?.magnetText || item.product.name}
                </h5>
                <p className="text-[11px] text-stone-500">
                  {item.variant.sizeLabel} · {item.variant.material} · Qty {item.quantity}
                </p>
                {item.customDesign?.nfcDestinationUrl && (
                  <p className="text-[11px] text-emerald-700 font-mono mt-0.5 truncate">
                    NFC Target: {item.customDesign.nfcDestinationUrl}
                  </p>
                )}
              </div>
              <div className="text-right">
                <span className="text-xs sm:text-sm font-mono font-bold text-stone-950">
                  {formatCurrency(item.price * item.quantity)}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Pricing breakdown */}
        <div className="pt-4 border-t border-stone-100 space-y-1.5 text-xs text-stone-600">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span className="font-mono tabular-nums text-stone-900">{formatCurrency(order.subtotal)}</span>
          </div>
          {order.discount > 0 && (
            <div className="flex justify-between text-emerald-800">
              <span>Discount ({order.discountCode})</span>
              <span className="font-mono tabular-nums">-{formatCurrency(order.discount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span className="font-mono tabular-nums text-stone-900">
              {order.shipping === 0 ? 'FREE' : formatCurrency(order.shipping)}
            </span>
          </div>
          <div className="flex justify-between text-stone-400 text-[11px]">
            <span>18% GST (Tax Invoice Included)</span>
            <span className="font-mono tabular-nums">{formatCurrency(order.tax)}</span>
          </div>
          <div className="pt-2 border-t border-stone-200 flex justify-between font-bold text-stone-950 text-sm">
            <span>Total Paid</span>
            <span className="font-mono tabular-nums">{formatCurrency(order.total)}</span>
          </div>
        </div>

        {/* Shipping address details */}
        <div className="pt-4 border-t border-stone-100 text-xs">
          <span className="font-bold text-stone-900 block mb-1">Delivering to:</span>
          <p className="text-stone-600 leading-relaxed">
            {order.shippingAddress.fullName}, {order.shippingAddress.addressLine1},{' '}
            {order.shippingAddress.addressLine2 && `${order.shippingAddress.addressLine2}, `}
            {order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.postalCode}
          </p>
        </div>
      </div>

      <div className="mt-8 text-center">
        <button
          onClick={onNavigateHome}
          className="text-xs font-semibold text-stone-700 hover:text-stone-950 underline"
        >
          ← Return to Storefront
        </button>
      </div>
    </div>
  );
};
