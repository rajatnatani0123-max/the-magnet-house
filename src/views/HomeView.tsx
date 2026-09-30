import React from 'react';
import { ArrowRight, Sparkles, Smartphone, QrCode, Layers, ShieldCheck, Heart, Music, Camera, Compass } from 'lucide-react';
import { INITIAL_PRODUCTS, INITIAL_REVIEWS } from '../data/products';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { NfcTapSimulator } from '../components/NfcTapSimulator';
import { ASSET_IMAGES } from '../lib/constants';

interface HomeViewProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onSelectProduct: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onCustomize: (product: Product) => void;
}

export const HomeView: React.FC<HomeViewProps> = ({
  onNavigate,
  onSelectProduct,
  onQuickView,
  onCustomize,
}) => {
  const featuredProducts = INITIAL_PRODUCTS.slice(0, 4);

  const categories = [
    { id: 'couple', name: 'Couples & Wedding', count: '6 Styles', icon: Heart, desc: 'Anniversary, first dance, vow keepsakes' },
    { id: 'spotify', name: 'Spotify & Music', count: '4 Styles', icon: Music, desc: 'Instant song & playlist playback' },
    { id: 'travel', name: 'Travel Polaroids', count: '5 Styles', icon: Compass, desc: 'Memories linked to Google Map pins' },
    { id: 'family', name: 'Family & Kids', count: '4 Styles', icon: Camera, desc: 'Artisanal walnut & acrylic frames' },
  ];

  return (
    <div className="space-y-16 sm:space-y-24 pb-16">
      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 sm:pt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Hero Copy */}
          <div className="lg:col-span-6 space-y-6">
            {/* Minimal metadata text */}
            <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-stone-500">
              <span className="text-emerald-700 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> Next-Gen Keepsakes
              </span>
              <span aria-hidden="true">·</span>
              <span>NFC + Dynamic QR</span>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-stone-950 font-display tracking-tight leading-[1.08] text-balance">
              Turn your memories into something you can tap.
            </h1>

            <p className="text-base sm:text-lg text-stone-600 leading-relaxed max-w-xl">
              Personalized fridge magnets engineered with museum-grade acrylic, warm walnut wood, and contactless NFC chips. One gentle phone tap opens your wedding film, favorite Spotify song, or digital photo hub.
            </p>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2">
              <button
                onClick={() => onNavigate('customize', { productId: 'prod-couple-acrylic' })}
                className="bg-stone-950 hover:bg-stone-800 text-white font-semibold text-sm py-3.5 px-6 rounded-xl transition-all shadow-md flex items-center justify-center gap-2 group active:scale-98"
              >
                <span>Create Your Magnet</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </button>

              <button
                onClick={() => onNavigate('shop')}
                className="bg-stone-100 hover:bg-stone-200 text-stone-900 font-semibold text-sm py-3.5 px-6 rounded-xl transition-colors flex items-center justify-center gap-2 border border-stone-200/80"
              >
                <span>Explore All Magnets</span>
              </button>
            </div>

            {/* Claim-to-Proof Adjacency */}
            <div className="pt-4 border-t border-stone-200/80 flex items-center gap-6 text-xs text-stone-600">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>N52 Neodymium Grip</span>
              </div>
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-500" />
                <span>10,000+ Memories Made</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 font-bold">★ 4.9/5</span>
                <span>Verified Reviews</span>
              </div>
            </div>
          </div>

          {/* Hero Image Showcase */}
          <div className="lg:col-span-6">
            <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 aspect-4/3 sm:aspect-16/10 bg-stone-950">
              <img
                src={ASSET_IMAGES.heroFridge}
                alt="Smart fridge magnets displayed on a refrigerator door being tapped by a phone"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/70 via-transparent to-transparent flex flex-col justify-end p-6 sm:p-8">
                <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-md py-1.5 px-3 rounded-md text-xs font-semibold text-stone-900 self-start shadow-xs mb-2">
                  <Smartphone className="w-3.5 h-3.5 text-emerald-700" />
                  <span>Tap phone near magnet · Instant Link Hub launches</span>
                </div>
                <p className="text-xs text-stone-300">
                  Dual embedded technology: NFC touch + Laser-etched QR fallback.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive NFC Tap Demo Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <NfcTapSimulator onOpenHubDemo={(slug) => onNavigate('smart-link', { slug })} />
      </section>

      {/* Categories Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Curated Collections
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 mt-1">
              Explore by Memory Theme
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {categories.map((cat) => (
            <div
              key={cat.id}
              onClick={() => onNavigate('shop', { category: cat.id })}
              className="group cursor-pointer p-6 rounded-2xl bg-white border border-stone-200/80 hover:border-stone-900 transition-all duration-200 hover:-translate-y-1 hover:shadow-md flex flex-col justify-between h-48"
            >
              <div className="flex items-center justify-between">
                <div className="p-3 bg-stone-100 group-hover:bg-stone-900 group-hover:text-white rounded-xl transition-colors">
                  <cat.icon className="w-5 h-5 text-stone-800 group-hover:text-white" />
                </div>
                <span className="text-xs font-mono text-stone-500">{cat.count}</span>
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900 group-hover:text-stone-950 font-display">
                  {cat.name}
                </h3>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">{cat.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Bestsellers Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Loved by Thousands
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 mt-1">
              Featured Smart Magnets
            </h2>
          </div>
          <button
            onClick={() => onNavigate('shop')}
            className="text-xs sm:text-sm font-semibold text-stone-800 hover:text-stone-950 flex items-center gap-1 group self-start sm:self-auto"
          >
            <span>Browse Full Catalog</span>
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onSelect={onSelectProduct}
              onQuickView={onQuickView}
              onCustomize={onCustomize}
            />
          ))}
        </div>
      </section>

      {/* How It Works Section */}
      <section className="bg-stone-100 py-16 sm:py-20 border-y border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Simple 4-Step Process
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 mt-2">
              From Photo to Interactive Magnet
            </h2>
            <p className="text-xs sm:text-sm text-stone-600 mt-2">
              We combine artisan materials with contactless web technology to make your memories permanently tangible.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {[
              {
                step: '01',
                title: 'Design In Studio',
                desc: 'Upload your photo, add custom typography, wedding dates, or Spotify waveforms in our live canvas editor.',
                icon: Layers,
              },
              {
                step: '02',
                title: 'Link Your Destination',
                desc: 'Connect a Spotify playlist, Google Drive album, Instagram profile, or custom Smart Link Hub.',
                icon: Smartphone,
              },
              {
                step: '03',
                title: 'Handcrafted & Encoded',
                desc: 'We laser-cut your magnet in crystal acrylic or solid walnut, program the NTAG213 NFC chip, and engrave the QR fallback.',
                icon: Sparkles,
              },
              {
                step: '04',
                title: 'Tap to Relive',
                desc: 'Stick it to your fridge. Whenever anyone taps their phone, your digital hub instantly appears.',
                icon: QrCode,
              },
            ].map((item) => (
              <div key={item.step} className="bg-white p-6 rounded-2xl border border-stone-200/80 shadow-xs flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-xs font-mono font-bold text-stone-400">
                      {item.step}
                    </span>
                    <item.icon className="w-5 h-5 text-stone-900" />
                  </div>
                  <h3 className="text-base font-bold text-stone-900 font-display">
                    {item.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-2 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Verified Reviews Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4">
          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
              Customer Love
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 mt-1">
              Real Fridges. Real Stories.
            </h2>
          </div>
          <div className="flex items-center gap-1 text-xs text-stone-600 font-medium">
            <span className="text-amber-500">★★★★★</span>
            <span className="font-bold text-stone-900">4.9 out of 5 stars</span>
            <span>across 1,200+ orders</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {INITIAL_REVIEWS.slice(0, 3).map((review) => (
            <div
              key={review.id}
              className="bg-white p-6 rounded-2xl border border-stone-200/80 flex flex-col justify-between shadow-xs"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="text-amber-500 text-xs">
                    {'★'.repeat(review.rating)}
                  </div>
                  <span className="text-[11px] text-stone-400 font-mono">
                    {review.date}
                  </span>
                </div>
                <h4 className="text-sm font-bold text-stone-900 mb-1">
                  &quot;{review.title}&quot;
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  {review.comment}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <span className="font-semibold text-stone-900">{review.authorName}</span>
                <span className="text-emerald-700 font-medium text-[11px] flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" /> Verified Purchase
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
