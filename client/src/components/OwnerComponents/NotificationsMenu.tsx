import type React from "react";
import { Dropdown, List, Badge, Avatar } from "antd";
import { Notification } from "../../models/Notification";
import NotificationIcon from "../NotificationIcon";
import { Link } from "react-router-dom";

const notifications: Notification[] = [
  {
    _id: "1",
    userId:"12313",
    title: "New Payment Received",
    description: "You received a payment of €2,500 for 123 Main St.",
    createdAt:new Date(),
    type: "info",
    status: "unread",
  },
  {
    _id: "2",
    userId:"12313",
    title: "Maintenance Request",
    description: "New maintenance request for 456 Oak Ave.",
    createdAt:new Date(),
    type: "warning",
    status: "unread",
  },
  {
    _id: "3",
    userId:"12313",
    title: "Lease Expiring Soon",
    description: "The lease for 789 Pine Rd is expiring in 30 days.",
    createdAt:new Date(),
    type: "pending",
    status: "read",
  },
  {
    _id: "4",
    userId:"12313",
    title: "New Tenant Application",
    description: "You have a new tenant application for review.",
    createdAt:new Date(),
    type: "success",
    status: "read",
  },
];

const NotificationItem: React.FC<{ notification: Notification }> = ({
  notification,
}) => (
  <List.Item
    className={`px-4 py-3 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
      !(notification.status =="read") ? "bg-blue-50 dark:bg-blue-900" : ""
    }`}
  >
    <div className="flex items-start">
      <div className="flex-shrink-0 mt-1">
        <Avatar
          icon={<NotificationIcon type={notification.type} />}
          className="bg-white dark:bg-gray-800"
          style={{ backgroundColor: "transparent" }}
        />
      </div>
      <div className="ml-3 flex-1">
        <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
          {notification.title}
        </p>
        <p className="text-sm text-gray-600 dark:text-gray-300 line-clamp-2">
          {notification.description}
        </p>
        <p className="mt-1 text-xs text-gray-400 dark:text-gray-500">
          {notification.createdAt.getTime()}
        </p>
      </div>
      {!(notification.status == "read") && (
        <div className="ml-3 flex-shrink-0">
          <Badge status="processing" />
        </div>
      )}
    </div>
  </List.Item>
);

export const NotificationsMenu: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const menu = (
    <div className="w-96 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
      <div className="px-4 py-3 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
          Notifications
        </h3>
        <span className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 cursor-pointer">
          Mark all as read
        </span>
      </div>
      <List
        className="max-h-[calc(100vh-200px)] overflow-y-auto"
        dataSource={notifications}
        renderItem={(item) => <NotificationItem notification={item} />}
      />
      <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700 text-center">
        <Link to={"/dashboard/notifications"} className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-500 font-medium focus:outline-none">
          View all notifications
        </Link>
      </div>
    </div>
  );

  return (
    <Dropdown
      overlay={menu}
      trigger={["click"]}
      placement="bottomRight"
      overlayClassName="notifications-dropdown"
    >
      {children}
    </Dropdown>
  );
};