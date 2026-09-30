# System Architecture — The Magnet House

## 1. System Topology & Decoupling

The platform decouples the physical hardware asset from the digital experience:

```
Physical Fridge Magnet (N52 Magnet + Acrylic/Wood/Metal)
       │
       ▼
NXP NTAG213 NFC Chip / Laser Micro QR Fallback
       │ (Encodes URL: https://themagnethouse.com/m/:slug)
       ▼
The Magnet House Router & Analytics Engine
       │
       ├─► Spotify Deep Link (direct music playback)
       ├─► Google Photos / Drive (family album)
       ├─► YouTube / Vimeo (wedding film 4K)
       ├─► vCard / WhatsApp / Google Maps
       └─► Hosted Smart Link Hub (/m/:slug)
```

## 2. Advantages of the Slotted Architecture
- If the customer changes their wedding playlist, switches Instagram handles, or adds new vacation photos, they **never** need to discard or replace their physical magnet.
- Taps and scans hit the server proxy, incrementing privacy-safe device metrics (`totalTaps`, `totalScans`, `linkClicks`) before rendering the hub or redirecting.

## 3. Data Entities
- **Product & ProductVariant**: Pricing, dimensions, material, shape, stock levels.
- **CustomizationDesign**: Layers (image, text, stickers), print bleed margin, DPI verification score.
- **SmartMagnet**: Physical unit identifier, factory `nfcUid`, and assigned `qrSlug`.
- **SmartLinkHub**: Themes, bio, dynamic action links, analytics counters.
- **Order & Payment**: Shipping address, itemized design snapshot, Razorpay transaction ID, order pipeline state.
