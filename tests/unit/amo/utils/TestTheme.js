/* global window */
import {
  getStoredTheme,
  setStoredTheme,
  getNextTheme,
  getEffectiveTheme,
} from 'amo/utils/theme';

describe(__filename, () => {
  beforeEach(() => {
    window.localStorage.clear();
    document.documentElement.removeAttribute('data-theme');
  });

  describe('getStoredTheme', () => {
    it('returns system when nothing is stored', () => {
      expect(getStoredTheme()).toEqual('system');
    });

    it('returns light when stored', () => {
      window.localStorage.setItem('amo-theme-preference', 'light');
      expect(getStoredTheme()).toEqual('light');
    });

    it('returns dark when stored', () => {
      window.localStorage.setItem('amo-theme-preference', 'dark');
      expect(getStoredTheme()).toEqual('dark');
    });

    it('returns system for invalid stored values', () => {
      window.localStorage.setItem('amo-theme-preference', 'invalid');
      expect(getStoredTheme()).toEqual('system');
    });
  });

  describe('setStoredTheme', () => {
    it('sets data-theme attribute for light', () => {
      setStoredTheme('light');

      expect(window.localStorage.getItem('amo-theme-preference')).toEqual(
        'light',
      );
      expect(document.documentElement.getAttribute('data-theme')).toEqual(
        'light',
      );
    });

    it('sets data-theme attribute for dark', () => {
      setStoredTheme('dark');

      expect(window.localStorage.getItem('amo-theme-preference')).toEqual(
        'dark',
      );
      expect(document.documentElement.getAttribute('data-theme')).toEqual(
        'dark',
      );
    });

    it('removes data-theme attribute for system', () => {
      setStoredTheme('dark');
      setStoredTheme('system');

      expect(window.localStorage.getItem('amo-theme-preference')).toBeNull();
      expect(document.documentElement.getAttribute('data-theme')).toBeNull();
    });
  });

  describe('getNextTheme', () => {
    it('cycles system -> light', () => {
      expect(getNextTheme('system')).toEqual('light');
    });

    it('cycles light -> dark', () => {
      expect(getNextTheme('light')).toEqual('dark');
    });

    it('cycles dark -> system', () => {
      expect(getNextTheme('dark')).toEqual('system');
    });
  });

  describe('getEffectiveTheme', () => {
    it('returns light for light preference', () => {
      expect(getEffectiveTheme('light')).toEqual('light');
    });

    it('returns dark for dark preference', () => {
      expect(getEffectiveTheme('dark')).toEqual('dark');
    });

    it('returns light for system when no matchMedia match', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: false });
      expect(getEffectiveTheme('system')).toEqual('light');
    });

    it('returns dark for system when matchMedia matches dark', () => {
      window.matchMedia = jest.fn().mockReturnValue({ matches: true });
      expect(getEffectiveTheme('system')).toEqual('dark');
    });
  });
});
