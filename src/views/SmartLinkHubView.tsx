import React, { useState, useEffect } from 'react';
import {
  ExternalLink,
  Music,
  Instagram,
  Youtube,
  Globe,
  MapPin,
  MessageCircle,
  Download,
  Share2,
  Sparkles,
  QrCode,
  Check,
  Smartphone,
  Lock,
  Unlock,
  KeyRound,
  Eye,
  EyeOff,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { SmartLinkHub, SmartLinkItem } from '../types';
import { storage } from '../lib/storage';
import { generateQrDataUrl, downloadQrPng } from '../lib/qr';

interface SmartLinkHubViewProps {
  slug: string;
  onNavigateHome: () => void;
}

export const SmartLinkHubView: React.FC<SmartLinkHubViewProps> = ({
  slug,
  onNavigateHome,
}) => {
  const [hub, setHub] = useState<SmartLinkHub | undefined>(() =>
    storage.getSmartLinkBySlug(slug)
  );
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [showQrModal, setShowQrModal] = useState(false);

  // Device Password Authentication State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(() => storage.isDeviceUnlocked(slug));
  const [passwordInput, setPasswordInput] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  useEffect(() => {
    // Record visit analytics
    storage.recordSmartLinkInteraction(slug, 'tap');
    const loaded = storage.getSmartLinkBySlug(slug);
    setHub(loaded);
    setIsUnlocked(storage.isDeviceUnlocked(slug));

    // Generate dynamic QR code
    const fullUrl = `${window.location.origin}/m/${slug}`;
    generateQrDataUrl(fullUrl, { width: 360, errorCorrectionLevel: 'H' })
      .then(setQrDataUrl)
      .catch((err) => console.error('QR generation error:', err));
  }, [slug]);

  const handleUnlockDevice = (e: React.FormEvent) => {
    e.preventDefault();
    if (!passwordInput.trim()) {
      setAuthError('Please enter the device passcode');
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);

    setTimeout(() => {
      const res = storage.unlockDeviceSession(slug, passwordInput);
      if (res.success) {
        setIsUnlocked(true);
        setPasswordInput('');
      } else {
        setAuthError(res.error || 'Incorrect passcode');
      }
      setIsAuthenticating(false);
    }, 280);
  };

  const handleLockDevice = () => {
    storage.lockDeviceSession(slug);
    setIsUnlocked(false);
  };

  if (!hub) {
    return (
      <div className="min-h-screen bg-stone-900 text-white flex flex-col items-center justify-center p-6 text-center">
        <Sparkles className="w-12 h-12 text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold font-display">Smart Link Hub Not Found</h2>
        <p className="text-sm text-stone-400 mt-2 max-w-sm">
          No smart magnet is registered with slug &quot;{slug}&quot;. If you just ordered, it will appear once verified.
        </p>
        <button
          onClick={onNavigateHome}
          className="mt-6 px-6 py-2.5 bg-white text-stone-900 font-semibold rounded-xl text-xs hover:bg-stone-100"
        >
          Return to Storefront
        </button>
      </div>
    );
  }

  // Device-Level Password Authentication Gate
  if (hub.isPasswordProtected && !isUnlocked) {
    return (
      <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center justify-center p-4 sm:p-6 relative overflow-hidden">
        {/* Subtle Ambient Glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-md w-full bg-stone-900/90 border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 backdrop-blur-md text-center">
          {/* Header Lock Shield */}
          <div className="relative inline-block mb-4">
            <div className="w-16 h-16 rounded-2xl bg-stone-800 border border-stone-700 flex items-center justify-center mx-auto text-emerald-400 shadow-inner">
              <Lock className="w-8 h-8" />
            </div>
            <span className="absolute -bottom-1 -right-1 bg-emerald-500 text-stone-950 p-1 rounded-full text-xs shadow-md">
              <KeyRound className="w-3.5 h-3.5" />
            </span>
          </div>

          <div className="inline-block px-2.5 py-0.5 rounded-full bg-emerald-950/80 border border-emerald-800 text-[10px] font-mono uppercase tracking-wider text-emerald-400 mb-2">
            Protected Smart Magnet Device
          </div>

          <h2 className="text-xl font-bold font-display text-white">{hub.title}</h2>
          {hub.subtitle && (
            <p className="text-xs text-stone-400 font-mono mt-0.5">{hub.subtitle}</p>
          )}

          <p className="text-xs text-stone-300 mt-3 leading-relaxed">
            This physical smart magnet is protected with device-level passcode authentication. Please enter the passcode to unlock its private links and media.
          </p>

          {/* Authentication Form */}
          <form onSubmit={handleUnlockDevice} className="mt-6 space-y-4">
            <div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={passwordInput}
                  onChange={(e) => {
                    setPasswordInput(e.target.value);
                    if (authError) setAuthError(null);
                  }}
                  placeholder="Enter Device Passcode"
                  autoFocus
                  className={`w-full bg-stone-950 border ${
                    authError ? 'border-rose-500 ring-1 ring-rose-500' : 'border-stone-700'
                  } rounded-2xl px-4 py-3 text-sm text-center font-mono tracking-widest text-white placeholder-stone-500 focus:outline-none focus:ring-2 focus:ring-emerald-500 pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>

              {/* Error feedback */}
              {authError && (
                <div className="flex items-center justify-center gap-1.5 text-xs text-rose-400 font-medium mt-2 animate-shake">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                  <span>{authError}</span>
                </div>
              )}

              {/* Passcode Hint Display */}
              {hub.passwordHint && (
                <div className="text-[11px] text-stone-400 font-mono mt-2">
                  <span className="text-stone-500">Hint:</span> {hub.passwordHint}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isAuthenticating}
              className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-98 text-white font-bold py-3 px-4 rounded-xl text-xs sm:text-sm transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-60"
            >
              <Unlock className="w-4 h-4" />
              <span>{isAuthenticating ? 'Authenticating Device...' : 'Unlock Magnet Hub'}</span>
            </button>
          </form>

          <div className="mt-6 pt-4 border-t border-stone-800 flex justify-between items-center text-[11px] text-stone-400 font-mono">
            <span>NTAG213 Crypto Lock</span>
            <button
              onClick={onNavigateHome}
              className="text-stone-400 hover:text-white transition-colors"
            >
              Storefront
            </button>
          </div>
        </div>
      </div>
    );
  }

  const handleLinkClick = (item: SmartLinkItem) => {
    storage.recordSmartLinkInteraction(slug, 'linkClick', item.id);
    window.open(item.url, '_blank', 'noopener,noreferrer');
  };

  const handleCopyLink = () => {
    navigator.clipboard?.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2500);
  };

  const getLinkIcon = (type: SmartLinkItem['type']) => {
    switch (type) {
      case 'spotify':
        return Music;
      case 'instagram':
        return Instagram;
      case 'youtube':
        return Youtube;
      case 'maps':
        return MapPin;
      case 'whatsapp':
        return MessageCircle;
      default:
        return Globe;
    }
  };

  // Download digital vCard .vcf
  const handleDownloadVcard = () => {
    const vcardContent = `BEGIN:VCARD
VERSION:3.0
FN:${hub.title}
NOTE:${hub.bio}
URL:${window.location.href}
END:VCARD`;

    const blob = new Blob([vcardContent], { type: 'text/vcard;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${hub.slug}-contact.vcf`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-white flex flex-col items-center px-4 py-8 sm:py-12 relative overflow-hidden selection:bg-emerald-500 selection:text-black">
      {/* Background ambient lighting */}
      <div className="absolute top-0 inset-x-0 h-64 bg-gradient-to-b from-stone-800/40 to-transparent pointer-events-none" />

      {/* Top Bar for Smart Hub */}
      <div className="w-full max-w-md flex items-center justify-between mb-4 z-10 text-xs">
        <button
          onClick={onNavigateHome}
          className="text-stone-400 hover:text-white transition-colors"
        >
          ← The Magnet House
        </button>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowQrModal(true)}
            className="p-2 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            title="Show Fallback QR"
          >
            <QrCode className="w-4 h-4" />
          </button>
          <button
            onClick={handleCopyLink}
            className="p-2 rounded-full bg-stone-900 border border-stone-800 text-stone-300 hover:text-white"
            title="Share Smart Hub"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Share2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Authenticated Device Security Banner */}
      {hub.isPasswordProtected && isUnlocked && (
        <div className="w-full max-w-md mb-6 bg-emerald-950/80 border border-emerald-800/80 rounded-xl px-3.5 py-2 flex items-center justify-between text-xs font-mono text-emerald-300 z-10 animate-fade-in shadow-md">
          <span className="flex items-center gap-1.5 font-bold">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>Device Authenticated</span>
          </span>
          <button
            onClick={handleLockDevice}
            className="text-[11px] bg-stone-900 hover:bg-stone-800 text-stone-200 px-2.5 py-1 rounded-lg border border-stone-700 transition-colors flex items-center gap-1"
          >
            <Lock className="w-3 h-3 text-stone-400" />
            <span>Lock</span>
          </button>
        </div>
      )}

      {/* Hub Mobile Container */}
      <div className="w-full max-w-md flex flex-col items-center text-center z-10">
        {/* Profile Avatar / Cover */}
        <div className="relative mb-4">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-3xl overflow-hidden border-2 border-stone-700 shadow-2xl bg-stone-900">
            <img
              src={hub.avatarUrl || '/src/assets/images/product_couple_acrylic_1790772730611.jpg'}
              alt={hub.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-1 -right-1 bg-stone-950 text-emerald-400 text-[10px] font-mono px-2 py-0.5 rounded-full border border-stone-700 flex items-center gap-1 shadow-md">
            <Sparkles className="w-2.5 h-2.5" />
            <span>NFC ACTIVE</span>
          </div>
        </div>

        {/* Title & Bios */}
        <h1 className="text-2xl sm:text-3xl font-bold font-display text-white tracking-tight">
          {hub.title}
        </h1>
        {hub.subtitle && (
          <p className="text-xs font-mono text-emerald-400 mt-1 uppercase tracking-wider">
            {hub.subtitle}
          </p>
        )}
        <p className="text-xs sm:text-sm text-stone-300 mt-3 max-w-sm leading-relaxed">
          {hub.bio}
        </p>

        {/* Quick action: Save Contact vCard */}
        <div className="mt-4 flex gap-2">
          <button
            onClick={handleDownloadVcard}
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-200 text-xs font-semibold py-2 px-3 rounded-xl flex items-center gap-1.5 transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Save to Phone Contacts</span>
          </button>
        </div>

        {/* Link Blocks */}
        <div className="w-full mt-8 space-y-3">
          {hub.links
            .filter((l) => l.active)
            .map((item) => {
              const IconComponent = getLinkIcon(item.type);
              return (
                <button
                  key={item.id}
                  onClick={() => handleLinkClick(item)}
                  className="w-full bg-stone-900/90 hover:bg-stone-800/90 border border-stone-800 hover:border-stone-700 p-4 rounded-2xl flex items-center justify-between text-left transition-all duration-200 group active:scale-98 shadow-sm"
                >
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 bg-stone-800 group-hover:bg-stone-700 rounded-xl transition-colors">
                      <IconComponent className="w-5 h-5 text-emerald-400" />
                    </div>
                    <div>
                      <div className="text-sm font-semibold text-white group-hover:text-emerald-300 transition-colors">
                        {item.title}
                      </div>
                      <div className="text-[11px] text-stone-400 font-mono truncate max-w-[200px]">
                        {item.url.replace(/^https?:\/\//, '')}
                      </div>
                    </div>
                  </div>
                  <ExternalLink className="w-4 h-4 text-stone-500 group-hover:text-white transition-colors" />
                </button>
              );
            })}
        </div>

        {/* Tap Analytics Stats */}
        <div className="mt-12 pt-6 border-t border-stone-800/80 w-full flex items-center justify-around text-xs text-stone-400 font-mono">
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-white tabular-nums">
              {hub.analytics.totalTaps}
            </span>
            <span className="text-[10px] text-stone-500">NFC Taps</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-white tabular-nums">
              {hub.analytics.totalScans}
            </span>
            <span className="text-[10px] text-stone-500">QR Scans</span>
          </div>
          <div className="flex flex-col items-center">
            <span className="text-base font-bold text-emerald-400">Verified</span>
            <span className="text-[10px] text-stone-500">Dual Hardware</span>
          </div>
        </div>

        {/* Powered By Badge */}
        <div className="mt-8 text-center">
          <button
            onClick={onNavigateHome}
            className="text-[11px] text-stone-500 hover:text-stone-400 transition-colors flex items-center gap-1.5 mx-auto"
          >
            <span>Powered by</span>
            <span className="text-white font-bold font-display">The Magnet House</span>
          </button>
        </div>
      </div>

      {/* Fallback QR Modal */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-stone-900 border border-stone-800 rounded-3xl p-6 max-w-sm w-full text-center shadow-2xl">
            <h3 className="text-lg font-bold font-display text-white mb-1">
              Laser-Etched QR Fallback
            </h3>
            <p className="text-xs text-stone-400 mb-4">
              Printed on the reverse of your magnet for phones without NFC.
            </p>

            {qrDataUrl && (
              <div className="bg-white p-4 rounded-2xl mx-auto inline-block shadow-inner mb-4">
                <img src={qrDataUrl} alt="QR Code" className="w-48 h-48" />
              </div>
            )}

            <div className="space-y-2">
              <button
                onClick={() => downloadQrPng(qrDataUrl, `${hub.slug}-qr-print.png`)}
                className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-2 px-4 rounded-xl text-xs flex items-center justify-center gap-2 transition-colors"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download Print-Ready PNG</span>
              </button>

              <button
                onClick={() => setShowQrModal(false)}
                className="w-full py-2 text-xs text-stone-400 hover:text-white"
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
