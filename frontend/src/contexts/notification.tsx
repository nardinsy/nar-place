import { createContext, useState, useEffect, FC } from "react";
import { useHistory } from "react-router-dom";
import { WithChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import { NotificationDto } from "../helpers/dtos";

interface NotificationContextT {
  notifications: NotificationDto[];
  notificationBadge: number;
}

const NotificationContext = createContext<NotificationContextT | undefined>(
  undefined
);

export const NotificationContextProvider: FC<
  WithChildren<{ userId: string; token: string }>
> = ({ children, userId, token }) => {
  const backend = useRequiredBackend();

  const [notifications, setNotifications] = useState<NotificationDto[]>([]);
  const [notificationBadge, setNotificationBadge] = useState(0);

  useEffect(() => {
    const fetchNotifications = async () => {
      const newNotifications = await backend.getNotifications(userId, token);

      const currentNotifLenght = +localStorage.getItem("notificationBadge")!;
      const newNotificationsLenght = newNotifications.length;

      if (newNotificationsLenght > currentNotifLenght) {
        setNotificationBadge(newNotificationsLenght - currentNotifLenght);
      }

      localStorage.setItem(
        "notificationBadge",
        String(newNotifications.length)
      );
      setNotifications(newNotifications);
    };

    fetchNotifications();
  }, []);

  const value: NotificationContextT = {
    notifications,
    notificationBadge,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
