export interface PanicSettings {
  enabled: boolean;
  panicKey: string; // e.g. '`' or 'Escape' or ']' or 'KeyP'
  panicKeyDisplay: string;
  redirectUrl: string;
  mode: 'redirect' | 'disguise';
  tabMask: 'none' | 'drive' | 'classroom' | 'canvas' | 'wikipedia';
}

const PANIC_SETTINGS_KEY = 'gameland_panic_settings_v1';

export const DEFAULT_PANIC_SETTINGS: PanicSettings = {
  enabled: true,
  panicKey: '`',
  panicKeyDisplay: '` (Backquote / ~)',
  redirectUrl: 'https://classroom.google.com',
  mode: 'redirect',
  tabMask: 'none',
};

export function getPanicSettings(): PanicSettings {
  try {
    const raw = localStorage.getItem(PANIC_SETTINGS_KEY);
    return raw ? { ...DEFAULT_PANIC_SETTINGS, ...JSON.parse(raw) } : DEFAULT_PANIC_SETTINGS;
  } catch {
    return DEFAULT_PANIC_SETTINGS;
  }
}

export function savePanicSettings(settings: PanicSettings): void {
  try {
    localStorage.setItem(PANIC_SETTINGS_KEY, JSON.stringify(settings));
    applyTabMask(settings.tabMask);
  } catch (e) {
    console.error('Failed to save panic settings', e);
  }
}

export function applyTabMask(mask: PanicSettings['tabMask']): void {
  try {
    let favicon = document.querySelector("link[rel*='icon']") as HTMLLinkElement;
    if (!favicon) {
      favicon = document.createElement('link');
      favicon.rel = 'shortcut icon';
      document.head.appendChild(favicon);
    }

    if (mask === 'drive') {
      document.title = 'My Drive - Google Drive';
      favicon.href = 'https://ssl.gstatic.com/images/branding/product/1x/drive_2020q4_32dp.png';
    } else if (mask === 'classroom') {
      document.title = 'Classes - Google Classroom';
      favicon.href = 'https://ssl.gstatic.com/classroom/favicon.png';
    } else if (mask === 'canvas') {
      document.title = 'Dashboard - Canvas LMS';
      favicon.href = 'https://du11hjcvx0uqb.cloudfront.net/dist/images/favicon-e10d657a73.ico';
    } else if (mask === 'wikipedia') {
      document.title = 'Wikipedia, the free encyclopedia';
      favicon.href = 'https://en.wikipedia.org/static/favicon/wikipedia.ico';
    } else {
      document.title = 'GameLand 🐧 Unblocked Games Portal';
    }
  } catch (e) {
    console.error('Error applying tab mask', e);
  }
}

export function triggerPanicRedirect(url?: string): void {
  const target = url || getPanicSettings().redirectUrl || 'https://classroom.google.com';
  try {
    window.location.replace(target);
  } catch {
    window.location.href = target;
  }
}
