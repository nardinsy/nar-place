import { createContext, useState, useEffect, FC } from "react";
import { WithChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import { NotificationDto } from "../helpers/dtos";

interface NotificationContextT {
  oldNotifications: NotificationDto[];
  newNotifications: NotificationDto[];
  mergeAndResetNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextT | undefined>(
  undefined
);

export const NotificationContextProvider: FC<
  WithChildren<{ userId: string; token: string }>
> = ({ children, userId, token }) => {
  const backend = useRequiredBackend();

  const [oldNotifications, setOldNotifications] = useState<NotificationDto[]>(
    []
  );
  const [newNotifications, setNewNotifications] = useState<NotificationDto[]>(
    []
  );

  useEffect(() => {
    const fetchNewNotifications = async () => {
      const newNotifications = await backend.getNewNotifications(token);

      setNewNotifications(newNotifications);
    };

    fetchNewNotifications();
  }, []);

  const mergeAndResetNotifications = async () => {
    setOldNotifications((pre) => [...newNotifications, ...pre]);
    setNewNotifications([]);

    await backend.mergeAndResetNotifications(token);
  };

  const value: NotificationContextT = {
    oldNotifications,
    newNotifications,
    mergeAndResetNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;

// const currentNotifLenght = +localStorage.getItem("notificationBadge")!;
// const newNotificationsLenght = newNotifications.length;

// if (newNotificationsLenght > currentNotifLenght) {
//   setNotificationBadge(newNotificationsLenght - currentNotifLenght);
// }

// localStorage.setItem(
//   "notificationBadge",
//   String(newNotifications.length)
// );
