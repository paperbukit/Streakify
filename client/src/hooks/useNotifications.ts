import { useState, useCallback } from 'react';

interface NotificationState {
  id: string;
  title: string;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
}

export function useNotifications() {
  const [notifications, setNotifications] = useState<NotificationState[]>([]);

  const showNotification = useCallback((
    title: string,
    message: string,
    type: NotificationState['type'] = 'success',
    duration: number = 3000
  ) => {
    const id = Date.now().toString();
    const notification: NotificationState = {
      id,
      title,
      message,
      type,
      duration,
    };

    setNotifications(prev => [...prev, notification]);

    // Auto-remove notification after duration
    setTimeout(() => {
      setNotifications(prev => prev.filter(n => n.id !== id));
    }, duration);

    // Show browser notification if permission granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(title, {
        body: message,
        icon: '/favicon.ico',
        tag: 'streakify-notification',
      });
    }
  }, []);

  const removeNotification = useCallback((id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const requestPermission = useCallback(async () => {
    if ('Notification' in window) {
      const permission = await Notification.requestPermission();
      return permission === 'granted';
    }
    return false;
  }, []);

  return {
    notifications,
    showNotification,
    removeNotification,
    requestPermission,
  };
}
