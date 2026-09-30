# NFC & QR Hardware Integration Specification

## 1. Hardware Specifications
- **Integrated Circuit**: NXP NTAG213 (ISO 14443-A standard, operating frequency 13.56 MHz).
- **Usable Memory**: 144 bytes user read/write memory with 7-byte factory UID.
- **Operating Distance**: 0 to 25 mm depending on phone antenna geometry.
- **Data Retention**: 10 years minimum, 100,000 write cycle endurance.
- **Shielding**: Ferrite anti-metal barrier layer placed between neodymium magnet backing and NFC loop antenna to prevent magnetic field detuning.

## 2. Web NFC Progressive Enhancement
When viewed in Chromium for Android:
- Leverages the W3C Web NFC standard (`window.NDEFReader`).
- Writes NDEF URL records directly to the physical tag.
- Gracefully falls back to simulated factory encoding for non-supported browsers (iOS Safari, Desktop Chrome).

## 3. QR Redundancy
- **Encoding Scheme**: Vector SVG & High-Res PNG with Error Correction Level H (handles up to 30% optical obstruction or scratch damage).
- **Physical Placement**: Laser-etched on reverse side with high contrast for rapid camera barcode detection.
