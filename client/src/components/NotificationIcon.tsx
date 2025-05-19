import { AlertCircle, Bell, CheckCircle2, Clock, Info } from "lucide-react";

const NotificationIcon = ({ type }: { type: "pending" | "warning" | "success" | "info" }) => {
    const iconProps = { size: 20 };
    switch (type) {
      case 'success':
        return <CheckCircle2 {...iconProps} className="text-green-500" />;
      case 'warning':
        return <AlertCircle {...iconProps} className="text-orange-500" />;
      case 'info':
        return <Info {...iconProps} className="text-blue-500" />;
      case 'pending':
        return <Clock {...iconProps} className="text-purple-500" />;
      default:
        return <Bell {...iconProps} className="text-gray-500" />;
    }
  };

export default NotificationIcon;