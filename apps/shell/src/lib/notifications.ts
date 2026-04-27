/**
 * Service to handle Browser Notifications and Service Worker registration.
 */
export const notificationService = {
  /**
   * Register the Service Worker.
   */
  async register() {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        });
        console.log('[Service Worker] Registered successfully:', registration);
        return registration;
      } catch (error) {
        console.error('[Service Worker] Registration failed:', error);
      }
    }
  },

  /**
   * Request permission to show notifications.
   */
  async requestPermission(): Promise<NotificationPermission> {
    if (!('Notification' in window)) {
      console.warn('This browser does not support notifications.');
      return 'denied';
    }

    const permission = await Notification.requestPermission();
    console.log('[Notification] Permission status:', permission);
    return permission;
  },

  /**
   * Trigger a local notification.
   */
  async showLocalNotification(title: string, body: string, url: string = '/') {
    const permission = await Notification.permission;
    
    if (permission !== 'granted') {
      const newPermission = await this.requestPermission();
      if (newPermission !== 'granted') return;
    }

    const registration = await navigator.serviceWorker.ready;
    if (registration) {
      registration.showNotification(title, {
        body,
        icon: '/favicon.ico',
        badge: '/favicon.ico',
        data: { url },
      });
    } else {
      // Fallback for when Service Worker is not ready
      new Notification(title, { body });
    }
  },

  /**
   * Subscribe to Push Notifications.
   * This would typically call your backend with the subscription object.
   */
  async subscribeToPush(publicVapidKey: string) {
    const registration = await navigator.serviceWorker.ready;
    if (!registration.pushManager) {
      console.warn('Push messaging is not supported.');
      return;
    }

    try {
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: publicVapidKey,
      });
      console.log('[Push] Subscribed successfully:', subscription);
      // Send subscription to server here:
      // await api.post('/notifications/subscribe', subscription);
      return subscription;
    } catch (error) {
      console.error('[Push] Subscription failed:', error);
    }
  }
};
