import { describe, it, expect } from 'vitest';
import { generateQrDataUrl, generateQrSvg } from '../../src/lib/qr';

describe('QR Code Generation Engine', () => {
  it('generates a valid base64 image data URL for /m/:slug', async () => {
    const dataUrl = await generateQrDataUrl('https://themagnethouse.com/m/wedding-aarav-meera');
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('generates print-safe SVG vector string with high error correction', async () => {
    const svg = await generateQrSvg('https://themagnethouse.com/m/wedding-aarav-meera');
    expect(svg).toContain('<svg');
    expect(svg).toContain('</svg>');
  });

  it('generates custom inverted laser palette and ultra-HD print resolution', async () => {
    const dataUrl = await generateQrDataUrl('https://themagnethouse.com/m/first-dance', {
      width: 1024,
      color: { dark: '#ffffff', light: '#18181b' },
      errorCorrectionLevel: 'H',
    });
    expect(dataUrl).toMatch(/^data:image\/png;base64,/);
  });

  it('renders custom dots pattern and brand logo overlay in vector SVG', async () => {
    const svg = await generateQrSvg('https://themagnethouse.com/m/wedding-aarav-meera', {
      pattern: 'dots',
      logoPreset: 'brand',
      color: { dark: '#047857', light: '#ffffff' },
    });
    expect(svg).toContain('<circle');
    expect(svg).toContain('<svg');
  });

  it('renders rounded squircle pattern with heart logo overlay', async () => {
    const svg = await generateQrSvg('https://themagnethouse.com/m/wedding-aarav-meera', {
      pattern: 'rounded',
      logoPreset: 'heart',
      color: { dark: '#be123c', light: '#ffffff' },
    });
    expect(svg).toContain('rx="');
    expect(svg).toContain('<svg');
  });
});
