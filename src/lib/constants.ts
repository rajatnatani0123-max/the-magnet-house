export const APP_NAME = "The Magnet House";
export const TAGLINE = "Turn your memories into something you can tap.";
export const APP_DOMAIN = "https://themagnethouse.com";

// Generated High-Fidelity Asset Paths
export const ASSET_IMAGES = {
  heroFridge: "/src/assets/images/hero_smart_magnet_fridge_1790772716920.jpg",
  productCoupleAcrylic: "/src/assets/images/product_couple_acrylic_1790772730611.jpg",
  productSpotifyBlack: "/src/assets/images/product_spotify_black_1790772744742.jpg",
  productWoodFamily: "/src/assets/images/product_wood_family_1790772755958.jpg",
  productTravelPolaroid: "/src/assets/images/product_travel_polaroid_1790772767979.jpg",
};

export const DISCOUNT_CODES: Record<string, { percent: number; minSpend: number; description: string }> = {
  WELCOME10: { percent: 10, minSpend: 499, description: "10% off on your first order" },
  MAGNETIC20: { percent: 20, minSpend: 1499, description: "20% off on orders above ₹1,499" },
  FREESHIP: { percent: 0, minSpend: 0, description: "Free express shipping unlocked" },
};

export const FREE_SHIPPING_THRESHOLD = 999;
export const STANDARD_SHIPPING_FEE = 99;
export const GST_RATE = 0.18; // 18% GST standard for custom print & NFC goods in India
