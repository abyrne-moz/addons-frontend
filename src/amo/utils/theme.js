/* @flow */
const THEME_KEY = 'amo-theme-preference';

export type ThemePreference = 'system' | 'light' | 'dark';

export function getStoredTheme(): ThemePreference {
  if (typeof window === 'undefined') {
    return 'system';
  }
  const stored = window.localStorage.getItem(THEME_KEY);
  if (stored === 'light' || stored === 'dark') {
    return stored;
  }
  return 'system';
}

export function setStoredTheme(preference: ThemePreference) {
  if (typeof window === 'undefined') {
    return;
  }

  if (preference === 'system') {
    window.localStorage.removeItem(THEME_KEY);
    document.documentElement.removeAttribute('data-theme');
  } else {
    window.localStorage.setItem(THEME_KEY, preference);
    document.documentElement.setAttribute('data-theme', preference);
  }
}

export function getNextTheme(current: ThemePreference): ThemePreference {
  switch (current) {
    case 'system':
      return 'light';
    case 'light':
      return 'dark';
    case 'dark':
      return 'system';
    default:
      return 'system';
  }
}

export function getEffectiveTheme(preference: ThemePreference): 'light' | 'dark' {
  if (preference !== 'system') {
    return preference;
  }
  if (typeof window !== 'undefined' && window.matchMedia) {
    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }
  return 'light';
}
