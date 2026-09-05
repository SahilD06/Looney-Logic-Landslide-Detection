/**
 * Web Notification & Offline Storage Service for PWA
 */

export async function requestNotificationPermission(): Promise<boolean> {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return false;
  }

  if (Notification.permission === 'granted') {
    return true;
  }

  if (Notification.permission !== 'denied') {
    const perm = await Notification.requestPermission();
    return perm === 'granted';
  }

  return false;
}

export function sendLocalDisasterNotification(title: string, body: string): void {
  if (typeof window === 'undefined' || !('Notification' in window)) {
    return;
  }

  if (Notification.permission === 'granted') {
    try {
      new Notification(title, {
        body,
        icon: '/favicon.svg',
        badge: '/favicon.svg',
        tag: 'rakshak-disaster-alert',
      });
    } catch (e) {
      console.warn('Notification error:', e);
    }
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
