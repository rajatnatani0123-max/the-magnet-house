import QRCode from 'qrcode';

export type QrPatternShape = 'square' | 'dots' | 'rounded';
export type QrLogoPreset = 'none' | 'brand' | 'nfc' | 'music' | 'heart' | 'custom';

export interface QRCodeOptions {
  width?: number;
  margin?: number;
  color?: {
    dark: string;
    light: string;
  };
  errorCorrectionLevel?: 'L' | 'M' | 'Q' | 'H';
  pattern?: QrPatternShape;
  logoPreset?: QrLogoPreset;
  customLogoUrl?: string;
  logoSize?: number; // ratio of width, e.g. 0.22
}

export const LOGO_PRESET_SVGS: Record<Exclude<QrLogoPreset, 'none' | 'custom'>, string> = {
  brand: `<path d="M5 5v7a7 7 0 0 0 14 0V5M5 9h4M15 9h4" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/><rect x="4" y="3" width="6" height="3" fill="currentColor"/><rect x="14" y="3" width="6" height="3" fill="currentColor"/>`,
  nfc: `<path d="M5 8a7 7 0 0 1 14 0M2 5a11 11 0 0 1 20 0M8 11a4 4 0 0 1 8 0" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"/><circle cx="12" cy="16" r="1.75" fill="currentColor"/>`,
  music: `<path d="M9 18V5l12-2v13M9 9l12-2" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><circle cx="6" cy="18" r="3" fill="currentColor"/><circle cx="18" cy="16" r="3" fill="currentColor"/>`,
  heart: `<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" fill="currentColor"/>`,
};

function isFinderPattern(row: number, col: number, size: number): boolean {
  return (
    (row < 7 && col < 7) ||
    (row < 7 && col >= size - 7) ||
    (row >= size - 7 && col < 7)
  );
}

function isInsideCenterLogo(
  row: number,
  col: number,
  size: number,
  logoRatio: number
): boolean {
  const center = size / 2;
  const radius = (size * logoRatio) / 2;
  const dist = Math.sqrt(Math.pow(row + 0.5 - center, 2) + Math.pow(col + 0.5 - center, 2));
  return dist <= radius + 0.6;
}

/**
 * Generate an SVG string of the QR code with customizable pattern shapes, colors, and logo overlay
 */
export async function generateQrSvg(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const width = options.width || 400;
  const margin = options.margin ?? 2;
  const darkColor = options.color?.dark || '#18181b';
  const lightColor = options.color?.light || '#ffffff';
  const pattern = options.pattern || 'square';
  const logoPreset = options.logoPreset || 'none';
  const customLogoUrl = options.customLogoUrl || '';
  const logoRatio = options.logoSize || 0.22;
  const hasLogo = logoPreset !== 'none' || !!customLogoUrl;

  try {
    const qr = QRCode.create(url, {
      errorCorrectionLevel: 'H',
    });

    const size = qr.modules.size;
    const totalModules = size + margin * 2;
    const cellSize = width / totalModules;

    const svgElements: string[] = [];

    // Background
    svgElements.push(
      `<rect width="${width}" height="${width}" fill="${lightColor}"/>`
    );

    // Render Data & Functional Modules
    for (let r = 0; r < size; r++) {
      for (let c = 0; c < size; c++) {
        const isDark = qr.modules.get(r, c) === 1;
        if (!isDark) continue;

        // Skip center region if logo overlay is active
        if (hasLogo && isInsideCenterLogo(r, c, size, logoRatio)) {
          continue;
        }

        const isFinder = isFinderPattern(r, c, size);
        const x = (c + margin) * cellSize;
        const y = (r + margin) * cellSize;

        if (isFinder) {
          // Draw finder modules with crisp geometry
          if (pattern === 'rounded' || pattern === 'dots') {
            svgElements.push(
              `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" rx="${cellSize * 0.4}" fill="${darkColor}"/>`
            );
          } else {
            svgElements.push(
              `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${darkColor}"/>`
            );
          }
        } else {
          // Normal Data Modules based on Pattern Shape
          if (pattern === 'dots') {
            const cx = x + cellSize / 2;
            const cy = y + cellSize / 2;
            const radius = (cellSize / 2) * 0.88;
            svgElements.push(
              `<circle cx="${cx}" cy="${cy}" r="${radius}" fill="${darkColor}"/>`
            );
          } else if (pattern === 'rounded') {
            const pad = cellSize * 0.08;
            const side = cellSize - pad * 2;
            svgElements.push(
              `<rect x="${x + pad}" y="${y + pad}" width="${side}" height="${side}" rx="${side * 0.35}" fill="${darkColor}"/>`
            );
          } else {
            svgElements.push(
              `<rect x="${x}" y="${y}" width="${cellSize}" height="${cellSize}" fill="${darkColor}"/>`
            );
          }
        }
      }
    }

    // Render Center Logo Overlay Badge if configured
    if (hasLogo) {
      const center = width / 2;
      const badgeDiameter = width * logoRatio;
      const badgeRadius = badgeDiameter / 2;

      // Badge Backing Circle with clean border
      svgElements.push(
        `<circle cx="${center}" cy="${center}" r="${badgeRadius}" fill="${lightColor}" stroke="${darkColor}" stroke-width="${cellSize * 0.75}"/>`
      );

      const iconSize = badgeDiameter * 0.62;
      const iconX = center - iconSize / 2;
      const iconY = center - iconSize / 2;

      if (logoPreset !== 'none' && logoPreset !== 'custom') {
        const svgPath = LOGO_PRESET_SVGS[logoPreset];
        svgElements.push(`
          <g transform="translate(${iconX}, ${iconY}) scale(${iconSize / 24})" color="${darkColor}">
            ${svgPath}
          </g>
        `);
      } else if (customLogoUrl) {
        svgElements.push(`
          <image href="${customLogoUrl}" x="${iconX}" y="${iconY}" width="${iconSize}" height="${iconSize}" preserveAspectRatio="xMidYMid meet"/>
        `);
      }
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${width}" width="${width}" height="${width}">
        ${svgElements.join('\n')}
      </svg>
    `.trim();
  } catch (err) {
    console.error('Failed to generate styled QR SVG, falling back to standard:', err);
    return await QRCode.toString(url, {
      type: 'svg',
      width,
      margin,
      color: { dark: darkColor, light: lightColor },
      errorCorrectionLevel: 'H',
    });
  }
}

/**
 * Generate a clean Data URL for the QR code with customized pattern shapes, colors, and logo overlay
 */
export async function generateQrDataUrl(
  url: string,
  options: QRCodeOptions = {}
): Promise<string> {
  const width = options.width || 512;
  const margin = options.margin ?? 2;
  const darkColor = options.color?.dark || '#18181b';
  const lightColor = options.color?.light || '#ffffff';
  const pattern = options.pattern || 'square';
  const logoPreset = options.logoPreset || 'none';
  const customLogoUrl = options.customLogoUrl || '';
  const logoRatio = options.logoSize || 0.22;
  const hasLogo = logoPreset !== 'none' || !!customLogoUrl;

  // In browser environment: use Canvas for high-fidelity raster rendering
  if (typeof document !== 'undefined' && document.createElement) {
    try {
      const qr = QRCode.create(url, {
        errorCorrectionLevel: 'H',
      });

      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = width;
      const ctx = canvas.getContext('2d');

      if (!ctx) throw new Error('Could not acquire 2D canvas context');

      const size = qr.modules.size;
      const totalModules = size + margin * 2;
      const cellSize = width / totalModules;

      // Fill Background
      ctx.fillStyle = lightColor;
      ctx.fillRect(0, 0, width, width);

      // Fill Modules
      ctx.fillStyle = darkColor;

      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          const isDark = qr.modules.get(r, c) === 1;
          if (!isDark) continue;

          if (hasLogo && isInsideCenterLogo(r, c, size, logoRatio)) {
            continue;
          }

          const isFinder = isFinderPattern(r, c, size);
          const x = (c + margin) * cellSize;
          const y = (r + margin) * cellSize;

          if (isFinder) {
            if (pattern === 'rounded' || pattern === 'dots') {
              const radius = cellSize * 0.4;
              ctx.beginPath();
              ctx.roundRect
                ? ctx.roundRect(x, y, cellSize, cellSize, radius)
                : ctx.rect(x, y, cellSize, cellSize);
              ctx.fill();
            } else {
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          } else {
            if (pattern === 'dots') {
              const cx = x + cellSize / 2;
              const cy = y + cellSize / 2;
              const radius = (cellSize / 2) * 0.88;
              ctx.beginPath();
              ctx.arc(cx, cy, radius, 0, Math.PI * 2);
              ctx.fill();
            } else if (pattern === 'rounded') {
              const pad = cellSize * 0.08;
              const side = cellSize - pad * 2;
              const radius = side * 0.35;
              ctx.beginPath();
              ctx.roundRect
                ? ctx.roundRect(x + pad, y + pad, side, side, radius)
                : ctx.rect(x + pad, y + pad, side, side);
              ctx.fill();
            } else {
              ctx.fillRect(x, y, cellSize, cellSize);
            }
          }
        }
      }

      // Draw Center Badge & Logo Overlay if enabled
      if (hasLogo) {
        const center = width / 2;
        const badgeRadius = (width * logoRatio) / 2;

        ctx.save();
        ctx.beginPath();
        ctx.arc(center, center, badgeRadius, 0, Math.PI * 2);
        ctx.fillStyle = lightColor;
        ctx.fill();
        ctx.lineWidth = cellSize * 0.75;
        ctx.strokeStyle = darkColor;
        ctx.stroke();

        const iconSize = badgeRadius * 1.25;
        const iconX = center - iconSize / 2;
        const iconY = center - iconSize / 2;

        // Render Preset or Custom Logo via image object
        let logoDataUri = customLogoUrl;
        if (logoPreset !== 'none' && logoPreset !== 'custom') {
          const svgContent = `
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="64" height="64" color="${encodeURIComponent(
              darkColor
            )}">
              ${LOGO_PRESET_SVGS[logoPreset]}
            </svg>
          `;
          logoDataUri = `data:image/svg+xml;utf8,${encodeURIComponent(svgContent)}`;
        }

        if (logoDataUri) {
          await new Promise<void>((resolve) => {
            const img = new Image();
            img.crossOrigin = 'anonymous';
            img.onload = () => {
              ctx.drawImage(img, iconX, iconY, iconSize, iconSize);
              resolve();
            };
            img.onerror = () => resolve();
            img.src = logoDataUri;
          });
        }

        ctx.restore();
      }

      return canvas.toDataURL('image/png');
    } catch (err) {
      console.warn('Canvas styled QR generation failed, falling back to standard:', err);
    }
  }

  // Fallback for Node.js / non-DOM environments
  return await QRCode.toDataURL(url, {
    width,
    margin,
    color: { dark: darkColor, light: lightColor },
    errorCorrectionLevel: 'H',
  });
}

/**
 * Download QR code as PNG file
 */
export function downloadQrPng(dataUrl: string, fileName: string = 'smart-magnet-qr.png') {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Download QR code as vector SVG file for laser engravers and cutters
 */
export function downloadQrSvg(svgContent: string, fileName: string = 'smart-magnet-vector.svg') {
  const blob = new Blob([svgContent], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = fileName;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}


