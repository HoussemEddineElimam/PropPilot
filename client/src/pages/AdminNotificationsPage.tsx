import { useState, useEffect } from "react";
import { X } from "lucide-react";
import type { Notification } from "../models/Notification";
import { useTheme } from "../hooks/useTheme";
import NotificationIcon from "../components/NotificationIcon";
import NotificationService from "../services/NotificationService"; 

const AdminNotificationsPage = () => {
  const [activeFilter, setActiveFilter] = useState<"all" | "unread" | "read">("all");
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { theme } = useTheme();

  //Fetch notifications on component mount
  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const fetchedNotifications = await NotificationService.getAll();
        setNotifications(fetchedNotifications);
      } catch (err) {
        setError("Failed to fetch notifications");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchNotifications();
  }, []);

  const getFilteredNotifications = () => {
    if (!Array.isArray(notifications)) return []; 
  
    switch (activeFilter) {
      case "unread":
        return notifications.filter((n) => n.status === "unread");
      case "read":
        return notifications.filter((n) => n.status === "read");
      default:
        return notifications;
    }
  };
  

  const markAsRead = async (id: string) => {
    try {
      const updatedNotification = await NotificationService.update(id, { status: "read" });
      setNotifications((prev) =>
        prev.map((n) => (n._id === updatedNotification._id ? updatedNotification : n))
      );
    } catch (err) {
      setError("Failed to mark notification as read");
      console.error(err);
      alert("Failed to mark notification as read. Please try again.");
    }
  };
  
  const deleteNotification = async (id: string) => {
    try {
      await NotificationService.delete(id);
      setNotifications((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      setError("Failed to delete notification");
      console.error(err);
      alert("Failed to delete notification. Please try again."); 
    }
  };

  const markAllAsRead = async () => {
    try {
      const unreadNotifications = notifications.filter((n) => n.status === "unread");
      await NotificationService.markAllAsRead(unreadNotifications.map((n) => n._id));
      setNotifications((prev) =>
        prev.map((n) => (n.status === "unread" ? { ...n, status: "read" } : n))
      );
    } catch (err) {
      setError("Failed to mark all notifications as read");
      console.error(err);
      alert("Failed to mark all notifications as read. Please try again."); 
    }
  };

  const formatTimestamp = (timestamp: string | Date) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
  
    if (minutes < 60) return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    return `${days} day${days !== 1 ? "s" : ""} ago`;
  };

  if (loading) {
    return <div>Loading notifications...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div className={`max-w-5xl mx-auto p-6 min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-white text-gray-900"}`}>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold flex items-center gap-3">Notifications</h1>
        <button
          onClick={markAllAsRead}
          className={`px-4 py-2 text-sm font-medium ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
        >
          Mark all as read
        </button>
      </div>

      <div className="flex gap-4 mb-6">
        {["all", "unread", "read"].map((filter) => (
          <button
            key={filter}
            onClick={() => setActiveFilter(filter as "all" | "unread" | "read")}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200 ${
              activeFilter === filter
                ? "bg-blue-500 text-white"
                : theme === "dark"
                ? "bg-gray-800 text-gray-300 hover:bg-gray-700"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {filter.charAt(0).toUpperCase() + filter.slice(1)}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {getFilteredNotifications().map((notification) => (
          <div
            key={notification._id}
            className={`p-4 rounded-xl flex items-start gap-4 transition-all duration-200 ${
              notification.status === "read"
                ? theme === "dark" ? "bg-gray-800/50" : "bg-gray-50"
                : theme === "dark" ? "bg-gray-800 shadow-md" : "bg-white shadow-md"
            }`}
          >
            <NotificationIcon type={notification.type} />
            <div className="flex-1">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="font-medium text-lg">{notification.title}</p>
                  <p className={theme === "dark" ? "text-gray-300" : "text-gray-600"}>{notification.description}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-500"}`}>{formatTimestamp(notification.createdAt)}</span>
                  <button
                    onClick={() => deleteNotification(notification._id)}
                    className={`${theme === "dark" ? "text-gray-400 hover:text-gray-200" : "text-gray-400 hover:text-gray-600"}`}
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
              {notification.status === "unread" && (
                <button
                  onClick={() => markAsRead(notification._id)}
                  className={`mt-2 text-sm ${theme === "dark" ? "text-blue-400 hover:text-blue-300" : "text-blue-600 hover:text-blue-700"}`}
                >
                  Mark as read
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminNotificationsPage;