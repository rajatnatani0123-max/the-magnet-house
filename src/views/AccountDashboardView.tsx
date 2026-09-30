import React, { useState, useEffect } from 'react';
import {
  Smartphone,
  QrCode,
  Package,
  Layers,
  Heart,
  Settings,
  Sparkles,
  ExternalLink,
  Edit3,
  Download,
  Check,
  Plus,
  Trash2,
  Share2,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  Shield,
} from 'lucide-react';
import { SmartMagnet, Order, CustomizationDesign, UserProfile, SmartLinkHub } from '../types';
import { storage } from '../lib/storage';
import { formatCurrency } from '../lib/pricing';
import { generateQrDataUrl, downloadQrPng } from '../lib/qr';
import { INITIAL_PRODUCTS } from '../data/products';
import { ProductCard } from '../components/ProductCard';

interface AccountDashboardViewProps {
  initialTab?: string;
  onOpenSmartLink: (slug: string) => void;
  onResumeDesign: (design: CustomizationDesign) => void;
  onNavigateShop: () => void;
  onNavigateAdmin: () => void;
}

type AccountTab = 'magnets' | 'orders' | 'designs' | 'wishlist' | 'profile';

export const AccountDashboardView: React.FC<AccountDashboardViewProps> = ({
  initialTab = 'magnets',
  onOpenSmartLink,
  onResumeDesign,
  onNavigateShop,
  onNavigateAdmin,
}) => {
  const [activeTab, setActiveTab] = useState<AccountTab>(
    (initialTab as AccountTab) || 'magnets'
  );

  const [magnets, setMagnets] = useState<SmartMagnet[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [savedDesigns, setSavedDesigns] = useState<CustomizationDesign[]>([]);
  const [wishlistIds, setWishlistIds] = useState<string[]>([]);
  const [profile, setProfile] = useState<UserProfile>(() => storage.getUserProfile());

  // Edit destination modal state
  const [editingMagnet, setEditingMagnet] = useState<SmartMagnet | null>(null);
  const [editTitle, setEditTitle] = useState('');
  const [editBio, setEditBio] = useState('');
  const [editFirstLinkUrl, setEditFirstLinkUrl] = useState('');
  const [editFirstLinkTitle, setEditFirstLinkTitle] = useState('');
  const [qrModalDataUrl, setQrModalDataUrl] = useState<string | null>(null);
  const [qrModalSlug, setQrModalSlug] = useState<string>('');

  // Device Security & Passcode State
  const [securityMagnet, setSecurityMagnet] = useState<SmartMagnet | null>(null);
  const [secIsProtected, setSecIsProtected] = useState(false);
  const [secPassword, setSecPassword] = useState('');
  const [secHint, setSecHint] = useState('');
  const [secMode, setSecMode] = useState<'pin' | 'password'>('pin');
  const [secShowPassword, setSecShowPassword] = useState(false);
  const [secSuccessMsg, setSecSuccessMsg] = useState<string | null>(null);

  // Account Password State
  const [currentPasswordInput, setCurrentPasswordInput] = useState('');
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [accountPassSaved, setAccountPassSaved] = useState(false);

  useEffect(() => {
    const refreshData = () => {
      setMagnets(storage.getMagnets());
      setOrders(storage.getOrders());
      setSavedDesigns(storage.getSavedDesigns());
      setWishlistIds(storage.getWishlist());
      setProfile(storage.getUserProfile());
    };
    refreshData();

    const unsubMagnets = storage.onCartChange(refreshData);
    const unsubWishlist = storage.onWishlistChange(refreshData);
    return () => {
      unsubMagnets();
      unsubWishlist();
    };
  }, []);

  const totalTaps = magnets.reduce((sum, m) => sum + (m.smartLink?.analytics?.totalTaps || 0), 0);
  const totalScans = magnets.reduce((sum, m) => sum + (m.smartLink?.analytics?.totalScans || 0), 0);

  const handleOpenEditModal = (magnet: SmartMagnet) => {
    setEditingMagnet(magnet);
    setEditTitle(magnet.smartLink?.title || magnet.name);
    setEditBio(magnet.smartLink?.bio || '');
    setEditFirstLinkTitle(magnet.smartLink?.links[0]?.title || 'Featured Link');
    setEditFirstLinkUrl(magnet.smartLink?.links[0]?.url || 'https://');
  };

  const handleSaveMagnetDestination = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMagnet) return;

    const currentLink = editingMagnet.smartLink;
    const updatedLinks = [...currentLink.links];
    if (updatedLinks.length > 0) {
      updatedLinks[0] = {
        ...updatedLinks[0],
        title: editFirstLinkTitle,
        url: editFirstLinkUrl,
      };
    } else {
      updatedLinks.push({
        id: `link-${Date.now()}`,
        type: 'website',
        title: editFirstLinkTitle,
        url: editFirstLinkUrl,
        active: true,
        clicks: 0,
      });
    }

    const updatedSmartLink: SmartLinkHub = {
      ...currentLink,
      title: editTitle,
      bio: editBio,
      links: updatedLinks,
      updatedAt: new Date().toISOString(),
    };

    storage.updateMagnetDestination(editingMagnet.id, updatedSmartLink);
    setMagnets(storage.getMagnets());
    setEditingMagnet(null);
  };

  const handleOpenSecurityModal = (magnet: SmartMagnet) => {
    setSecurityMagnet(magnet);
    setSecIsProtected(!!magnet.isPasswordProtected);
    setSecPassword(magnet.password || '');
    setSecHint(magnet.passwordHint || '');
    setSecMode((magnet.securityMode as 'pin' | 'password') || 'pin');
    setSecShowPassword(false);
    setSecSuccessMsg(null);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (!securityMagnet) return;

    storage.updateMagnetSecurity(
      securityMagnet.id,
      secIsProtected,
      secPassword,
      secHint,
      secMode
    );
    setMagnets(storage.getMagnets());
    setSecSuccessMsg('Device passcode authentication updated successfully!');
    setTimeout(() => {
      setSecurityMagnet(null);
      setSecSuccessMsg(null);
    }, 1200);
  };

  const handleSaveAccountPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPasswordInput) return;
    storage.updateUserProfile({
      password: newPasswordInput,
      passwordAuthEnabled: true,
    });
    setProfile(storage.getUserProfile());
    setAccountPassSaved(true);
    setCurrentPasswordInput('');
    setNewPasswordInput('');
    setTimeout(() => setAccountPassSaved(false), 2500);
  };

  const handleShowQr = async (slug: string) => {
    setQrModalSlug(slug);
    const url = `${window.location.origin}/m/${slug}`;
    const dataUrl = await generateQrDataUrl(url, { width: 340, errorCorrectionLevel: 'H' });
    setQrModalDataUrl(dataUrl);
  };

  const handleRoleChange = (role: 'customer' | 'staff' | 'admin') => {
    storage.updateUserProfile({ role });
    setProfile(storage.getUserProfile());
  };

  const wishlistedProducts = INITIAL_PRODUCTS.filter((p) => wishlistIds.includes(p.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {/* Account Overview Header */}
      <div className="bg-white rounded-2xl border border-stone-200 p-6 sm:p-8 shadow-xs mb-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            Smart Magnet Portal
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold font-display text-stone-950 mt-1">
            Welcome back, {profile.name}
          </h1>
          <p className="text-xs text-stone-500 mt-1">
            {profile.email} · Registered Customer Account
          </p>
        </div>

        {/* Aggregate Stats */}
        <div className="flex items-center gap-6 text-center border-t md:border-t-0 md:border-l border-stone-200 pt-4 md:pt-0 md:pl-6">
          <div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-stone-900 tabular-nums">
              {magnets.length}
            </span>
            <span className="text-[11px] text-stone-500 block">Smart Magnets</span>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-emerald-700 tabular-nums">
              {totalTaps}
            </span>
            <span className="text-[11px] text-stone-500 block">NFC Taps</span>
          </div>
          <div>
            <span className="text-xl sm:text-2xl font-bold font-mono text-amber-700 tabular-nums">
              {totalScans}
            </span>
            <span className="text-[11px] text-stone-500 block">QR Scans</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-stone-200 space-x-6 sm:space-x-8 text-xs sm:text-sm font-semibold mb-8 overflow-x-auto">
        {[
          { id: 'magnets', label: `My Magnets (${magnets.length})`, icon: Smartphone },
          { id: 'orders', label: `Orders (${orders.length})`, icon: Package },
          { id: 'designs', label: `Drafts (${savedDesigns.length})`, icon: Layers },
          { id: 'wishlist', label: `Wishlist (${wishlistIds.length})`, icon: Heart },
          { id: 'profile', label: 'Settings & Roles', icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`pb-3 flex items-center gap-2 whitespace-nowrap transition-colors border-b-2 -mb-px ${
              activeTab === tab.id
                ? 'border-stone-950 text-stone-950 font-bold'
                : 'border-transparent text-stone-500 hover:text-stone-800'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* TAB 1: My Magnets */}
      {activeTab === 'magnets' && (
        <div className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-bold font-display text-stone-950">
                Active Smart Fridge Magnets
              </h3>
              <p className="text-xs text-stone-500">
                Change where any physical magnet points anytime without purchasing a new one.
              </p>
            </div>
            <button
              onClick={onNavigateShop}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold py-2 px-3.5 rounded-xl transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Another Magnet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {magnets.map((magnet) => (
              <div
                key={magnet.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-xs flex flex-col justify-between"
              >
                <div>
                  {/* Visual Preview */}
                  <div className="relative aspect-16/10 bg-stone-100 overflow-hidden">
                    <img
                      src={magnet.designPreview}
                      alt={magnet.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute top-3 left-3 bg-stone-950/80 text-white text-[10px] font-mono px-2 py-0.5 rounded-sm backdrop-blur-xs flex items-center gap-1">
                      <span>NFC</span>
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                      <span>{magnet.nfcUid}</span>
                    </div>

                    <div className="absolute top-3 right-3 flex gap-1.5">
                      <button
                        onClick={() => handleShowQr(magnet.qrSlug)}
                        className="p-1.5 bg-white/90 text-stone-800 rounded-lg hover:bg-white text-xs shadow-xs"
                        title="View Fallback QR"
                      >
                        <QrCode className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex flex-wrap items-center gap-2 text-[11px] text-stone-500 capitalize mb-1">
                      <span>{magnet.material}</span>
                      <span aria-hidden="true">·</span>
                      <span>{magnet.shape}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-emerald-700 font-medium">Active</span>
                      <span aria-hidden="true">·</span>
                      {magnet.isPasswordProtected ? (
                        <span className="text-emerald-800 font-bold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 text-[10px]">
                          <Lock className="w-2.5 h-2.5" /> PIN Protected
                        </span>
                      ) : (
                        <span className="text-stone-500 flex items-center gap-1 bg-stone-100 px-2 py-0.5 rounded-full text-[10px]">
                          <Unlock className="w-2.5 h-2.5 text-stone-400" /> Public Hub
                        </span>
                      )}
                    </div>

                    <h4 className="text-sm font-bold text-stone-900 leading-snug">{magnet.name}</h4>

                    {/* Current Destination */}
                    <div className="mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                      <span className="text-[10px] font-semibold uppercase tracking-wider text-stone-400 block mb-0.5">
                        Current Destination Hub:
                      </span>
                      <div className="font-mono text-[11px] text-emerald-800 font-semibold truncate">
                        /m/{magnet.qrSlug}
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1 line-clamp-1">
                        &quot;{magnet.smartLink?.title}&quot; · {magnet.smartLink?.links?.length || 0} links active
                      </p>
                    </div>

                    {/* Real-time Taps & Scans */}
                    <div className="mt-3 flex items-center justify-between text-[11px] text-stone-500 font-mono">
                      <span>Taps: {magnet.smartLink?.analytics?.totalTaps || 0}</span>
                      <span>Scans: {magnet.smartLink?.analytics?.totalScans || 0}</span>
                    </div>
                  </div>
                </div>

                {/* Card Action footer */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center gap-2">
                  <button
                    onClick={() => handleOpenEditModal(magnet)}
                    className="flex-1 bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Destination</span>
                  </button>

                  <button
                    onClick={() => handleOpenSecurityModal(magnet)}
                    className="bg-white hover:bg-stone-100 border border-stone-300 text-stone-800 font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center gap-1"
                    title="Configure Device Password & PIN"
                  >
                    <Lock className="w-3.5 h-3.5 text-emerald-700" />
                    <span>PIN / Security</span>
                  </button>

                  <button
                    onClick={() => onOpenSmartLink(magnet.qrSlug)}
                    className="bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs py-2 px-3 rounded-lg transition-colors flex items-center gap-1"
                    title="Open Public Hub"
                  >
                    <span>Hub</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: Orders */}
      {activeTab === 'orders' && (
        <div className="space-y-4">
          {orders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              No orders placed yet.
            </div>
          ) : (
            orders.map((ord) => (
              <div
                key={ord.id}
                className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-stone-100">
                  <div>
                    <span className="text-xs font-mono font-bold text-stone-900 block">
                      Order #{ord.orderNumber}
                    </span>
                    <span className="text-[11px] text-stone-400">Placed on {new Date(ord.createdAt).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold text-emerald-800 bg-emerald-50 px-2.5 py-1 rounded-full">
                      Status: {ord.status}
                    </span>
                    <span className="text-sm font-bold font-mono text-stone-950">
                      {formatCurrency(ord.total)}
                    </span>
                  </div>
                </div>

                <div className="space-y-2">
                  {ord.items.map((it) => (
                    <div key={it.id} className="flex items-center gap-3 text-xs">
                      <img
                        src={it.customDesign?.previewImageUrl || it.product.images[0]}
                        alt={it.product.name}
                        className="w-10 h-10 rounded-lg object-cover bg-stone-100"
                      />
                      <div className="flex-1">
                        <span className="font-semibold text-stone-900">
                          {it.customDesign?.magnetText || it.product.name}
                        </span>
                        <span className="text-stone-500 block text-[11px]">
                          Qty: {it.quantity} · {it.variant.sizeLabel}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="pt-2 flex justify-between items-center text-xs text-stone-500 border-t border-stone-100">
                  <span>Tracking: {ord.trackingNumber || 'Processing in workshop'}</span>
                  <span>Payment: {ord.paymentMethod.toUpperCase()} ({ord.paymentId})</span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {/* TAB 3: Saved Drafts */}
      {activeTab === 'designs' && (
        <div className="space-y-4">
          {savedDesigns.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              No saved customization drafts. When you click &quot;Save Draft&quot; in the Custom Studio, it will appear here.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {savedDesigns.map((des) => (
                <div
                  key={des.id}
                  className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-col justify-between"
                >
                  <div>
                    <div className="aspect-square rounded-xl overflow-hidden bg-stone-100 mb-3">
                      <img
                        src={des.previewImageUrl}
                        alt="Draft"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="text-xs font-bold text-stone-900">{des.magnetText || des.productName}</h4>
                    <p className="text-[11px] text-stone-500">{des.magnetSubtext}</p>
                  </div>
                  <div className="mt-4 pt-3 border-t border-stone-100 flex gap-2">
                    <button
                      onClick={() => onResumeDesign(des)}
                      className="flex-1 py-1.5 bg-stone-900 text-white rounded-lg text-xs font-semibold hover:bg-stone-800"
                    >
                      Resume Editing
                    </button>
                    <button
                      onClick={() => {
                        storage.deleteSavedDesign(des.id);
                        setSavedDesigns(storage.getSavedDesigns());
                      }}
                      className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg border border-stone-200"
                      title="Delete draft"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Wishlist */}
      {activeTab === 'wishlist' && (
        <div>
          {wishlistedProducts.length === 0 ? (
            <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center text-xs text-stone-500">
              Your wishlist is empty. Browse the catalog to save your favorites.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              {wishlistedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  product={p}
                  onSelect={() => onNavigateShop()}
                  onQuickView={() => onNavigateShop()}
                  onCustomize={() => onNavigateShop()}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* TAB 5: Profile & Role Switcher */}
      {activeTab === 'profile' && (
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-stone-200 shadow-xs max-w-xl space-y-6">
          <div>
            <h3 className="text-base font-bold font-display text-stone-950">
              Customer Account & Authorization
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Manage your personal credentials or test Administrative management.
            </p>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="font-semibold text-stone-800 block mb-1">Name</label>
              <input
                type="text"
                value={profile.name}
                onChange={(e) => {
                  storage.updateUserProfile({ name: e.target.value });
                  setProfile(storage.getUserProfile());
                }}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs"
              />
            </div>

            <div>
              <label className="font-semibold text-stone-800 block mb-1">Email</label>
              <input
                type="email"
                value={profile.email}
                onChange={(e) => {
                  storage.updateUserProfile({ email: e.target.value });
                  setProfile(storage.getUserProfile());
                }}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs"
              />
            </div>

            {/* Role Switcher for Admin Testing */}
            <div className="pt-4 border-t border-stone-100">
              <label className="font-semibold text-stone-800 block mb-1">
                Account Role (Role-Based Authorization Architecture):
              </label>
              <div className="grid grid-cols-3 gap-2 mt-2">
                {(['customer', 'staff', 'admin'] as const).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`py-2 px-3 rounded-lg border text-xs font-semibold capitalize transition-colors ${
                      profile.role === r
                        ? 'bg-stone-900 text-white border-stone-900 shadow-xs'
                        : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>

              {profile.role === 'admin' && (
                <div className="mt-4 p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-xs flex items-center justify-between">
                  <span className="text-emerald-900 font-semibold">Admin Access Unlocked</span>
                  <button
                    onClick={onNavigateAdmin}
                    className="bg-emerald-700 hover:bg-emerald-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    Launch Admin Console
                  </button>
                </div>
              )}
            </div>

            {/* Account Password & Device Security */}
            <div className="pt-5 border-t border-stone-100">
              <div className="flex items-center gap-2 mb-1.5">
                <ShieldCheck className="w-4 h-4 text-emerald-700" />
                <span className="font-semibold text-stone-900 text-xs">
                  Account Password & Device Security
                </span>
              </div>
              <p className="text-[11px] text-stone-500 mb-3">
                Configure your master account password to authorize physical smart device modifications and secure your hubs.
              </p>

              <form onSubmit={handleSaveAccountPassword} className="space-y-3">
                <div>
                  <label className="font-medium text-stone-700 block mb-1">New Account Password</label>
                  <input
                    type="password"
                    required
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter new master password"
                    className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                  />
                </div>

                {accountPassSaved && (
                  <div className="p-2 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-[11px] font-semibold flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Account password updated successfully!</span>
                  </div>
                )}

                <button
                  type="submit"
                  className="bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2 px-3.5 rounded-lg text-xs"
                >
                  Update Account Password
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Destination Modal */}
      {editingMagnet && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200">
            <h3 className="text-base font-bold font-display text-stone-950 mb-1">
              Edit Magnet Destination
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Physical magnet ID: <span className="font-mono">{editingMagnet.nfcUid}</span>
            </p>

            <form onSubmit={handleSaveMagnetDestination} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-stone-800 block mb-1">Hub Title</label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Short Description / Subtitle</label>
                <textarea
                  rows={2}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Primary Link Button Label</label>
                <input
                  type="text"
                  required
                  value={editFirstLinkTitle}
                  onChange={(e) => setEditFirstLinkTitle(e.target.value)}
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-stone-800 block mb-1">Destination Web URL</label>
                <input
                  type="url"
                  required
                  value={editFirstLinkUrl}
                  onChange={(e) => setEditFirstLinkUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full border border-stone-300 rounded-lg p-2 text-xs font-mono"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingMagnet(null)}
                  className="flex-1 py-2 text-xs font-semibold border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-stone-900 text-white rounded-lg hover:bg-stone-800"
                >
                  Update Destination
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Device Password Authentication Modal */}
      {securityMagnet && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl border border-stone-200 animate-scale-up">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center border border-emerald-200">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold font-display text-stone-900">
                  Device Passcode Security
                </h3>
                <p className="text-[11px] text-stone-500 font-mono">
                  {securityMagnet.name} ({securityMagnet.nfcUid})
                </p>
              </div>
            </div>

            <form onSubmit={handleSaveSecurity} className="space-y-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-stone-800 block">Require Passcode to View</span>
                  <span className="text-[10px] text-stone-500">Locks physical tap & QR destination</span>
                </div>
                <input
                  type="checkbox"
                  checked={secIsProtected}
                  onChange={(e) => setSecIsProtected(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                />
              </div>

              {secIsProtected && (
                <>
                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Device Passcode / PIN
                    </label>
                    <div className="relative">
                      <input
                        type={secShowPassword ? 'text' : 'password'}
                        required={secIsProtected}
                        value={secPassword}
                        onChange={(e) => setSecPassword(e.target.value)}
                        placeholder="e.g. 2024 or Secret123"
                        className="w-full border border-stone-300 rounded-lg p-2.5 font-mono text-xs pr-9 focus:ring-1 focus:ring-stone-950 focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={() => setSecShowPassword(!secShowPassword)}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
                      >
                        {secShowPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">
                      Passcode Hint (Optional)
                    </label>
                    <input
                      type="text"
                      value={secHint}
                      onChange={(e) => setSecHint(e.target.value)}
                      placeholder="e.g. Wedding year or Street number"
                      className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:ring-1 focus:ring-stone-950 focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-semibold text-stone-800 block mb-1">Passcode Type</label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setSecMode('pin')}
                        className={`py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                          secMode === 'pin' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'
                        }`}
                      >
                        Numeric PIN
                      </button>
                      <button
                        type="button"
                        onClick={() => setSecMode('password')}
                        className={`py-1.5 px-3 rounded-lg border text-xs font-semibold ${
                          secMode === 'password' ? 'bg-stone-900 text-white' : 'bg-stone-50 text-stone-700'
                        }`}
                      >
                        Alphanumeric
                      </button>
                    </div>
                  </div>
                </>
              )}

              {secSuccessMsg && (
                <div className="p-2.5 bg-emerald-50 text-emerald-900 rounded-lg border border-emerald-200 text-[11px] font-semibold flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{secSuccessMsg}</span>
                </div>
              )}

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setSecurityMagnet(null)}
                  className="flex-1 py-2 text-xs font-semibold border border-stone-300 rounded-lg text-stone-700"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 text-xs font-semibold bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg"
                >
                  Save Passcode
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Fallback QR Modal */}
      {qrModalDataUrl && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xs w-full p-6 text-center shadow-2xl border border-stone-200">
            <h3 className="text-sm font-bold font-display text-stone-900 mb-1">
              Magnet QR Fallback
            </h3>
            <p className="text-[11px] text-stone-500 mb-3">
              Encodes: /m/{qrModalSlug}
            </p>

            <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 inline-block mb-4">
              <img src={qrModalDataUrl} alt="QR" className="w-48 h-48 mx-auto" />
            </div>

            <div className="space-y-2">
              <button
                onClick={() => downloadQrPng(qrModalDataUrl, `magnet-${qrModalSlug}-qr.png`)}
                className="w-full bg-stone-900 hover:bg-stone-800 text-white font-semibold py-2 px-3 rounded-lg text-xs flex items-center justify-center gap-1.5"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
              <button
                onClick={() => setQrModalDataUrl(null)}
                className="w-full py-1.5 text-xs text-stone-500 hover:text-stone-900"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
