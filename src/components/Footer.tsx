import React from 'react';
import { ShieldCheck, Truck, RotateCcw, Sparkles } from 'lucide-react';

interface FooterProps {
  onNavigate: (view: string, params?: Record<string, string>) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="bg-stone-900 text-stone-300 pt-16 pb-12 border-t border-stone-800">
      {/* Guarantees Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 mb-12 border-b border-stone-800 grid grid-cols-1 md:grid-cols-4 gap-8 text-stone-200">
        <div className="flex items-start gap-3.5">
          <Sparkles className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">NFC + QR Dual Tech</h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Every magnet features embedded NTAG213 chips plus a laser-etched fallback QR.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <Truck className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Express Pan-India Delivery</h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Ships within 24-48 hours with door-to-door BlueDart & Delhivery tracking.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <ShieldCheck className="w-5 h-5 text-sky-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Lifetime Digital Link Hub</h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Update your Spotify, photos, or website destination anytime without buying new magnets.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3.5">
          <RotateCcw className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div>
            <h4 className="text-sm font-semibold text-white">Print Quality Guarantee</h4>
            <p className="text-xs text-stone-400 mt-1 leading-relaxed">
              Scratch-resistant UV pigment inks. If there is any print flaw, we reprint free.
            </p>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-2 md:grid-cols-5 gap-8 text-sm">
        <div className="col-span-2">
          <span className="text-xl font-bold font-display text-white tracking-tight block">
            The Magnet House
          </span>
          <p className="text-xs text-stone-400 mt-3 max-w-sm leading-relaxed">
            Pioneering tangible digital memories. We handcraft personalized physical fridge magnets integrated with smart contactless technology.
          </p>
          <div className="mt-4 flex items-center gap-2 text-xs text-stone-400">
            <span>Made with pride in India</span>
            <span aria-hidden="true">·</span>
            <span>Worldwide shipping</span>
          </div>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            Collections
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-300">
            <li>
              <button onClick={() => onNavigate('shop', { category: 'couple' })} className="hover:text-white transition-colors">
                Couple & Anniversary
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'wedding' })} className="hover:text-white transition-colors">
                Wedding Keepsakes
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'spotify' })} className="hover:text-white transition-colors">
                Spotify Soundwaves
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'travel' })} className="hover:text-white transition-colors">
                Travel Polaroids
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'pets' })} className="hover:text-white transition-colors">
                Pet Memorials
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('shop', { category: 'business' })} className="hover:text-white transition-colors">
                Smart Business vCards
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            Customization
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-300">
            <li>
              <button onClick={() => onNavigate('customize')} className="hover:text-white transition-colors">
                Design Studio
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('smart-link-demo')} className="hover:text-white transition-colors">
                Smart Link Hub Demo
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('account', { tab: 'magnets' })} className="hover:text-white transition-colors">
                Manage My Magnets
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('account', { tab: 'designs' })} className="hover:text-white transition-colors">
                Saved Drafts
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('policy', { doc: 'nfc-guide' })} className="hover:text-white transition-colors">
                NFC Phone Compatibility
              </button>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-400 mb-4">
            Help & Policies
          </h4>
          <ul className="space-y-2.5 text-xs text-stone-300">
            <li>
              <button onClick={() => onNavigate('support')} className="hover:text-white transition-colors">
                Customer Care & FAQ
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('policy', { doc: 'shipping' })} className="hover:text-white transition-colors">
                Shipping & Delivery
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('policy', { doc: 'refund' })} className="hover:text-white transition-colors">
                Returns & Replacement
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('policy', { doc: 'privacy' })} className="hover:text-white transition-colors">
                Privacy Policy
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('policy', { doc: 'terms' })} className="hover:text-white transition-colors">
                Terms of Service
              </button>
            </li>
            <li>
              <button onClick={() => onNavigate('admin')} className="text-stone-400 hover:text-emerald-400 transition-colors">
                Staff / Admin Portal
              </button>
            </li>
          </ul>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between text-xs text-stone-400 gap-4">
        <div>
          &copy; {new Date().getFullYear()} The Magnet House Pvt. Ltd. All rights reserved.
        </div>
        <div className="flex items-center gap-4">
          <span>Razorpay Secured 256-bit Encryption</span>
          <span aria-hidden="true">·</span>
          <span>Apple Pay & UPI Accepted</span>
        </div>
      </div>
    </footer>
  );
};
