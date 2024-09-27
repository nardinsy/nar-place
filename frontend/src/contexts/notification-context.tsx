import { createContext, useState, useEffect, FC, useCallback } from "react";
import { WithChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import { NotificationDto } from "../helpers/dtos";
import useRequiredAuthContext from "../hooks/use-required-authContext";
import { createWebSocket } from "../services/webSocket";
import useRequiredLocalBackendContext from "../local-storage/use-required-local-backend-service-contex";

interface NotificationContextT {
  newNotifications: NotificationDto[];
  currentNotifications: NotificationDto[];
  mergeAndResetNotifications: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextT | undefined>(
  undefined
);

const socket = createWebSocket();

export const NotificationContextProvider: FC<WithChildren<{}>> = ({
  children,
}) => {
  // const backend = useRequiredBackend();
  const backend = useRequiredLocalBackendContext();

  const authCtx = useRequiredAuthContext();

  if (!authCtx.isLoggedin) {
    throw new Error("");
    //redirect to login page
  }

  const [currentNotifications, setCurrentNotifications] = useState<
    NotificationDto[]
  >([]);

  const [newNotifications, setNewNotifications] = useState<NotificationDto[]>(
    []
  );

  const fetchAndSetCurrentNotifications = useCallback(async () => {
    console.log("This should call only one time");
    const { currentNotifications } = await backend.getCurrentNotifications(
      authCtx.token
    );
    setCurrentNotifications(currentNotifications);
  }, [authCtx.token, backend]);

  useEffect(() => {
    fetchAndSetCurrentNotifications();
  }, [fetchAndSetCurrentNotifications]);

  useEffect(() => {
    // const fetchNewNotifications = async () => {
    //   const newNotifications = await backend.getNewNotifications(authCtx.token);
    //   setNewNotifications(newNotifications);
    // };

    // fetchNewNotifications();

    const connectSocket = async () => {
      const isConnected = await socket.connect(authCtx.token);
      if (!isConnected) {
        console.log("Offline");
        return;
      }

      socket.listenToCommentNotifications((newNotification) => {
        setNewNotifications((pre) => [newNotification, ...pre]);
      });
    };

    connectSocket();

    return () => {
      socket.close();
    };
  }, [authCtx.token]);

  const mergeAndResetNotifications = async () => {
    // authCtx.updateOldNotifications(newNotifications);
    setCurrentNotifications((pre) => [...newNotifications, ...pre]);
    setNewNotifications([]);

    await backend.mergeAndResetNotifications(authCtx.token);
  };

  const value: NotificationContextT = {
    newNotifications,
    currentNotifications,
    mergeAndResetNotifications,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationContext;
