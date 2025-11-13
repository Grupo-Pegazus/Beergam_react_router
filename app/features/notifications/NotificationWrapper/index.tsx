import { showNotification } from "../showNotification";
import type { CustomNotificationData } from "../types";

interface NotificationWrapperProps {
  children: React.ReactElement;
  icon: React.ReactElement;
}

export default function NotificationWrapper({
  children,
  icon,
}: NotificationWrapperProps) {
  const notificationData: CustomNotificationData = {
    type: "custom",
    content: children,
    icon: icon,
  };

  showNotification(notificationData);
}
