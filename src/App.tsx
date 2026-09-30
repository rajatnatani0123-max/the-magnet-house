import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { SearchModal } from './components/SearchModal';

import { HomeView } from './views/HomeView';
import { ShopView } from './views/ShopView';
import { ProductDetailView } from './views/ProductDetailView';
import { CustomizeStudioView } from './views/CustomizeStudioView';
import { SmartLinkHubView } from './views/SmartLinkHubView';
import { CheckoutView } from './views/CheckoutView';
import { OrderConfirmationView } from './views/OrderConfirmationView';
import { AccountDashboardView } from './views/AccountDashboardView';
import { AdminView } from './views/AdminView';
import { SupportView } from './views/SupportView';
import { PolicyView } from './views/PolicyView';

import { Product, Order, CustomizationDesign } from './types';
import { INITIAL_PRODUCTS } from './data/products';

export default function App() {
  const [currentView, setCurrentView] = useState<string>('home');
  const [viewParams, setViewParams] = useState<Record<string, string>>({});

  // Modals & drawers
  const [cartOpen, setCartOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Active product for PDP & Custom Studio
  const [activeProduct, setActiveProduct] = useState<Product>(INITIAL_PRODUCTS[0]);
  const [confirmedOrder, setConfirmedOrder] = useState<Order | null>(null);

  // Sync state with URL or popstate
  useEffect(() => {
    const parseUrl = () => {
      const path = window.location.pathname;
      const hash = window.location.hash.replace('#', '');
      const searchParams = new URLSearchParams(window.location.search);

      // Check /m/:slug route for public Smart Link Hub
      if (path.startsWith('/m/')) {
        const slug = path.replace('/m/', '');
        if (slug) {
          setCurrentView('smart-link');
          setViewParams({ slug });
          return;
        }
      }

      if (hash) {
        const [view, queryStr] = hash.split('?');
        setCurrentView(view || 'home');
        if (queryStr) {
          const qParams = new URLSearchParams(queryStr);
          const paramsObj: Record<string, string> = {};
          qParams.forEach((val, key) => {
            paramsObj[key] = val;
          });
          setViewParams(paramsObj);
        }
      }
    };

    parseUrl();
    window.addEventListener('popstate', parseUrl);
    return () => window.removeEventListener('popstate', parseUrl);
  }, []);

  const navigate = (view: string, params: Record<string, string> = {}) => {
    setCurrentView(view);
    setViewParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    // Update browser URL hash for deep linking
    const searchStr = new URLSearchParams(params).toString();
    const newHash = searchStr ? `#${view}?${searchStr}` : `#${view}`;
    window.history.pushState(null, '', newHash);

    // If navigating to customize with a productId, update activeProduct
    if (params.productId) {
      const prod = INITIAL_PRODUCTS.find((p) => p.id === params.productId);
      if (prod) setActiveProduct(prod);
    }
  };

  const handleSelectProduct = (product: Product) => {
    setActiveProduct(product);
    navigate('product-detail', { productId: product.id });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
  };

  const handleCustomizeProduct = (product: Product) => {
    setActiveProduct(product);
    navigate('customize', { productId: product.id });
  };

  const handleResumeDesign = (design: CustomizationDesign) => {
    const prod = INITIAL_PRODUCTS.find((p) => p.id === design.productId) || INITIAL_PRODUCTS[0];
    setActiveProduct(prod);
    navigate('customize', { productId: prod.id });
  };

  // If viewing the standalone Smart Link Hub (/m/:slug)
  if (currentView === 'smart-link') {
    return (
      <SmartLinkHubView
        slug={viewParams.slug || 'aarav-meera-wedding'}
        onNavigateHome={() => navigate('home')}
      />
    );
  }

  // If inside the Customization Studio, render full viewport workspace
  if (currentView === 'customize') {
    return (
      <CustomizeStudioView
        product={activeProduct}
        onAddToCartSuccess={() => {
          setCartOpen(true);
          navigate('shop');
        }}
        onNavigateHome={() => navigate('home')}
        onPreviewSmartLink={(slug) => navigate('smart-link', { slug })}
      />
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#FAFAF9] text-stone-900 font-sans">
      <Header
        currentView={currentView}
        onNavigate={navigate}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main className="flex-1">
        {currentView === 'home' && (
          <HomeView
            onNavigate={navigate}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
            onCustomize={handleCustomizeProduct}
          />
        )}

        {currentView === 'shop' && (
          <ShopView
            initialCategory={viewParams.category}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
            onCustomize={handleCustomizeProduct}
          />
        )}

        {currentView === 'product-detail' && (
          <ProductDetailView
            product={activeProduct}
            onCustomize={handleCustomizeProduct}
            onOpenCart={() => setCartOpen(true)}
            onSelectProduct={handleSelectProduct}
            onQuickView={handleQuickView}
          />
        )}

        {currentView === 'checkout' && (
          <CheckoutView
            onSuccess={(order) => {
              setConfirmedOrder(order);
              navigate('order-confirmation');
            }}
            onBackToCart={() => setCartOpen(true)}
            onNavigateHome={() => navigate('home')}
          />
        )}

        {currentView === 'order-confirmation' && confirmedOrder && (
          <OrderConfirmationView
            order={confirmedOrder}
            onNavigateHome={() => navigate('home')}
            onViewAccountMagnets={() => navigate('account', { tab: 'magnets' })}
            onOpenSmartLink={(slug) => navigate('smart-link', { slug })}
          />
        )}

        {currentView === 'account' && (
          <AccountDashboardView
            initialTab={viewParams.tab || 'magnets'}
            onOpenSmartLink={(slug) => navigate('smart-link', { slug })}
            onResumeDesign={handleResumeDesign}
            onNavigateShop={() => navigate('shop')}
            onNavigateAdmin={() => navigate('admin')}
          />
        )}

        {currentView === 'admin' && (
          <AdminView
            onBackToStore={() => navigate('home')}
            onOpenSmartLink={(slug) => navigate('smart-link', { slug })}
          />
        )}

        {currentView === 'support' && <SupportView />}

        {currentView === 'policy' && (
          <PolicyView initialDoc={viewParams.doc || 'terms'} />
        )}

        {currentView === 'smart-link-demo' && (
          <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-6">
            <h1 className="text-3xl font-bold font-display text-stone-900">
              Interactive Smart Link Hubs
            </h1>
            <p className="text-xs sm:text-sm text-stone-600 max-w-md mx-auto">
              Select one of our live magnet destinations to see what opens when tapped with an iPhone or Android phone:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4">
              <button
                onClick={() => navigate('smart-link', { slug: 'aarav-meera-wedding' })}
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-stone-900 transition-all text-left shadow-xs group"
              >
                <span className="text-xs font-mono text-emerald-700 block">/m/aarav-meera-wedding</span>
                <span className="text-sm font-bold text-stone-900 group-hover:underline block mt-1">
                  Wedding Film & Photos
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">Romantic Theme</span>
              </button>

              <button
                onClick={() => navigate('smart-link', { slug: 'first-dance-playlist' })}
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-stone-900 transition-all text-left shadow-xs group"
              >
                <span className="text-xs font-mono text-emerald-700 block">/m/first-dance-playlist</span>
                <span className="text-sm font-bold text-stone-900 group-hover:underline block mt-1">
                  Spotify Soundwave
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">Dark Matte Theme</span>
              </button>

              <button
                onClick={() => navigate('smart-link', { slug: 'amalfi-coast-roadtrip' })}
                className="p-5 bg-white rounded-2xl border border-stone-200 hover:border-stone-900 transition-all text-left shadow-xs group"
              >
                <span className="text-xs font-mono text-emerald-700 block">/m/amalfi-coast-roadtrip</span>
                <span className="text-sm font-bold text-stone-900 group-hover:underline block mt-1">
                  Travel Polaroid Map
                </span>
                <span className="text-[11px] text-stone-500 mt-1 block">Amber Summer Theme</span>
              </button>
            </div>
          </div>
        )}
      </main>

      <Footer onNavigate={navigate} />

      {/* Global Slide-Over Cart Drawer */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        onCheckout={() => {
          setCartOpen(false);
          navigate('checkout');
        }}
        onNavigateShop={() => navigate('shop')}
      />

      {/* Quick View Modal */}
      <QuickViewModal
        product={quickViewProduct}
        onClose={() => setQuickViewProduct(null)}
        onCustomize={handleCustomizeProduct}
        onOpenCart={() => setCartOpen(true)}
      />

      {/* Search Modal */}
      <SearchModal
        isOpen={searchOpen}
        onClose={() => setSearchOpen(false)}
        onSelectProduct={handleSelectProduct}
      />
    </div>
  );
}
