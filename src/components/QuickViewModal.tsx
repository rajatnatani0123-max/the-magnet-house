import React, { useState } from 'react';
import { X, Check, ShoppingBag, Wand2, ShieldCheck, Sparkles } from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../lib/pricing';
import { storage } from '../lib/storage';

interface QuickViewModalProps {
  product: Product | null;
  onClose: () => void;
  onCustomize: (product: Product) => void;
  onOpenCart: () => void;
}

export const QuickViewModal: React.FC<QuickViewModalProps> = ({
  product,
  onClose,
  onCustomize,
  onOpenCart,
}) => {
  if (!product) return null;

  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [selectedImage, setSelectedImage] = useState(product.images[0]);
  const [addedAnimation, setAddedAnimation] = useState(false);

  const handleAddToCart = () => {
    storage.addToCart({
      id: `ci-${Date.now()}`,
      productId: product.id,
      product: product,
      variant: selectedVariant,
      quantity: 1,
      price: selectedVariant.price,
    });
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      onClose();
      onOpenCart();
    }, 450);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div
        className="relative bg-white rounded-2xl max-w-2xl w-full overflow-hidden shadow-2xl border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 p-2 text-stone-400 hover:text-stone-700 bg-white/80 rounded-full transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Product Media */}
          <div className="bg-stone-100 p-6 flex flex-col justify-center items-center">
            <div className="aspect-square w-full rounded-xl overflow-hidden shadow-sm bg-white">
              <img
                src={selectedImage}
                alt={product.name}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {product.images.length > 1 && (
              <div className="flex gap-2 mt-3">
                {product.images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(img)}
                    className={`w-14 h-14 rounded-lg overflow-hidden border-2 transition-all ${
                      selectedImage === img ? 'border-stone-900' : 'border-transparent opacity-70 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details & Purchase */}
          <div className="p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wide">
                <span>{product.material}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-medium flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> NFC + QR Included
                </span>
              </div>

              <h2 className="text-lg font-bold text-stone-900 mt-1 font-display">
                {product.name}
              </h2>

              <div className="flex items-baseline gap-2 mt-2">
                <span className="text-xl font-bold font-mono text-stone-950">
                  {formatCurrency(selectedVariant.price)}
                </span>
                {selectedVariant.originalPrice && (
                  <span className="text-sm text-stone-400 line-through font-mono">
                    {formatCurrency(selectedVariant.originalPrice)}
                  </span>
                )}
              </div>

              <p className="text-xs text-stone-600 mt-3 leading-relaxed">
                {product.description}
              </p>

              {/* Variant Selector */}
              <div className="mt-5">
                <label className="text-xs font-semibold text-stone-800 block mb-2">
                  Select Size & Dimensions:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {product.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                        selectedVariant.id === variant.id
                          ? 'border-stone-950 bg-stone-950 text-white font-medium'
                          : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div className="font-semibold">{variant.sizeLabel}</div>
                      <div className="opacity-80 text-[11px] font-mono">{formatCurrency(variant.price)}</div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Stock Indicator */}
              <div className="mt-4 flex items-center gap-2 text-xs text-emerald-700 font-medium">
                <Check className="w-3.5 h-3.5" />
                <span>In Stock & ready for custom laser print</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col gap-2">
              <button
                onClick={() => {
                  onClose();
                  onCustomize(product);
                }}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2 shadow-xs"
              >
                <Wand2 className="w-4 h-4" />
                <span>Customize In Studio</span>
              </button>

              <button
                onClick={handleAddToCart}
                disabled={addedAnimation}
                className="w-full bg-white hover:bg-stone-50 text-stone-900 border border-stone-300 py-2.5 px-4 rounded-lg font-semibold text-sm transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{addedAnimation ? 'Added to Bag!' : 'Add to Bag (Standard)'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
