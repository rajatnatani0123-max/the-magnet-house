import React, { useState } from 'react';
import { Heart, Eye, Sparkles, Wand2 } from 'lucide-react';
import { Product } from '../types';
import { formatCurrency } from '../lib/pricing';
import { storage } from '../lib/storage';

interface ProductCardProps {
  product: Product;
  onSelect: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onSelect,
  onQuickView,
  onCustomize,
}) => {
  const [isWishlisted, setIsWishlisted] = useState(() =>
    storage.getWishlist().includes(product.id)
  );

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    const newState = storage.toggleWishlist(product.id);
    setIsWishlisted(newState);
  };

  const primaryBadge = product.badges?.[0];

  return (
    <div
      onClick={() => onSelect(product)}
      className="group cursor-pointer rounded-xl bg-white border border-stone-200/80 overflow-hidden transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md flex flex-col h-full"
    >
      {/* Image Container with 4:3 Aspect Ratio */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={product.images[0]}
          alt={product.name}
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center transition-transform duration-300 group-hover:scale-103"
          loading="lazy"
        />

        {/* Minimal text badge (Max 1 subtle tag, never candy pill clusters) */}
        {primaryBadge && (
          <div className="absolute top-3 left-3 bg-stone-900/90 text-white text-[11px] font-medium tracking-wider uppercase px-2.5 py-1 rounded-sm backdrop-blur-xs">
            {primaryBadge}
          </div>
        )}

        {/* Wishlist button */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 p-2 rounded-full transition-colors ${
            isWishlisted
              ? 'bg-rose-50 text-rose-600'
              : 'bg-white/80 backdrop-blur-xs text-stone-700 hover:text-rose-600 hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick actions hover overlay on desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden sm:flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onQuickView(product);
            }}
            className="flex-1 bg-white/95 backdrop-blur-md text-stone-900 text-xs font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-white flex items-center justify-center gap-1.5 transition-colors"
          >
            <Eye className="w-3.5 h-3.5" />
            <span>Quick View</span>
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onCustomize(product);
            }}
            className="flex-1 bg-stone-900 text-white text-xs font-semibold py-2 px-3 rounded-lg shadow-sm hover:bg-stone-800 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Wand2 className="w-3.5 h-3.5" />
            <span>Customize</span>
          </button>
        </div>
      </div>

      {/* Card Content */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed Metadata without pills */}
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1.5 capitalize">
            <span>{product.material}</span>
            <span aria-hidden="true">·</span>
            <span>{product.shapes.join(', ')}</span>
            <span aria-hidden="true">·</span>
            <span className="flex items-center gap-1 text-emerald-700 font-medium">
              <Sparkles className="w-3 h-3" />
              NFC + QR
            </span>
          </div>

          <h3 className="text-sm sm:text-base font-semibold text-stone-900 leading-snug line-clamp-1 group-hover:text-stone-700 transition-colors">
            {product.name}
          </h3>

          <p className="text-xs text-stone-500 line-clamp-2 mt-1 leading-relaxed">
            {product.tagline}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="text-sm sm:text-base font-bold text-stone-950 font-mono tabular-nums">
              {formatCurrency(product.basePrice)}
            </span>
            {product.originalPrice && (
              <span className="text-xs text-stone-400 line-through font-mono tabular-nums">
                {formatCurrency(product.originalPrice)}
              </span>
            )}
          </div>

          <div className="flex items-center gap-1 text-xs text-stone-600">
            <span className="text-amber-500">★</span>
            <span className="font-semibold text-stone-900 font-mono">{product.rating}</span>
            <span className="text-stone-400">({product.reviewCount})</span>
          </div>
        </div>
      </div>
    </div>
  );
};
