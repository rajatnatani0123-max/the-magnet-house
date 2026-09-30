# Customization Studio Architecture

## 1. Canvas Model
- **Layer Coordinate System**: Normalized percentage coordinates (`0%` to `100%`) for device-independent rasterization and high-res vector print export.
- **Layer Types**:
  - `image`: User photo with live DPI calculation based on physical magnet size (3.0" width = 900px minimum dimension for 300 DPI).
  - `text`: Typography layer with font family, size in pt, color, rotation angle.
  - `shape` / `finish`: Sheen overlay simulating real gloss acrylic, matte aluminum, or walnut wood grain.

## 2. DPI & Quality Verification Algorithm
```typescript
const minDimension = Math.min(img.naturalWidth, img.naturalHeight);
const physicalInches = selectedVariant.physicalDimensionInches; // e.g. 3.0"
const estimatedDpi = Math.round(minDimension / physicalInches);
const isSufficient = estimatedDpi >= 200;
```
If `estimatedDpi < 200`, the customer receives an advisory warning to prevent blurry prints.
