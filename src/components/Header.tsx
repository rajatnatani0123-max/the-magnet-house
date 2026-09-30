import React, { useState, useEffect } from 'react';
import { ShoppingBag, User, Menu, X, Search, ShieldCheck } from 'lucide-react';
import { storage } from '../lib/storage';

interface HeaderProps {
  currentView: string;
  onNavigate: (view: string, params?: Record<string, string>) => void;
  onOpenCart: () => void;
  onOpenSearch: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  onNavigate,
  onOpenCart,
  onOpenSearch,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [userRole, setUserRole] = useState<'customer' | 'staff' | 'admin'>('customer');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });

    // Initial cart count
    const updateCartCount = () => {
      const items = storage.getCart();
      const count = items.reduce((sum, item) => sum + item.quantity, 0);
      setCartCount(count);
      setUserRole(storage.getUserProfile().role);
    };
    updateCartCount();

    const unsubscribe = storage.onCartChange(updateCartCount);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      unsubscribe();
    };
  }, []);

  return (
    <>
      {/* Top Notification Trust Strip */}
      <div className="bg-stone-900 text-stone-200 text-xs py-1.5 px-4 text-center tracking-wide flex items-center justify-center gap-3">
        <span>Free Express Delivery on all smart magnet orders over ₹999</span>
        <span aria-hidden="true" className="text-stone-500">·</span>
        <span className="hidden sm:inline">NFC + Dynamic QR Included</span>
      </div>

      {/* Main Navigation Header - Top Bar Contract: Zone 1 (Brand) - Zone 2 (Nav links) - Zone 3 (Actions) */}
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-[#FAFAF9]/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs py-3'
            : 'bg-[#FAFAF9] border-b border-stone-200 py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Zone 1: Single element wordmark in display font */}
          <button
            onClick={() => onNavigate('home')}
            className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 font-display text-left hover:opacity-90 transition-opacity"
            aria-label="The Magnet House Homepage"
          >
            The Magnet House
          </button>

          {/* Zone 2: 4-6 clean text navigation links without pill badges */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-stone-600">
            <button
              onClick={() => onNavigate('shop')}
              className={`transition-colors hover:text-stone-950 ${
                currentView === 'shop' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Shop All
            </button>
            <button
              onClick={() => onNavigate('customize', { productId: 'prod-couple-acrylic' })}
              className={`transition-colors hover:text-stone-950 ${
                currentView === 'customize' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Custom Studio
            </button>
            <button
              onClick={() => onNavigate('home')}
              className="transition-colors hover:text-stone-950"
            >
              How It Works
            </button>
            <button
              onClick={() => onNavigate('smart-link-demo')}
              className="transition-colors hover:text-stone-950"
            >
              Smart Hub Demo
            </button>
            <button
              onClick={() => onNavigate('support')}
              className={`transition-colors hover:text-stone-950 ${
                currentView === 'support' ? 'text-stone-950 font-semibold' : ''
              }`}
            >
              Support & FAQ
            </button>
          </nav>

          {/* Zone 3: 1-2 primary actions (Search, Account, Cart) */}
          <div className="flex items-center gap-2 sm:gap-4">
            <button
              onClick={onOpenSearch}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors"
              aria-label="Search products"
            >
              <Search className="w-5 h-5" />
            </button>

            <button
              onClick={() => onNavigate('account')}
              className="p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors relative"
              aria-label="Account Dashboard"
            >
              <User className="w-5 h-5" />
              {userRole === 'admin' && (
                <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-emerald-600 rounded-full" title="Admin active" />
              )}
            </button>

            <button
              onClick={onOpenCart}
              className="flex items-center gap-2 bg-stone-900 text-white px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
              aria-label={`Shopping Cart with ${cartCount} items`}
            >
              <ShoppingBag className="w-4 h-4" />
              <span className="font-mono tabular-nums font-semibold">{cartCount}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 rounded-lg transition-colors ml-1"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-stone-200 bg-[#FAFAF9] px-6 py-6 space-y-4">
            <div className="flex flex-col space-y-3 text-base font-medium text-stone-800">
              <button
                onClick={() => {
                  onNavigate('shop');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-stone-950 border-b border-stone-100"
              >
                Shop All Magnets
              </button>
              <button
                onClick={() => {
                  onNavigate('customize', { productId: 'prod-couple-acrylic' });
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-stone-950 border-b border-stone-100"
              >
                Custom Studio
              </button>
              <button
                onClick={() => {
                  onNavigate('smart-link-demo');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-stone-950 border-b border-stone-100"
              >
                Smart Link Hub Demo (/m/slug)
              </button>
              <button
                onClick={() => {
                  onNavigate('account');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-stone-950 border-b border-stone-100"
              >
                My Account & Magnets
              </button>
              <button
                onClick={() => {
                  onNavigate('support');
                  setMobileMenuOpen(false);
                }}
                className="text-left py-2 hover:text-stone-950 border-b border-stone-100"
              >
                Support, FAQs & Policies
              </button>
              {userRole === 'admin' && (
                <button
                  onClick={() => {
                    onNavigate('admin');
                    setMobileMenuOpen(false);
                  }}
                  className="text-left py-2 text-emerald-800 font-semibold flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Staff / Admin Console
                </button>
              )}
            </div>
          </div>
        )}
      </header>
    </>
  );
};
