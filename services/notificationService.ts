import { playWarningBeep } from './audioAlertService';

export async function requestNotificationPermission(): Promise<'granted' | 'denied' | 'default' | 'unsupported'> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return 'unsupported';
  }

  if (Notification.permission === 'granted') {
    return 'granted';
  }

  try {
    const perm = await Notification.requestPermission();
    return perm;
  } catch {
    return new Promise((resolve) => {
      try {
        Notification.requestPermission((p) => resolve(p));
      } catch {
        resolve('denied');
      }
    });
  }
}

export async function sendLocalDisasterNotification(title: string, body: string): Promise<boolean> {
  // Always trigger acoustic warning beep
  playWarningBeep();

  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission !== 'granted') {
    const perm = await requestNotificationPermission();
    if (perm !== 'granted') {
      return false;
    }
  }

  try {
    // 1. Try ServiceWorkerRegistration if available (works on Android PWA & Chrome)
    if ('serviceWorker' in navigator) {
      const reg = await navigator.serviceWorker.getRegistration();
      if (reg && typeof (reg as any).showNotification === 'function') {
        await (reg as any).showNotification(title, {
          body,
          tag: 'rakshak-disaster-alert',
          renotify: true,
        });
        return true;
      }
    }

    // 2. Standard Web Notification API
    const notif = new Notification(title, {
      body,
      tag: 'rakshak-disaster-alert',
    });

    notif.onclick = () => {
      window.focus();
      notif.close();
    };

    return true;
  } catch (e) {
    console.warn('Notification display note:', e);
    return false;
  }
}

/**
 * Cache mountain GIS telemetry and key maps for offline PWA operation
 */
export function cacheMountainGisData(telemetryData: any): void {
  if (typeof window === 'undefined' || !window.localStorage) return;
  try {
    window.localStorage.setItem('rakshak_offline_telemetry', JSON.stringify({
      data: telemetryData,
      cachedAt: new Date().toISOString(),
    }));
  } catch (e) {
    console.warn('Offline caching error:', e);
  }
}

export function getCachedMountainGisData(): any | null {
  if (typeof window === 'undefined' || !window.localStorage) return null;
  try {
    const saved = window.localStorage.getItem('rakshak_offline_telemetry');
    return saved ? JSON.parse(saved) : null;
  } catch {
    return null;
  }
}
