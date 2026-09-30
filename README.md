# The Magnet House 🧲✨

> **Turn your memories into something you can tap.**  
> Customized smart fridge magnets with embedded NFC chips + dynamic laser QR fallback.

---

## 🌟 Overview

**The Magnet House** is a production-grade direct-to-consumer (D2C) e-commerce platform for personalized smart fridge magnets. Each physical magnet combines museum-grade materials (diamond-polished crystal acrylic, solid American walnut wood, matte black aero-aluminum, or Polaroid PVC) with an embedded NXP NTAG213 contactless microchip and laser-etched fallback QR code.

When anyone taps their smartphone against the magnet or scans the QR code, it opens the customer's cloud-hosted **Smart Link Hub** (`/m/{slug}`) — instantly playing their Spotify first dance song, launching a 4K wedding film, opening a family Google Photos drive, or displaying a professional vCard.

---

## 🚀 Key Features

### 1. Interactive E-Commerce Storefront
- **Top Bar Contract**: Clean 3-zone header, single text wordmark in display typography, zero-pill metadata discipline, and mobile navigation drawer.
- **Visual Tap Simulator**: Live interactive demonstration showing phone approach, haptic NFC ripple, and instant digital hub opening.
- **Product Catalog (PLP)**: Advanced multi-parameter filtering (Theme, Material, Shape, Size, Price range), debounced live search, sorting, and quick preview drawer.
- **Product Detail (PDP)**: Contiguous purchase module, dynamic variant sizing, technical specifications (N52 neodymium magnet force, NTAG213 chip details, UV pigment waterproofing), cross-sell recommendations, and verified customer reviews.

### 2. Customization Studio (`/customize/:productId`)
- **Visual Canvas Editor**: Drag, rotate, scale photos, add custom typography with custom fonts, colors, and layout templates.
- **Resolution & DPI Quality Engine**: Warns customers if their uploaded image resolution is below print-quality threshold (<200 DPI).
- **Surface Simulation**: Real-time rendering of gloss acrylic sheen, matte aluminum, or walnut wood grain.
- **Safe Bleed Lines**: Visual toggle for safe cut margin lines.
- **NFC Destination Configurator**: Direct linking to Spotify, Instagram, YouTube, Google Drive, or personal Smart Link Hub.
- **Draft Persistence**: Save unfinished designs to resume anytime.

### 3. Progressive NFC & Dynamic QR Engine
- **NFCProvider Abstraction**: Detects Web NFC (`NDEFReader`) on supported Android devices while providing simulated factory provisioning for desktop/iOS devices.
- **Decoupled Architecture**: Physical magnet embeds UID & slug (`/m/{slug}`); destinations can be updated anytime from the customer dashboard without replacing the physical magnet.
- **Laser-Etched QR Fallback**: High-error-correction (Level H) print-ready QR codes dynamically generated for every magnet.

### 4. Smart Link Hub (`/m/:slug`)
- Public, mobile-optimized digital experience.
- Supports Spotify song embeds, Instagram profiles, YouTube videos, Google Maps routes, WhatsApp direct chats, and downloadable `.vcf` vCards.
- Real-time privacy-compliant tap, scan, and link click analytics.

### 5. Cart, Checkout & Razorpay Architecture
- **Cart Drawer & Full Bag**: Quantity steppers, coupon code engine (`WELCOME10`, `MAGNETIC20`, `FREESHIP`), free shipping threshold progress tracker.
- **Transparent Pricing**: Breakdown of Subtotal, Discounts, Shipping, and 18% inclusive GST.
- **4-Step Checkout**: Address validation, order review, Razorpay test payment modal, UPI simulator, and QA failure toggle.

### 6. Customer Dashboard & Operations Portal
- **My Magnets**: Live tap/scan analytics, one-click destination updater, QR code downloader.
- **Order Pipeline**: State tracking (`Paid` → `Design Review` → `Production` → `Shipped` → `Delivered`), printable tax invoices.
- **Role-Based Admin Console**: Switch to Staff/Admin role to manage orders, update courier tracking numbers (BlueDart/Delhivery), and review statistics.

---

## 🛠 Tech Stack

- **Framework**: React 19 + TypeScript + Vite
- **Styling**: Tailwind CSS v4 (Theme variables, typography pairing: Syne & Plus Jakarta Sans)
- **Icons**: Lucide React
- **NFC & QR**: Native Web NFC abstraction + `qrcode` SVG/PNG engine
- **Testing**: Vitest automated unit & integration testing
- **State Management**: Reactive LocalStorage engine with event-driven subscribers

---

## 🧪 Testing & Verification

Run the automated test suite:

```bash
npm run test
```

Run TypeScript compilation & linting:

```bash
npm run lint
npm run build
```
