import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Type,
  Sparkles,
  RotateCw,
  Trash2,
  Undo2,
  Redo2,
  Check,
  AlertTriangle,
  ShoppingBag,
  Save,
  Link as LinkIcon,
  Layers,
  Palette,
  Eye,
  Smartphone,
  Music,
  Heart,
  QrCode,
} from 'lucide-react';
import { Product, ProductVariant, CustomizationDesign, DesignLayer } from '../types';
import { DESIGN_TEMPLATES } from '../data/templates';
import { formatCurrency } from '../lib/pricing';
import { storage } from '../lib/storage';
import { NFCProvider } from '../lib/nfc';

interface CustomizeStudioViewProps {
  product: Product;
  onAddToCartSuccess: () => void;
  onNavigateHome: () => void;
  onPreviewSmartLink: (slug: string) => void;
}

export const CustomizeStudioView: React.FC<CustomizeStudioViewProps> = ({
  product,
  onAddToCartSuccess,
  onNavigateHome,
  onPreviewSmartLink,
}) => {
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant>(product.variants[0]);
  const [activeTab, setActiveTab] = useState<'upload' | 'templates' | 'text' | 'nfc' | 'finish'>('upload');
  const [finish, setFinish] = useState<'gloss' | 'matte' | 'brushed'>('gloss');
  const [magnetBgColor, setMagnetBgColor] = useState('#ffffff');
  const [showGuides, setShowGuides] = useState(true);

  // Design layers
  const [layers, setLayers] = useState<DesignLayer[]>([
    {
      id: 'layer-base-photo',
      type: 'image',
      x: 10,
      y: 10,
      width: 80,
      height: 60,
      rotation: 0,
      content: product.images[0],
      zIndex: 1,
    },
    {
      id: 'layer-main-title',
      type: 'text',
      x: 10,
      y: 75,
      width: 80,
      height: 12,
      rotation: 0,
      content: 'Our Special Moment',
      fontFamily: 'Syne',
      fontSize: 18,
      color: '#1c1917',
      zIndex: 2,
    },
    {
      id: 'layer-sub-date',
      type: 'text',
      x: 10,
      y: 87,
      width: 80,
      height: 8,
      rotation: 0,
      content: 'Forever & Always · 2026',
      fontFamily: 'Plus Jakarta Sans',
      fontSize: 10,
      color: '#78716c',
      zIndex: 3,
    },
  ]);

  const [activeLayerId, setActiveLayerId] = useState<string>('layer-base-photo');
  const [history, setHistory] = useState<DesignLayer[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);

  // Image quality & DPI check
  const [uploadedImageMeta, setUploadedImageMeta] = useState<{
    width: number;
    height: number;
    dpi: number;
    isSufficient: boolean;
  }>({
    width: 1200,
    height: 900,
    dpi: 300,
    isSufficient: true,
  });

  // NFC & Smart Link destination configuration
  const [destinationType, setDestinationType] = useState<'hub' | 'spotify' | 'photos' | 'instagram' | 'custom'>('hub');
  const [customDestinationUrl, setCustomDestinationUrl] = useState('https://open.spotify.com');
  const [smartLinkSlug, setSmartLinkSlug] = useState(`memory-${Math.random().toString(36).substring(2, 7)}`);
  const [urlValidationNotice, setUrlValidationNotice] = useState<string>('');
  const [savedNotice, setSavedNotice] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Push state to undo/redo history
  const pushToHistory = (newLayers: DesignLayer[]) => {
    const updatedHistory = history.slice(0, historyIndex + 1);
    updatedHistory.push(newLayers);
    setHistory(updatedHistory);
    setHistoryIndex(updatedHistory.length - 1);
    setLayers(newLayers);
  };

  const handleUndo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setLayers(history[historyIndex - 1]);
    }
  };

  const handleRedo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setLayers(history[historyIndex + 1]);
    }
  };

  // Image upload with DPI & print-size validation
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file (JPG, PNG, HEIC, or WebP).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        // Assume target print physical size ~3 inches (76mm)
        // 300 DPI target = 900px minimum dimension
        const minDimension = Math.min(img.width, img.height);
        const estimatedDpi = Math.round(minDimension / 3.0);
        const isSufficient = estimatedDpi >= 200;

        setUploadedImageMeta({
          width: img.width,
          height: img.height,
          dpi: estimatedDpi,
          isSufficient,
        });

        // Update photo layer
        const updated = layers.map((layer) => {
          if (layer.id === 'layer-base-photo') {
            return {
              ...layer,
              content: event.target?.result as string,
            };
          }
          return layer;
        });

        pushToHistory(updated);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  // Template loader
  const handleApplyTemplate = (tmpl: typeof DESIGN_TEMPLATES[0]) => {
    setLayers(tmpl.layers);
    setMagnetBgColor(tmpl.backgroundColor);
    setFinish(tmpl.defaultFinish);
    if (tmpl.sampleNfcUrl) {
      setCustomDestinationUrl(tmpl.sampleNfcUrl);
    }
    pushToHistory(tmpl.layers);
  };

  // Active layer manipulator
  const activeLayer = layers.find((l) => l.id === activeLayerId);

  const updateActiveLayer = (updates: Partial<DesignLayer>) => {
    if (!activeLayerId) return;
    const updated = layers.map((layer) => {
      if (layer.id === activeLayerId) {
        return { ...layer, ...updates };
      }
      return layer;
    });
    pushToHistory(updated);
  };

  const handleRotateActiveLayer = () => {
    if (!activeLayer) return;
    updateActiveLayer({ rotation: (activeLayer.rotation + 90) % 360 });
  };

  const handleDeleteActiveLayer = () => {
    if (!activeLayerId || activeLayerId === 'layer-base-photo') return;
    const filtered = layers.filter((l) => l.id !== activeLayerId);
    pushToHistory(filtered);
    setActiveLayerId('layer-base-photo');
  };

  // Add new text layer
  const handleAddText = () => {
    const newTextLayer: DesignLayer = {
      id: `text-${Date.now()}`,
      type: 'text',
      x: 20,
      y: 50,
      width: 60,
      height: 10,
      rotation: 0,
      content: 'Add Custom Note',
      fontFamily: 'Syne',
      fontSize: 16,
      color: '#18181b',
      zIndex: layers.length + 1,
    };
    pushToHistory([...layers, newTextLayer]);
    setActiveLayerId(newTextLayer.id);
  };

  // Save draft
  const handleSaveDraft = () => {
    const textLayer = layers.find((l) => l.type === 'text');
    const photoLayer = layers.find((l) => l.type === 'image');

    const draft: CustomizationDesign = {
      id: `design-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      selectedVariant,
      finish,
      previewImageUrl: photoLayer?.content || product.images[0],
      imageDpi: uploadedImageMeta.dpi,
      isDpiSufficient: uploadedImageMeta.isSufficient,
      layers,
      backgroundColor: magnetBgColor,
      magnetText: textLayer?.content || product.name,
      magnetSubtext: `${selectedVariant.sizeLabel} · ${finish} finish`,
      nfcDestinationUrl: destinationType === 'hub' ? `https://themagnethouse.com/m/${smartLinkSlug}` : customDestinationUrl,
      smartLinkSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.saveDesign(draft);
    setSavedNotice(true);
    setTimeout(() => setSavedNotice(false), 3000);
  };

  // Add to Bag with custom design snapshot
  const handleAddToCart = () => {
    const validation = NFCProvider.validateDestinationUrl(
      destinationType === 'hub' ? `https://themagnethouse.com/m/${smartLinkSlug}` : customDestinationUrl
    );

    if (!validation.isValid) {
      setUrlValidationNotice(validation.error || 'Invalid destination web address.');
      setActiveTab('nfc');
      return;
    }

    const textLayer = layers.find((l) => l.type === 'text');
    const photoLayer = layers.find((l) => l.type === 'image');

    const designSnapshot: CustomizationDesign = {
      id: `cust-${Date.now()}`,
      productId: product.id,
      productName: product.name,
      selectedVariant,
      finish,
      previewImageUrl: photoLayer?.content || product.images[0],
      imageDpi: uploadedImageMeta.dpi,
      isDpiSufficient: uploadedImageMeta.isSufficient,
      layers,
      backgroundColor: magnetBgColor,
      magnetText: textLayer?.content || product.name,
      magnetSubtext: `${selectedVariant.sizeLabel} · ${finish} finish`,
      nfcDestinationUrl: destinationType === 'hub' ? `https://themagnethouse.com/m/${smartLinkSlug}` : customDestinationUrl,
      smartLinkSlug,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    storage.addToCart({
      id: `ci-${Date.now()}`,
      productId: product.id,
      product: product,
      variant: selectedVariant,
      customDesign: designSnapshot,
      quantity: 1,
      price: selectedVariant.price,
    });

    onAddToCartSuccess();
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      {/* Studio Top Control Strip */}
      <div className="bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between z-20">
        <div className="flex items-center gap-3">
          <button
            onClick={onNavigateHome}
            className="text-xs text-stone-500 hover:text-stone-900 font-medium"
          >
            ← Exit Studio
          </button>
          <span className="hidden sm:inline text-stone-300">|</span>
          <span className="text-xs sm:text-sm font-bold text-stone-900 font-display">
            Customizing: {product.name}
          </span>
        </div>

        {/* Undo / Redo / Guides / Save */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleUndo}
            disabled={historyIndex <= 0}
            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded-lg hover:bg-stone-100"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={handleRedo}
            disabled={historyIndex >= history.length - 1}
            className="p-1.5 text-stone-600 hover:text-stone-900 disabled:opacity-30 rounded-lg hover:bg-stone-100"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <span className="text-stone-300">|</span>

          <button
            onClick={() => setShowGuides(!showGuides)}
            className={`px-2.5 py-1 text-xs font-medium rounded-lg border transition-colors ${
              showGuides
                ? 'bg-stone-900 text-white border-stone-900'
                : 'bg-white text-stone-600 border-stone-300'
            }`}
          >
            Safe Bleed Lines
          </button>

          <button
            onClick={handleSaveDraft}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 transition-colors"
          >
            <Save className="w-3.5 h-3.5" />
            <span>{savedNotice ? 'Saved Draft!' : 'Save Draft'}</span>
          </button>

          <button
            onClick={handleAddToCart}
            className="bg-emerald-600 hover:bg-emerald-500 text-white px-4 py-1.5 rounded-lg text-xs sm:text-sm font-bold shadow-xs transition-colors flex items-center gap-1.5"
          >
            <ShoppingBag className="w-4 h-4" />
            <span>Add to Bag ({formatCurrency(selectedVariant.price)})</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace: Left (Tools) - Center (Canvas) - Right (Properties) */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* Left Toolbar */}
        <div className="lg:col-span-3 bg-white border-r border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-6">
          {/* Tool Tabs */}
          <div className="grid grid-cols-4 gap-1 p-1 bg-stone-100 rounded-xl">
            <button
              onClick={() => setActiveTab('upload')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center gap-1 ${
                activeTab === 'upload' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Upload className="w-4 h-4" />
              <span>Photo</span>
            </button>

            <button
              onClick={() => setActiveTab('templates')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center gap-1 ${
                activeTab === 'templates' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Sparkles className="w-4 h-4" />
              <span>Layouts</span>
            </button>

            <button
              onClick={() => setActiveTab('text')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center gap-1 ${
                activeTab === 'text' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600'
              }`}
            >
              <Type className="w-4 h-4" />
              <span>Text</span>
            </button>

            <button
              onClick={() => setActiveTab('nfc')}
              className={`p-2 rounded-lg text-xs font-semibold transition-colors flex flex-col items-center gap-1 ${
                activeTab === 'nfc' ? 'bg-emerald-600 text-white shadow-xs' : 'text-stone-600'
              }`}
            >
              <Smartphone className="w-4 h-4" />
              <span>NFC / Link</span>
            </button>
          </div>

          {/* Tab 1: Upload Photo */}
          {activeTab === 'upload' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                  Upload High-Res Memory
                </h4>
                <p className="text-xs text-stone-500">
                  Select your favorite portrait, wedding photo, or travel snap.
                </p>
              </div>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />

              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full border-2 border-dashed border-stone-300 hover:border-stone-900 rounded-2xl p-6 text-center transition-colors group cursor-pointer"
              >
                <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto mb-2 text-stone-500 group-hover:bg-stone-900 group-hover:text-white transition-colors">
                  <Upload className="w-5 h-5" />
                </div>
                <span className="text-xs font-bold text-stone-900 block">
                  Click to Browse Photo
                </span>
                <span className="text-[11px] text-stone-400 block mt-1">
                  Supports JPG, PNG, WEBP (Up to 25MB)
                </span>
              </button>

              {/* Print Resolution & DPI Checker Card */}
              <div
                className={`p-3.5 rounded-xl border text-xs ${
                  uploadedImageMeta.isSufficient
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-2">
                  {uploadedImageMeta.isSufficient ? (
                    <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div>
                    <span className="font-bold">
                      {uploadedImageMeta.isSufficient
                        ? 'High-Resolution Print Quality Verified'
                        : 'Image Resolution Warning'}
                    </span>
                    <p className="text-[11px] mt-0.5 leading-relaxed opacity-90">
                      {uploadedImageMeta.isSufficient
                        ? `Resolution is approx ${uploadedImageMeta.dpi} DPI. Perfect for museum-grade diamond-polished finish.`
                        : `Current resolution (~${uploadedImageMeta.dpi} DPI) is below the recommended 200 DPI. Your image may look soft or pixelated when printed.`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Preset Design Templates */}
          {activeTab === 'templates' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                  Ready-Made Layouts
                </h4>
                <p className="text-xs text-stone-500">
                  Select a curated starter layout tailored for your theme.
                </p>
              </div>

              <div className="space-y-3">
                {DESIGN_TEMPLATES.map((tmpl) => (
                  <div
                    key={tmpl.id}
                    onClick={() => handleApplyTemplate(tmpl)}
                    className="flex items-center gap-3 p-2.5 rounded-xl border border-stone-200 hover:border-stone-900 bg-white transition-all cursor-pointer group"
                  >
                    <img
                      src={tmpl.thumbnail}
                      alt={tmpl.name}
                      className="w-12 h-12 rounded-lg object-cover bg-stone-100"
                    />
                    <div className="flex-1">
                      <h5 className="text-xs font-bold text-stone-900 group-hover:text-stone-700">
                        {tmpl.name}
                      </h5>
                      <p className="text-[11px] text-stone-500 line-clamp-1">{tmpl.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab 3: Typography */}
          {activeTab === 'text' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
                  Custom Inscriptions
                </h4>
                <p className="text-xs text-stone-500">
                  Add names, anniversaries, Spotify codes, or quotes.
                </p>
              </div>

              <button
                onClick={handleAddText}
                className="w-full py-2.5 px-4 bg-stone-900 text-white rounded-xl text-xs font-semibold hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
              >
                <Type className="w-4 h-4" />
                <span>Add Text Box</span>
              </button>

              <div className="pt-2 border-t border-stone-200 space-y-2">
                <span className="text-xs font-semibold text-stone-700">Current Text Elements:</span>
                {layers
                  .filter((l) => l.type === 'text')
                  .map((tLayer) => (
                    <div
                      key={tLayer.id}
                      onClick={() => setActiveLayerId(tLayer.id)}
                      className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between ${
                        activeLayerId === tLayer.id
                          ? 'border-stone-900 bg-stone-50 font-bold'
                          : 'border-stone-200 bg-white hover:bg-stone-50'
                      }`}
                    >
                      <span className="truncate max-w-[180px]">{tLayer.content}</span>
                      <span className="text-[10px] text-stone-400 font-mono">
                        {tLayer.fontFamily}
                      </span>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Tab 4: NFC Smart Destination */}
          {activeTab === 'nfc' && (
            <div className="space-y-4">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-800 mb-1 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Program NFC & QR Fallback</span>
                </h4>
                <p className="text-xs text-stone-600 leading-relaxed">
                  Decide what opens when someone taps your fridge magnet. You can change this anytime later.
                </p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-stone-800 block">
                  Destination Experience:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'hub', label: 'Smart Link Hub', desc: 'Photos, videos & links' },
                    { id: 'spotify', label: 'Spotify Playlist', desc: 'Direct song launch' },
                    { id: 'photos', label: 'Google Photos', desc: 'Shared family album' },
                    { id: 'custom', label: 'Custom Web Link', desc: 'Any web URL' },
                  ].map((dest) => (
                    <button
                      key={dest.id}
                      onClick={() => setDestinationType(dest.id as typeof destinationType)}
                      className={`p-2.5 rounded-xl border text-left text-xs transition-all ${
                        destinationType === dest.id
                          ? 'border-emerald-700 bg-emerald-50 text-emerald-950 font-semibold'
                          : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                      }`}
                    >
                      <div>{dest.label}</div>
                      <div className="text-[10px] text-stone-500 font-normal">{dest.desc}</div>
                    </button>
                  ))}
                </div>
              </div>

              {destinationType === 'hub' ? (
                <div className="bg-stone-50 p-3 rounded-xl border border-stone-200 text-xs space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-stone-800">Your Hub Link:</span>
                    <button
                      onClick={() => onPreviewSmartLink(smartLinkSlug)}
                      className="text-emerald-700 font-medium hover:underline flex items-center gap-1 text-[11px]"
                    >
                      <Eye className="w-3 h-3" /> Preview
                    </button>
                  </div>
                  <div className="font-mono text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200 break-all">
                    https://themagnethouse.com/m/{smartLinkSlug}
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Host unlimited photos, wedding video embed, social links, and track visitor taps.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-stone-800 block">
                    Enter Destination Web Address:
                  </label>
                  <input
                    type="url"
                    value={customDestinationUrl}
                    onChange={(e) => {
                      setCustomDestinationUrl(e.target.value);
                      setUrlValidationNotice('');
                    }}
                    placeholder="https://open.spotify.com/track/..."
                    className="w-full bg-white border border-stone-300 rounded-xl p-2.5 text-xs text-stone-900 focus:ring-1 focus:ring-stone-900"
                  />
                  {urlValidationNotice && (
                    <p className="text-[11px] text-rose-600 font-medium">{urlValidationNotice}</p>
                  )}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Center: Live Product Canvas Preview */}
        <div className="lg:col-span-6 bg-stone-200/70 p-6 sm:p-10 flex flex-col items-center justify-center relative overflow-hidden">
          {/* Surface Indicator */}
          <div className="absolute top-4 text-xs font-mono text-stone-600 bg-white/70 backdrop-blur-xs px-3 py-1 rounded-full border border-stone-300">
            Real Fridge Preview · {selectedVariant.sizeLabel} · {finish.toUpperCase()}
          </div>

          {/* Magnet Container with physical shadow and realistic sheen */}
          <div
            className={`relative rounded-3xl overflow-hidden shadow-2xl transition-all duration-300 border border-stone-300/80 ${
              finish === 'gloss' ? 'shadow-stone-900/20' : 'shadow-stone-900/10'
            }`}
            style={{
              width: '320px',
              height: '320px',
              backgroundColor: magnetBgColor,
            }}
          >
            {/* Safe Bleed Guide lines */}
            {showGuides && (
              <div className="absolute inset-2 border border-dashed border-rose-400/40 rounded-2xl pointer-events-none z-30 flex items-start justify-end p-1">
                <span className="text-[9px] font-mono text-rose-500/80">SAFE PRINT AREA</span>
              </div>
            )}

            {/* Gloss reflection overlay */}
            {finish === 'gloss' && (
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/30 pointer-events-none z-20" />
            )}

            {/* Render Layers */}
            {layers.map((layer) => {
              const isSelected = activeLayerId === layer.id;

              if (layer.type === 'image') {
                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`absolute cursor-pointer overflow-hidden rounded-xl ${
                      isSelected ? 'ring-2 ring-stone-950 ring-offset-2' : ''
                    }`}
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: `${layer.width}%`,
                      height: `${layer.height}%`,
                      transform: `rotate(${layer.rotation}deg)`,
                      zIndex: layer.zIndex,
                    }}
                  >
                    <img
                      src={layer.content}
                      alt="Custom memory"
                      className="w-full h-full object-cover"
                    />
                  </div>
                );
              }

              if (layer.type === 'text') {
                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveLayerId(layer.id)}
                    className={`absolute cursor-pointer flex items-center justify-center text-center p-1 select-none ${
                      isSelected ? 'ring-2 ring-stone-950 ring-offset-1 rounded-md' : ''
                    }`}
                    style={{
                      left: `${layer.x}%`,
                      top: `${layer.y}%`,
                      width: `${layer.width}%`,
                      height: `${layer.height}%`,
                      transform: `rotate(${layer.rotation}deg)`,
                      zIndex: layer.zIndex,
                      fontFamily: layer.fontFamily || 'Plus Jakarta Sans',
                      fontSize: `${layer.fontSize}px`,
                      color: layer.color || '#18181b',
                    }}
                  >
                    <span className="font-semibold leading-tight">{layer.content}</span>
                  </div>
                );
              }

              return null;
            })}

            {/* Embedded Micro NFC indicator in corner */}
            <div className="absolute bottom-2.5 right-2.5 z-20 flex items-center gap-1 bg-stone-950/80 text-white text-[9px] font-mono px-1.5 py-0.5 rounded-sm backdrop-blur-xs">
              <span>NFC</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
          </div>

          <div className="mt-6 flex items-center gap-3 text-xs text-stone-500">
            <span>Click any item on the magnet to select & edit</span>
          </div>
        </div>

        {/* Right Properties Panel */}
        <div className="lg:col-span-3 bg-white border-l border-stone-200 p-4 sm:p-6 overflow-y-auto space-y-6">
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-stone-900 mb-1">
              Properties & Sizing
            </h4>
            <span className="text-xs text-stone-500">Selected: {activeLayer?.type || 'Magnet'}</span>
          </div>

          {/* Size Variant */}
          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-2">
              Magnet Dimension:
            </label>
            <div className="space-y-1.5">
              {product.variants.map((v) => (
                <button
                  key={v.id}
                  onClick={() => setSelectedVariant(v)}
                  className={`w-full p-2.5 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${
                    selectedVariant.id === v.id
                      ? 'border-stone-950 bg-stone-950 text-white font-medium'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-300'
                  }`}
                >
                  <span>{v.sizeLabel}</span>
                  <span className="font-mono tabular-nums">{formatCurrency(v.price)}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Finish */}
          <div>
            <label className="text-xs font-semibold text-stone-800 block mb-2">
              Surface Finish:
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['gloss', 'matte', 'brushed'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFinish(f)}
                  className={`py-2 px-2 text-xs font-semibold rounded-lg border capitalize transition-colors ${
                    finish === f
                      ? 'bg-stone-900 text-white border-stone-900'
                      : 'bg-white text-stone-700 border-stone-200'
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
          </div>

          {/* Layer Editing: If Text */}
          {activeLayer && activeLayer.type === 'text' && (
            <div className="space-y-3 pt-3 border-t border-stone-200">
              <label className="text-xs font-semibold text-stone-800 block">Edit Inscription:</label>
              <input
                type="text"
                value={activeLayer.content}
                onChange={(e) => updateActiveLayer({ content: e.target.value })}
                className="w-full border border-stone-300 rounded-lg p-2 text-xs"
              />

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">Font Family</label>
                  <select
                    value={activeLayer.fontFamily}
                    onChange={(e) => updateActiveLayer({ fontFamily: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-1.5 text-xs"
                  >
                    <option value="Syne">Syne (Display)</option>
                    <option value="Plus Jakarta Sans">Plus Jakarta (Modern)</option>
                    <option value="JetBrains Mono">JetBrains (Technical)</option>
                  </select>
                </div>

                <div>
                  <label className="text-[11px] text-stone-500 block mb-1">Font Size</label>
                  <input
                    type="range"
                    min="10"
                    max="32"
                    value={activeLayer.fontSize || 14}
                    onChange={(e) => updateActiveLayer({ fontSize: Number(e.target.value) })}
                    className="w-full accent-stone-900"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] text-stone-500 block mb-1">Color</label>
                <div className="flex gap-2">
                  {['#18181b', '#ffffff', '#b91c1c', '#047857', '#d97706', '#4338ca'].map((c) => (
                    <button
                      key={c}
                      onClick={() => updateActiveLayer({ color: c })}
                      className="w-6 h-6 rounded-full border border-stone-300"
                      style={{ backgroundColor: c }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleRotateActiveLayer}
                  className="flex-1 py-1.5 text-xs border border-stone-300 rounded-lg flex items-center justify-center gap-1"
                >
                  <RotateCw className="w-3 h-3" /> Rotate
                </button>
                <button
                  onClick={handleDeleteActiveLayer}
                  className="py-1.5 px-3 text-xs border border-rose-300 text-rose-700 rounded-lg hover:bg-rose-50"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* Background Canvas Color */}
          <div className="pt-3 border-t border-stone-200">
            <label className="text-xs font-semibold text-stone-800 block mb-2">
              Magnet Base Canvas:
            </label>
            <div className="flex gap-2">
              {['#ffffff', '#18181b', '#f5f5f4', '#e2e8f0', '#fef3c7'].map((col) => (
                <button
                  key={col}
                  onClick={() => setMagnetBgColor(col)}
                  className={`w-7 h-7 rounded-full border transition-all ${
                    magnetBgColor === col ? 'ring-2 ring-stone-900 ring-offset-1' : 'border-stone-300'
                  }`}
                  style={{ backgroundColor: col }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
