import React, { useState, useMemo } from 'react';
import { SlidersHorizontal, X, RotateCcw } from 'lucide-react';
import { INITIAL_PRODUCTS } from '../data/products';
import { Product, MagnetMaterial, MagnetShape, ProductTheme } from '../types';
import { ProductCard } from '../components/ProductCard';

interface ShopViewProps {
  initialCategory?: string;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const ShopView: React.FC<ShopViewProps> = ({
  initialCategory,
  onSelectProduct,
  onQuickView,
  onCustomize,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>(initialCategory || 'all');
  const [selectedMaterial, setSelectedMaterial] = useState<string>('all');
  const [selectedShape, setSelectedShape] = useState<string>('all');
  const [maxPrice, setMaxPrice] = useState<number>(1200);
  const [sortBy, setSortBy] = useState<'popular' | 'rating' | 'price-asc' | 'price-desc'>('popular');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const categories: { id: string; label: string }[] = [
    { id: 'all', label: 'All Magnets' },
    { id: 'couple', label: 'Couples & Dating' },
    { id: 'wedding', label: 'Wedding Keepsakes' },
    { id: 'spotify', label: 'Spotify & Music' },
    { id: 'travel', label: 'Travel Polaroids' },
    { id: 'family', label: 'Family & Milestones' },
    { id: 'pets', label: 'Pets & Memorials' },
    { id: 'business', label: 'Smart Business vCard' },
    { id: 'custom', label: 'Quotes & Custom' },
  ];

  const materials: { id: string; label: string }[] = [
    { id: 'all', label: 'All Materials' },
    { id: 'acrylic', label: 'Diamond Acrylic' },
    { id: 'wood', label: 'Walnut Wood' },
    { id: 'metal', label: 'Matte Aluminum' },
    { id: 'polaroid', label: 'Polaroid PVC' },
  ];

  const shapes: { id: string; label: string }[] = [
    { id: 'all', label: 'All Shapes' },
    { id: 'square', label: 'Square' },
    { id: 'rectangle', label: 'Rectangle' },
    { id: 'circle', label: 'Round' },
    { id: 'arch', label: 'Royal Arch' },
  ];

  const filteredProducts = useMemo(() => {
    return INITIAL_PRODUCTS.filter((product) => {
      if (selectedCategory !== 'all' && product.category !== (selectedCategory as ProductTheme)) {
        return false;
      }
      if (selectedMaterial !== 'all' && product.material !== (selectedMaterial as MagnetMaterial)) {
        return false;
      }
      if (selectedShape !== 'all' && !product.shapes.includes(selectedShape as MagnetShape)) {
        return false;
      }
      if (product.basePrice > maxPrice) {
        return false;
      }
      return true;
    }).sort((a, b) => {
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'price-asc') return a.basePrice - b.basePrice;
      if (sortBy === 'price-desc') return b.basePrice - a.basePrice;
      return b.reviewCount - a.reviewCount; // popular
    });
  }, [selectedCategory, selectedMaterial, selectedShape, maxPrice, sortBy]);

  const resetFilters = () => {
    setSelectedCategory('all');
    setSelectedMaterial('all');
    setSelectedShape('all');
    setMaxPrice(1200);
    setSortBy('popular');
  };

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedMaterial !== 'all' || selectedShape !== 'all' || maxPrice < 1200;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Title & Header */}
      <div className="border-b border-stone-200 pb-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Catalog & Collections
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold font-display text-stone-950 mt-1">
            Smart Fridge Magnets
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1">
            Choose a canvas. Personalize with your photo. Program your NFC & QR destination.
          </p>
        </div>

        {/* Sort & Mobile filter trigger */}
        <div className="flex items-center gap-3 self-start md:self-auto">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="md:hidden flex items-center gap-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold px-3 py-2 rounded-lg transition-colors border border-stone-300"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Filters {hasActiveFilters && '(Active)'}</span>
          </button>

          <div className="flex items-center gap-2 text-xs">
            <span className="text-stone-500 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as typeof sortBy)}
              className="bg-white border border-stone-300 rounded-lg px-3 py-2 text-xs text-stone-900 focus:outline-none focus:ring-1 focus:ring-stone-900"
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Desktop Filter Sidebar */}
        <div className="hidden md:block space-y-6 pr-4">
          <div className="flex items-center justify-between pb-3 border-b border-stone-200">
            <span className="text-xs font-bold uppercase tracking-wider text-stone-900">
              Filters
            </span>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-950 flex items-center gap-1"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset All</span>
              </button>
            )}
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-semibold text-stone-900 mb-2.5">Category Theme</h4>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedCategory === cat.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{cat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Material */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-semibold text-stone-900 mb-2.5">Material & Finish</h4>
            <div className="space-y-1">
              {materials.map((mat) => (
                <button
                  key={mat.id}
                  onClick={() => setSelectedMaterial(mat.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedMaterial === mat.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{mat.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Shape */}
          <div className="pt-4 border-t border-stone-100">
            <h4 className="text-xs font-semibold text-stone-900 mb-2.5">Silhouette</h4>
            <div className="space-y-1">
              {shapes.map((sh) => (
                <button
                  key={sh.id}
                  onClick={() => setSelectedShape(sh.id)}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between ${
                    selectedShape === sh.id
                      ? 'bg-stone-900 text-white font-medium'
                      : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
                  }`}
                >
                  <span>{sh.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Price Range */}
          <div className="pt-4 border-t border-stone-100">
            <div className="flex justify-between items-center mb-2">
              <h4 className="text-xs font-semibold text-stone-900">Max Price</h4>
              <span className="text-xs font-mono font-bold text-stone-900">
                ₹{maxPrice}
              </span>
            </div>
            <input
              type="range"
              min="499"
              max="1200"
              step="50"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number(e.target.value))}
              className="w-full accent-stone-900 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 font-mono mt-1">
              <span>₹499</span>
              <span>₹1,200</span>
            </div>
          </div>
        </div>

        {/* Product Grid Area */}
        <div className="md:col-span-3">
          <div className="mb-4 text-xs text-stone-500 font-mono">
            Showing {filteredProducts.length} smart magnets
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center">
              <h3 className="text-base font-semibold text-stone-900">No magnets match your filters</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Try widening your price range or clearing material filters.
              </p>
              <button
                onClick={resetFilters}
                className="mt-4 px-4 py-2 bg-stone-900 text-white text-xs font-semibold rounded-lg hover:bg-stone-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onSelect={onSelectProduct}
                  onQuickView={onQuickView}
                  onCustomize={onCustomize}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-xs bg-white h-full p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="text-sm font-bold text-stone-900 font-display">Filters</h3>
                <button onClick={() => setMobileFilterOpen(false)}>
                  <X className="w-5 h-5 text-stone-500" />
                </button>
              </div>

              {/* Mobile categories */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-stone-900 mb-2">Category</h4>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Material */}
              <div className="mt-4">
                <h4 className="text-xs font-semibold text-stone-900 mb-2">Material</h4>
                <select
                  value={selectedMaterial}
                  onChange={(e) => setSelectedMaterial(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                >
                  {materials.map((m) => (
                    <option key={m.id} value={m.id}>{m.label}</option>
                  ))}
                </select>
              </div>

              {/* Mobile Price */}
              <div className="mt-6">
                <div className="flex justify-between text-xs mb-1">
                  <span>Max Price:</span>
                  <span className="font-mono font-bold">₹{maxPrice}</span>
                </div>
                <input
                  type="range"
                  min="499"
                  max="1200"
                  step="50"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-stone-900"
                />
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 flex gap-2">
              <button
                onClick={resetFilters}
                className="flex-1 py-2 text-xs font-semibold border border-stone-300 rounded-lg text-stone-700"
              >
                Reset
              </button>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="flex-1 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg"
              >
                Show {filteredProducts.length} Results
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
