import { describe, it, expect, beforeEach } from 'vitest';
import { storage } from '../../src/lib/storage';

describe('Device Password Authentication System', () => {
  beforeEach(() => {
    // Reset session storage
    if (typeof window !== 'undefined' && window.sessionStorage) {
      window.sessionStorage.clear();
    }
  });

  it('validates device passcode protection on protected smart magnets', () => {
    const magnets = storage.getMagnets();
    const weddingMagnet = magnets.find((m) => m.qrSlug === 'aarav-meera-wedding');
    expect(weddingMagnet).toBeDefined();
    expect(weddingMagnet?.isPasswordProtected).toBe(true);
    expect(weddingMagnet?.password).toBe('2024');
  });

  it('rejects incorrect passcode and returns hint if configured', () => {
    const slug = 'aarav-meera-wedding';
    const result = storage.unlockDeviceSession(slug, '0000');
    expect(result.success).toBe(false);
    expect(result.error).toContain('Wedding Year');
  });

  it('unlocks device session upon correct passcode and allows locking', () => {
    const slug = 'aarav-meera-wedding';
    const result = storage.unlockDeviceSession(slug, '2024');
    expect(result.success).toBe(true);

    const isUnlocked = storage.isDeviceUnlocked(slug);
    expect(isUnlocked).toBe(true);

    storage.lockDeviceSession(slug);
    const isLockedAgain = storage.isDeviceUnlocked(slug);
    expect(isLockedAgain).toBe(false);
  });

  it('updates magnet device passcode and security settings', () => {
    const magnets = storage.getMagnets();
    const mag = magnets[1]; // first-dance-playlist
    expect(mag).toBeDefined();

    storage.updateMagnetSecurity(mag.id, true, '7788', 'Lucky number', 'pin');
    const updated = storage.getMagnets().find((m) => m.id === mag.id);
    expect(updated?.isPasswordProtected).toBe(true);
    expect(updated?.password).toBe('7788');
    expect(updated?.passwordHint).toBe('Lucky number');

    const authRes = storage.unlockDeviceSession(updated!.qrSlug, '7788');
    expect(authRes.success).toBe(true);
  });
});
