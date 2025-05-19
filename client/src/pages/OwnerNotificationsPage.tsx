import  { useEffect, useState } from 'react';
import { Bell, X } from 'lucide-react';
import { Notification } from '../models/Notification';
import NotificationIcon from '../components/NotificationIcon';
import NotificationService from '../services/NotificationService'; 

const formatTimeAgo = (date: Date) => {
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  }
  if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  }
  if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  }
  return 'Just now';
};

const OwnerNotificationsPage = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await NotificationService.getAll();
        setNotifications(fetchedNotifications);
      } catch (err) {
        setError('Failed to fetch notifications');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const markAllAsRead = async () => {
    try {
      await Promise.all(
        notifications
          .filter((n) => n.status === 'unread')
          .map((n) => NotificationService.update(n._id, { status: 'read' }))
      );
      setNotifications((prev) =>
        prev.map((n) => (n.status === 'unread' ? { ...n, status: 'read' } : n))
      );
    } catch (err) {
      setError('Failed to mark all notifications as read');
      console.error(err);
    }
  };

  const removeNotification = async (id: string) => {
    try {
      await NotificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError('Failed to delete notification');
      console.error(err);
    }
  };

  const unreadCount = notifications.filter((n) => n.status === 'unread').length;

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-gray-600 dark:text-gray-400">
            You have {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
          </p>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              className="px-4 py-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300"
            >
              Mark all as read
            </button>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {notifications.map((notification) => (
          <div
            key={notification._id}
            className={`
              relative flex items-start gap-4 p-4 rounded-lg transition-all duration-200
              ${notification.status === 'read'
                ? 'bg-white dark:bg-gray-800' 
                : 'bg-blue-50 dark:bg-blue-900/20'
              }
              border border-gray-200 dark:border-gray-700
              hover:shadow-md
            `}
          >
            <div className="flex-shrink-0 mt-1">
              <NotificationIcon type={notification.type} />
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-sm font-medium text-gray-900 dark:text-white">
                    {notification.title}
                  </h3>
                  <p className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                    {notification.description}
                  </p>
                </div>
                <button
                  onClick={() => removeNotification(notification._id)}
                  className="ml-4 p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
                >
                  <X size={16} />
                </button>
              </div>
              <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                {formatTimeAgo(notification.createdAt)}
              </div>
            </div>
          </div>
        ))}

        {notifications.length === 0 && (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
            <Bell className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">No notifications</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              You're all caught up! Check back later for new notifications.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerNotificationsPage;