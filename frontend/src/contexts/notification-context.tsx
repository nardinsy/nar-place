import { createContext, useState, useEffect, FC } from "react";
import { WithChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import { NotificationDto } from "../helpers/dtos";
import useRequiredAuthContext from "../hooks/use-required-authContext";
import { connectWebSocket } from "../services/webSocket";
import useRequiredSocketContext from "../hooks/use-required-socketContext";

interface NotificationContextT {
  newNotifications: NotificationDto[];
  commentNotifications: NotificationDto[];
  mergeAndResetNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextT | undefined>(
  undefined
);

// const socket = connectWebSocket();

export const NotificationContextProvider: FC<WithChildren<{}>> = ({
  children,
}) => {
  const backend = useRequiredBackend();
  const authCtx = useRequiredAuthContext();
  const socketCtx = useRequiredSocketContext();

  if (!authCtx.isLoggedin) {
    throw new Error("");
    //redirect to login page
  }

  const [newNotifications, setNewNotifications] = useState<NotificationDto[]>(
    []
  );

  const [commentNotifications, setCommentNotifications] = useState<
    NotificationDto[]
  >([]);

  useEffect(() => {
    const fetchNewNotifications = async () => {
      const newNotifications = await backend.getNewNotifications(authCtx.token);
      setNewNotifications(newNotifications);
    };

    fetchNewNotifications();

    console.log("I am listening");

    socketCtx.socket.listenToCommentNotifications((newNotification) => {
      setCommentNotifications((pre) => [newNotification, ...pre]);
    });

    return () => {
      console.log("Cleanup");
      // socket.close();
    };
  }, []);

  const mergeAndResetNotifications = async () => {
    authCtx.updateOldNotifications(newNotifications);
    setNewNotifications([]);

    await backend.mergeAndResetNotifications(authCtx.token);
  };

  const value: NotificationContextT = {
    newNotifications,
    commentNotifications,
    mergeAndResetNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
