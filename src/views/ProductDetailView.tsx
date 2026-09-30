import React, { useState } from 'react';
import {
  Wand2,
  ShoppingBag,
  Sparkles,
  ShieldCheck,
  Truck,
  RotateCcw,
  Check,
  ChevronDown,
  ChevronUp,
  Heart,
  Share2,
} from 'lucide-react';
import { Product, ProductVariant } from '../types';
import { formatCurrency } from '../lib/pricing';
import { storage } from '../lib/storage';
import { ProductCard } from '../components/ProductCard';
import { INITIAL_PRODUCTS } from '../data/products';

interface ProductDetailViewProps {
  product: Product;
  onCustomize: (product: Product) => void;
  onOpenCart: () => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
}

export const ProductDetailView: React.FC<ProductDetailViewProps> = ({
  product,
  onCustomize,
  onOpenCart,
  onSelectProduct,
  onQuickView,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeImage, setActiveImage] = useState(product.images[0]);
  const [addedAnimation, setAddedAnimation] = useState(false);
  const [openAccordion, setOpenAccordion] = useState<string>('specs');
  const [isWishlisted, setIsWishlisted] = useState(() =>
    storage.getWishlist().includes(product.id)
  );

  // Reviews state
  const [reviews, setReviews] = useState(() => storage.getReviews(product.id));
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [newReviewAuthor, setNewReviewAuthor] = useState('');
  const [newReviewRating, setNewReviewRating] = useState(5);
  const [newReviewTitle, setNewReviewTitle] = useState('');
  const [newReviewComment, setNewReviewComment] = useState('');

  const crossSells = INITIAL_PRODUCTS.filter((p) => p.id !== product.id).slice(0, 3);

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
      onOpenCart();
    }, 400);
  };

  const handleToggleWishlist = () => {
    const newState = storage.toggleWishlist(product.id);
    setIsWishlisted(newState);
  };

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReviewAuthor || !newReviewComment) return;

    storage.addReview({
      productId: product.id,
      authorName: newReviewAuthor,
      rating: newReviewRating,
      title: newReviewTitle || 'Wonderful custom magnet',
      comment: newReviewComment,
      verifiedPurchase: true,
    });

    setReviews(storage.getReviews(product.id));
    setShowReviewModal(false);
    setNewReviewAuthor('');
    setNewReviewTitle('');
    setNewReviewComment('');
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Breadcrumb navigation */}
      <div className="text-xs text-stone-500 mb-6 flex items-center gap-2">
        <span className="cursor-pointer hover:underline" onClick={() => window.history.back()}>
          Catalog
        </span>
        <span aria-hidden="true">/</span>
        <span className="capitalize">{product.category}</span>
        <span aria-hidden="true">/</span>
        <span className="text-stone-900 font-medium truncate max-w-xs">{product.name}</span>
      </div>

      {/* Main PDP Grid: Left Gallery, Right Contiguous Purchase Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
        {/* Left: Gallery */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-square w-full rounded-2xl overflow-hidden bg-stone-100 border border-stone-200/80 shadow-xs relative">
            <img
              src={activeImage}
              alt={product.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-all duration-300"
            />
            {product.badges?.[0] && (
              <span className="absolute top-4 left-4 bg-stone-900/90 backdrop-blur-xs text-white text-xs font-semibold uppercase tracking-wider px-3 py-1 rounded-sm">
                {product.badges[0]}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(img)}
                  className={`w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                    activeImage === img
                      ? 'border-stone-950 shadow-xs'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="Thumb" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Trust Guarantees */}
          <div className="grid grid-cols-3 gap-4 pt-6 border-t border-stone-200 text-xs text-stone-600">
            <div className="flex items-center gap-2">
              <Truck className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>Ships in {product.productionTime}</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-sky-700 shrink-0" />
              <span>N52 Heavy Duty Core</span>
            </div>
            <div className="flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-amber-700 shrink-0" />
              <span>100% Print Guarantee</span>
            </div>
          </div>
        </div>

        {/* Right: Contiguous Purchase Module */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wide">
                <span>{product.material}</span>
                <span aria-hidden="true">·</span>
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5" /> NFC + QR Included
                </span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleToggleWishlist}
                  className={`p-2 rounded-full border border-stone-200 transition-colors ${
                    isWishlisted ? 'text-rose-600 bg-rose-50' : 'text-stone-500 hover:text-stone-900'
                  }`}
                  aria-label="Wishlist"
                >
                  <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
                </button>
                <button
                  onClick={() => navigator.clipboard?.writeText(window.location.href)}
                  className="p-2 rounded-full border border-stone-200 text-stone-500 hover:text-stone-900 transition-colors"
                  aria-label="Share"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 mt-2 leading-tight">
              {product.name}
            </h1>

            {/* Rating breakdown line */}
            <div className="flex items-center gap-2 mt-2 text-xs">
              <div className="flex text-amber-500">
                {'★'.repeat(Math.round(product.rating))}
              </div>
              <span className="font-bold text-stone-900 font-mono">{product.rating}</span>
              <span className="text-stone-400">·</span>
              <a href="#reviews" className="text-stone-600 hover:text-stone-900 underline">
                {product.reviewCount} customer reviews
              </a>
            </div>

            {/* Dynamic Price */}
            <div className="flex items-baseline gap-3 mt-4">
              <span className="text-3xl font-extrabold font-mono tabular-nums text-stone-950">
                {formatCurrency(selectedVariant.price)}
              </span>
              {selectedVariant.originalPrice && (
                <span className="text-base text-stone-400 line-through font-mono tabular-nums">
                  {formatCurrency(selectedVariant.originalPrice)}
                </span>
              )}
              <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 rounded-sm">
                Save {formatCurrency((selectedVariant.originalPrice || 0) - selectedVariant.price)}
              </span>
            </div>

            <p className="text-xs text-stone-500 mt-1">
              All taxes included · Includes permanent NFC programming & QR Smart Link hosting.
            </p>
          </div>

          <p className="text-xs sm:text-sm text-stone-600 leading-relaxed border-t border-stone-100 pt-4">
            {product.description}
          </p>

          {/* Variant Selector: Size & Shape */}
          <div className="space-y-3 pt-2">
            <div className="flex justify-between text-xs font-semibold text-stone-900">
              <span>Choose Size & Ratio:</span>
              <span className="text-stone-500 font-normal">{selectedVariant.dimensions}</span>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedVariant.id === v.id
                      ? 'border-stone-950 bg-stone-950 text-white shadow-xs'
                      : 'border-stone-200 bg-white text-stone-800 hover:border-stone-400'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{v.sizeLabel}</div>
                  <div className="text-[11px] font-mono mt-0.5 opacity-80">
                    {formatCurrency(v.price)}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* In-Stock Indicator */}
          <div className="flex items-center gap-2 text-xs text-emerald-700 font-medium">
            <Check className="w-4 h-4 text-emerald-600" />
            <span>Ready for custom engraving in our Mumbai lab ({product.productionTime})</span>
          </div>

          {/* Primary Purchase CTAs */}
          <div className="space-y-2.5 pt-2">
            <button
              onClick={() => onCustomize(product)}
              className="w-full bg-stone-950 hover:bg-stone-800 text-white py-3.5 px-6 rounded-xl font-bold text-sm transition-all shadow-md flex items-center justify-center gap-2 group active:scale-98"
            >
              <Wand2 className="w-4 h-4" />
              <span>Customize & Buy in Studio</span>
            </button>

            <button
              onClick={handleAddToCart}
              disabled={addedAnimation}
              className="w-full bg-white hover:bg-stone-50 text-stone-950 border border-stone-300 py-3.5 px-6 rounded-xl font-semibold text-sm transition-colors flex items-center justify-center gap-2"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{addedAnimation ? 'Added to Bag!' : 'Add to Bag (Standard Variant)'}</span>
            </button>
          </div>

          {/* Specifications Accordion */}
          <div className="border-t border-stone-200 pt-4 space-y-2 text-xs">
            <button
              onClick={() => setOpenAccordion(openAccordion === 'specs' ? '' : 'specs')}
              className="w-full flex items-center justify-between py-2 text-stone-900 font-semibold text-left"
            >
              <span>Physical Specifications & Materials</span>
              {openAccordion === 'specs' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordion === 'specs' && (
              <div className="pb-3 text-stone-600 space-y-2 pl-1">
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Material Grade:</span>
                  <span className="font-medium text-stone-900 capitalize">{product.material}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Magnetic Strength:</span>
                  <span className="font-medium text-stone-900">{product.magnetStrength}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Weight:</span>
                  <span className="font-medium text-stone-900">{product.weight}</span>
                </div>
                <div className="flex justify-between py-1 border-b border-stone-100">
                  <span className="text-stone-500">Print Process:</span>
                  <span className="font-medium text-stone-900">Archival 8-Color Pigment UV Cure</span>
                </div>
              </div>
            )}

            <button
              onClick={() => setOpenAccordion(openAccordion === 'nfc' ? '' : 'nfc')}
              className="w-full flex items-center justify-between py-2 text-stone-900 font-semibold text-left border-t border-stone-100"
            >
              <span>NFC & QR Technology Guide</span>
              {openAccordion === 'nfc' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
            </button>
            {openAccordion === 'nfc' && (
              <div className="pb-3 text-stone-600 space-y-2 pl-1 leading-relaxed">
                <p>
                  <strong>NTAG213 Micro Chip:</strong> Embedded securely inside the core of the magnet. No battery, no charging required. Works with all iPhones (iPhone 7 and above) and modern Android phones automatically.
                </p>
                <p>
                  <strong>Dynamic QR Fallback:</strong> Printed on the reverse side. If someone’s phone has NFC disabled, they scan the QR code to open the exact same Smart Link Hub.
                </p>
                <p>
                  <strong>Editable Destination:</strong> You can change where your magnet points (Spotify, photos, wedding video, website) anytime from your customer dashboard without purchasing a new magnet.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Cross-Sell Recommendations */}
      <section className="mt-20 pt-12 border-t border-stone-200">
        <div className="mb-6">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Complete Your Memory
          </span>
          <h2 className="text-2xl font-bold font-display text-stone-950 mt-1">
            Customers Also Crafted
          </h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {crossSells.map((p) => (
            <ProductCard
              key={p.id}
              product={p}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </section>

      {/* Customer Reviews Section */}
      <section id="reviews" className="mt-20 pt-12 border-t border-stone-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl font-bold font-display text-stone-950">
              Customer Reviews ({reviews.length})
            </h2>
            <div className="flex items-center gap-2 mt-1 text-xs text-stone-600">
              <span className="text-amber-500 font-bold">★ {product.rating} / 5.0</span>
              <span>Based on verified physical magnet purchases</span>
            </div>
          </div>
          <button
            onClick={() => setShowReviewModal(true)}
            className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2.5 px-4 rounded-xl transition-colors self-start sm:self-auto"
          >
            Write a Review
          </button>
        </div>

        <div className="space-y-4">
          {reviews.length === 0 ? (
            <div className="bg-stone-50 p-8 rounded-2xl text-center text-xs text-stone-500">
              No reviews yet for this product. Be the first to share your fridge setup!
            </div>
          ) : (
            reviews.map((rev) => (
              <div
                key={rev.id}
                className="bg-white p-5 rounded-xl border border-stone-200/80 shadow-xs"
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-stone-900">{rev.authorName}</span>
                    {rev.verifiedPurchase && (
                      <span className="text-[10px] text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded-sm font-semibold flex items-center gap-1">
                        <Check className="w-2.5 h-2.5" /> Verified Buyer
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">{rev.date}</span>
                </div>
                <div className="text-amber-500 text-xs mb-1">
                  {'★'.repeat(rev.rating)}
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-stone-900">{rev.title}</h4>
                <p className="text-xs text-stone-600 mt-1 leading-relaxed">{rev.comment}</p>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Write Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold font-display text-stone-950 mb-4">
              Write a Review for {product.name}
            </h3>
            <form onSubmit={handleSubmitReview} className="space-y-3">
              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Your Name
                </label>
                <input
                  type="text"
                  required
                  value={newReviewAuthor}
                  onChange={(e) => setNewReviewAuthor(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Star Rating
                </label>
                <select
                  value={newReviewRating}
                  onChange={(e) => setNewReviewRating(Number(e.target.value))}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-stone-950"
                >
                  <option value={5}>5 Stars - Outstanding Quality</option>
                  <option value={4}>4 Stars - Great Keepsake</option>
                  <option value={3}>3 Stars - Good</option>
                  <option value={2}>2 Stars - Needs Improvement</option>
                  <option value={1}>1 Star - Dissatisfied</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Review Headline
                </label>
                <input
                  type="text"
                  value={newReviewTitle}
                  onChange={(e) => setNewReviewTitle(e.target.value)}
                  placeholder="e.g. Looks unbelievable on our black fridge!"
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-stone-800 block mb-1">
                  Your Experience
                </label>
                <textarea
                  required
                  rows={3}
                  value={newReviewComment}
                  onChange={(e) => setNewReviewComment(e.target.value)}
                  placeholder="How was the acrylic finish, print clarity, and NFC tap speed?"
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-stone-950"
                />
              </div>

              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowReviewModal(false)}
                  className="flex-1 py-2 text-xs font-semibold border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-stone-950 text-white rounded-lg hover:bg-stone-800"
                >
                  Submit Review
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Mobile Sticky CTA Bar adhering to <= 15% viewport height cap */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-stone-200 p-3 z-30 shadow-lg flex items-center justify-between gap-3">
        <div>
          <div className="text-sm font-bold font-mono text-stone-950">
            {formatCurrency(selectedVariant.price)}
          </div>
          <div className="text-[10px] text-emerald-700 font-medium">NFC + QR Included</div>
        </div>
        <button
          onClick={() => onCustomize(product)}
          className="flex-1 bg-stone-950 text-white font-bold py-2.5 px-4 rounded-xl text-xs flex items-center justify-center gap-1.5 shadow-xs"
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Customize & Buy</span>
        </button>
      </div>
    </div>
  );
};
