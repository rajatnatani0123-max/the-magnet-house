import { describe, it, expect } from 'vitest';
import { NFCProvider } from '../../src/lib/nfc';

describe('NFC Provider & Destination Validation', () => {
  it('accepts valid https URLs for Spotify, YouTube, and Link Hubs', () => {
    expect(NFCProvider.validateDestinationUrl('https://open.spotify.com/track/4cOdK2wGLETKBW3PvgPWqT').isValid).toBe(true);
    expect(NFCProvider.validateDestinationUrl('https://themagnethouse.com/m/aarav-meera').isValid).toBe(true);
    expect(NFCProvider.validateDestinationUrl('https://photos.google.com/share/AF1QipN').isValid).toBe(true);
  });

  it('rejects empty or whitespace-only destination inputs', () => {
    expect(NFCProvider.validateDestinationUrl('').isValid).toBe(false);
    expect(NFCProvider.validateDestinationUrl('   ').isValid).toBe(false);
  });

  it('blocks SSRF and malicious protocol vectors', () => {
    expect(NFCProvider.validateDestinationUrl('http://127.0.0.1:8080').isValid).toBe(false);
    expect(NFCProvider.validateDestinationUrl('http://localhost/admin').isValid).toBe(false);
    expect(NFCProvider.validateDestinationUrl('http://169.254.169.254/latest/meta-data').isValid).toBe(false);
    expect(NFCProvider.validateDestinationUrl('javascript:alert(1)').isValid).toBe(false);
    expect(NFCProvider.validateDestinationUrl('file:///etc/passwd').isValid).toBe(false);
    expect(NFCProvider.validateDestinationUrl('http://192.168.1.1').isValid).toBe(false);
  });

  it('provisions NFC Tag simulation for production & desktop environments', async () => {
    const result = await NFCProvider.writeNfcTag('https://themagnethouse.com/m/test-slug');
    expect(result.success).toBe(true);
    expect(result.nfcUid).toMatch(/^TMH-NFC-/);
    expect(result.timestamp).toBeDefined();
  });
});
