import { createContext, useState, useEffect, FC } from "react";
import { WithChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import { NotificationDto } from "../helpers/dtos";
import useRequiredAuthContext from "../hooks/use-required-authContext";

interface NotificationContextT {
  newNotifications: NotificationDto[];
  mergeAndResetNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextT | undefined>(
  undefined
);

export const NotificationContextProvider: FC<WithChildren<{}>> = ({
  children,
}) => {
  const backend = useRequiredBackend();
  const authCtx = useRequiredAuthContext();

  if (!authCtx.isLoggedin) {
    throw new Error("");
    //redirect to login page
  }

  const [newNotifications, setNewNotifications] = useState<NotificationDto[]>(
    []
  );

  useEffect(() => {
    const fetchNewNotifications = async () => {
      const newNotifications = await backend.getNewNotifications(authCtx.token);
      setNewNotifications(newNotifications);
    };

    fetchNewNotifications();
  }, []);

  const mergeAndResetNotifications = async () => {
    authCtx.updateOldNotifications(newNotifications);
    setNewNotifications([]);

    await backend.mergeAndResetNotifications(authCtx.token);
  };

  const value: NotificationContextT = {
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
