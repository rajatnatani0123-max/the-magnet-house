import React, { useState } from 'react';
import { Smartphone, Sparkles, ExternalLink, Music, MapPin, Youtube, RefreshCw } from 'lucide-react';
import { ASSET_IMAGES } from '../lib/constants';

interface NfcTapSimulatorProps {
  onOpenHubDemo: (slug: string) => void;
}

export const NfcTapSimulator: React.FC<NfcTapSimulatorProps> = ({ onOpenHubDemo }) => {
  const [activeDemo, setActiveDemo] = useState<'couple' | 'spotify' | 'travel'>('couple');
  const [isTapping, setIsTapping] = useState(false);
  const [isUnlocked, setIsUnlocked] = useState(false);

  const demoConfigs = {
    couple: {
      magnetTitle: 'Aarav & Meera',
      magnetSubtitle: 'Dec 14, 2024',
      image: ASSET_IMAGES.productCoupleAcrylic,
      slug: 'aarav-meera-wedding',
      hubTitle: 'Aarav & Meera Wedding Hub',
      hubDesc: 'Wedding Film, Photos & Song',
      color: 'from-amber-100 to-rose-50',
      actionIcon: Youtube,
      actionText: 'Watch Wedding Film 4K',
    },
    spotify: {
      magnetTitle: "Can't Help Falling in Love",
      magnetSubtitle: 'Our First Dance Song',
      image: ASSET_IMAGES.productSpotifyBlack,
      slug: 'first-dance-playlist',
      hubTitle: 'Spotify First Dance',
      hubDesc: 'Now Playing · High Fidelity Audio',
      color: 'from-emerald-950 to-stone-900',
      actionIcon: Music,
      actionText: 'Launch Track in Spotify',
    },
    travel: {
      magnetTitle: 'Amalfi Coast Roadtrip',
      magnetSubtitle: 'Positano & Ravello 2025',
      image: ASSET_IMAGES.productTravelPolaroid,
      slug: 'amalfi-coast-roadtrip',
      hubTitle: 'Amalfi Travel Diary',
      hubDesc: 'Google Maps Route & 35mm Gallery',
      color: 'from-sky-100 to-amber-50',
      actionIcon: MapPin,
      actionText: 'Open Roadtrip Map & Pins',
    },
  };

  const current = demoConfigs[activeDemo];

  const triggerTap = () => {
    if (isTapping) return;
    setIsTapping(true);
    setIsUnlocked(false);

    setTimeout(() => {
      setIsUnlocked(true);
      setIsTapping(false);
    }, 900);
  };

  const resetDemo = () => {
    setIsUnlocked(false);
    setIsTapping(false);
  };

  return (
    <div className="bg-stone-900 rounded-3xl p-6 sm:p-10 text-white overflow-hidden border border-stone-800 relative">
      {/* Background glow subtle */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-stone-800/40 rounded-full blur-3xl pointer-events-none" />

      {/* Header controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 relative z-10">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive Visual Demonstration</span>
          </div>
          <h3 className="text-xl sm:text-2xl font-bold font-display mt-1">
            Tap Your Phone. Watch It Open.
          </h3>
          <p className="text-xs sm:text-sm text-stone-400 mt-1 max-w-lg">
            No app download needed. Native iOS & Android NFC micro-handshake brings the magnet to life instantly.
          </p>
        </div>

        {/* Demo Switcher */}
        <div className="flex items-center gap-1.5 p-1 bg-stone-800 rounded-xl self-start sm:self-auto">
          {(['couple', 'spotify', 'travel'] as const).map((type) => (
            <button
              key={type}
              onClick={() => {
                setActiveDemo(type);
                setIsUnlocked(false);
              }}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors capitalize ${
                activeDemo === type
                  ? 'bg-stone-950 text-white shadow-xs'
                  : 'text-stone-400 hover:text-white'
              }`}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {/* Main Interactive Stage */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center relative z-10">
        {/* Left: Physical Fridge Magnet Display */}
        <div className="lg:col-span-6 flex flex-col items-center justify-center p-6 bg-stone-950/60 rounded-2xl border border-stone-800/80">
          <div className="text-xs text-stone-400 mb-3 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Physical Refrigerator Surface</span>
          </div>

          {/* Magnet Container */}
          <div className="relative group">
            {/* Pulsing NFC Ripple Waves when tapping */}
            {isTapping && (
              <div className="absolute inset-0 -m-8 rounded-3xl border-2 border-emerald-400/60 animate-ping pointer-events-none" />
            )}

            <div className="w-64 sm:w-72 aspect-square rounded-2xl overflow-hidden shadow-2xl border border-stone-700 bg-stone-900 relative">
              <img
                src={current.image}
                alt={current.magnetTitle}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex flex-col justify-end p-4">
                <span className="text-xs font-mono text-emerald-400 font-semibold tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> NTAG213 ACTIVE
                </span>
                <h4 className="text-base font-bold text-white font-display">
                  {current.magnetTitle}
                </h4>
                <p className="text-xs text-stone-300">{current.magnetSubtitle}</p>
              </div>

              {/* NFC Chip Icon Indicator */}
              <div className="absolute top-3 right-3 bg-stone-900/90 text-white text-[10px] font-mono px-2 py-1 rounded-md border border-stone-700 flex items-center gap-1">
                <span>NFC</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              </div>
            </div>
          </div>

          {/* Trigger Button */}
          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={triggerTap}
              disabled={isTapping}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs sm:text-sm py-2.5 px-6 rounded-xl transition-all shadow-md flex items-center gap-2 active:scale-95 disabled:opacity-50"
            >
              <Smartphone className={`w-4 h-4 ${isTapping ? 'animate-bounce' : ''}`} />
              <span>{isTapping ? 'Approaching & Reading NFC...' : 'Simulate Phone Tap'}</span>
            </button>

            {isUnlocked && (
              <button
                onClick={resetDemo}
                className="p-2 text-stone-400 hover:text-white rounded-lg hover:bg-stone-800 transition-colors"
                title="Reset simulation"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right: Phone Simulation Screen */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="w-72 sm:w-80 rounded-[2.5rem] bg-stone-950 border-4 border-stone-700 shadow-2xl p-3 relative">
            {/* Phone Notch */}
            <div className="absolute top-4 inset-x-0 mx-auto w-24 h-4 bg-stone-900 rounded-full z-20" />

            {/* Phone Inner Screen */}
            <div className="bg-stone-900 rounded-[2rem] h-[480px] overflow-hidden flex flex-col relative border border-stone-800">
              {/* Phone Status Bar */}
              <div className="px-6 pt-3 pb-2 flex justify-between text-[11px] text-stone-400 font-mono">
                <span>09:41</span>
                <span>5G · 100%</span>
              </div>

              {/* State 1: Locked / Awaiting Tap */}
              {!isUnlocked && !isTapping && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-stone-800 flex items-center justify-center text-stone-400 mb-4 animate-pulse">
                    <Smartphone className="w-8 h-8" />
                  </div>
                  <h5 className="text-sm font-semibold text-stone-200">
                    Ready for NFC Contact
                  </h5>
                  <p className="text-xs text-stone-500 mt-1 max-w-[200px]">
                    Hold phone within 2cm of the magnet or click &quot;Simulate Phone Tap&quot;.
                  </p>
                </div>
              )}

              {/* State 2: Reading in progress */}
              {isTapping && (
                <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-emerald-950 border border-emerald-500/50 flex items-center justify-center text-emerald-400 mb-4">
                    <Sparkles className="w-8 h-8 animate-spin" />
                  </div>
                  <h5 className="text-sm font-semibold text-emerald-400">
                    NFC Tag Detected
                  </h5>
                  <p className="text-xs text-stone-400 mt-1 font-mono">
                    Opening themagnethouse.com/m/{current.slug}...
                  </p>
                </div>
              )}

              {/* State 3: Unlocked Smart Link Hub */}
              {isUnlocked && (
                <div className="flex-1 flex flex-col p-4 bg-stone-950 overflow-y-auto animate-fade-in">
                  {/* Digital Hub Card */}
                  <div className="flex items-center gap-3 pb-3 border-b border-stone-800">
                    <img
                      src={current.image}
                      alt="Avatar"
                      className="w-10 h-10 rounded-full object-cover border border-stone-700"
                    />
                    <div className="truncate">
                      <div className="text-xs font-bold text-white truncate">
                        {current.hubTitle}
                      </div>
                      <div className="text-[11px] text-stone-400 truncate">
                        {current.hubDesc}
                      </div>
                    </div>
                  </div>

                  {/* Smart Link Action Items */}
                  <div className="mt-4 space-y-2.5 flex-1">
                    <button
                      onClick={() => onOpenHubDemo(current.slug)}
                      className="w-full bg-stone-800 hover:bg-stone-700 p-3 rounded-xl text-left border border-stone-700 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <current.actionIcon className="w-4 h-4 text-emerald-400" />
                        <span className="text-xs font-medium text-white">
                          {current.actionText}
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
                    </button>

                    <button
                      onClick={() => onOpenHubDemo(current.slug)}
                      className="w-full bg-stone-800/60 hover:bg-stone-700 p-3 rounded-xl text-left border border-stone-800 flex items-center justify-between transition-colors group"
                    >
                      <div className="flex items-center gap-2.5">
                        <Sparkles className="w-4 h-4 text-amber-400" />
                        <span className="text-xs font-medium text-stone-200">
                          Full Smart Link Hub Experience
                        </span>
                      </div>
                      <ExternalLink className="w-3.5 h-3.5 text-stone-400 group-hover:text-white" />
                    </button>
                  </div>

                  {/* Public Link Hub shortcut button */}
                  <button
                    onClick={() => onOpenHubDemo(current.slug)}
                    className="mt-4 w-full bg-stone-100 hover:bg-white text-stone-950 font-bold py-2 px-3 rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5"
                  >
                    <span>Open Public /m/{current.slug}</span>
                    <ExternalLink className="w-3 h-3" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
