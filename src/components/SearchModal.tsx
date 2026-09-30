import React, { useState, useMemo } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { Product } from '../types';
import { formatCurrency } from '../lib/pricing';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct: (product: Product) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectProduct,
}) => {
  const [query, setQuery] = useState('');

  const filteredProducts = useMemo(() => {
    if (!query.trim()) return [];
    const q = query.toLowerCase();
    return INITIAL_PRODUCTS.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tagline.toLowerCase().includes(q) ||
        p.material.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }, [query]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex items-start justify-center pt-20 p-4">
      <div
        className="relative bg-white rounded-2xl max-w-xl w-full overflow-hidden shadow-2xl border border-stone-200"
        role="dialog"
        aria-modal="true"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-stone-200 flex items-center gap-3">
          <Search className="w-5 h-5 text-stone-400 shrink-0" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search custom smart magnets (e.g., acrylic, spotify, wedding)..."
            className="flex-1 bg-transparent text-sm sm:text-base text-stone-900 placeholder:text-stone-400 focus:outline-none"
            autoFocus
          />
          <button
            onClick={onClose}
            className="p-1.5 text-stone-400 hover:text-stone-700 rounded-lg hover:bg-stone-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Container */}
        <div className="p-4 max-h-[60vh] overflow-y-auto">
          {!query.trim() ? (
            <div className="py-6">
              <span className="text-xs font-semibold uppercase tracking-wider text-stone-400 block mb-3">
                Suggested Searches
              </span>
              <div className="flex flex-wrap gap-2">
                {['Couple & Wedding', 'Spotify Soundwave', 'Walnut Wood', 'Travel Polaroid', 'Pet Memorial', 'Business vCard'].map(
                  (tag) => (
                    <button
                      key={tag}
                      onClick={() => setQuery(tag.split(' ')[0])}
                      className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-medium rounded-lg transition-colors"
                    >
                      {tag}
                    </button>
                  )
                )}
              </div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm font-semibold text-stone-800">
                No magnets found matching &quot;{query}&quot;
              </p>
              <p className="text-xs text-stone-500 mt-1">
                Try searching for acrylic, wood, wedding, photo, or spotify.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    onSelectProduct(product);
                    onClose();
                  }}
                  className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-stone-50 transition-colors cursor-pointer border border-transparent hover:border-stone-200 group"
                >
                  <img
                    src={product.images[0]}
                    alt={product.name}
                    className="w-12 h-12 rounded-lg object-cover bg-stone-100 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-stone-700 truncate">
                      {product.name}
                    </h4>
                    <p className="text-[11px] text-stone-500 capitalize">
                      {product.material} · {product.category} · NFC + QR
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    <span className="text-xs sm:text-sm font-bold font-mono text-stone-900 block">
                      {formatCurrency(product.basePrice)}
                    </span>
                    <span className="text-[10px] text-emerald-700 font-medium flex items-center gap-0.5 justify-end">
                      <Sparkles className="w-2.5 h-2.5" /> Ready
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
