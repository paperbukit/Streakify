import { useApp } from "../../contexts/AppContext";
import { useNotifications } from "../../hooks/useNotifications";
import { CheckCircle, AlertCircle, Info, AlertTriangle, X } from "lucide-react";
import { Button } from "./button";
import { cn } from "../../lib/utils";

export function NotificationToast() {
  const { notifications, removeNotification } = useNotifications();

  const getIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'info':
        return <Info className="w-5 h-5 text-blue-600" />;
      default:
        return <CheckCircle className="w-5 h-5 text-green-600" />;
    }
  };

  const getBackgroundColor = (type: string) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
      case 'error':
        return 'bg-red-50 border-red-200 dark:bg-red-900/20 dark:border-red-800';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200 dark:bg-yellow-900/20 dark:border-yellow-800';
      case 'info':
        return 'bg-blue-50 border-blue-200 dark:bg-blue-900/20 dark:border-blue-800';
      default:
        return 'bg-green-50 border-green-200 dark:bg-green-900/20 dark:border-green-800';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={cn(
            "notification-slide border rounded-xl shadow-lg p-4 max-w-sm",
            getBackgroundColor(notification.type)
          )}
        >
          <div className="flex items-start space-x-3">
            {getIcon(notification.type)}
            <div className="flex-1">
              <p className="font-medium text-gray-800 dark:text-white">
                {notification.title}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-300">
                {notification.message}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
