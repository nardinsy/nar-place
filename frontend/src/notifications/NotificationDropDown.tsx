import { FC, useRef } from "react";
import useRequiredNotificationContext from "../hooks/use-required-notificationContext";
import NotificationItem from "./NotificationItem";
import { NotificationDto } from "../helpers/dtos";
import useRequiredAuthContext from "../hooks/use-required-authContext";

interface NotificationDropdownT {}

const NotificationDropdown: FC<NotificationDropdownT> = ({}) => {
  const notifCtx = useRequiredNotificationContext();
  const authCtx = useRequiredAuthContext();

  if (!authCtx.isLoggedin) {
    throw new Error("");
  }

  const ref = useRef<HTMLDivElement | null>(null);

  const generateNotificationsItem = (
    notifications: NotificationDto[] | undefined
  ) => {
    if (!notifications) return <></>;
    return notifications.map((notification: NotificationDto, index: number) => {
      return (
        <li
          key={index}
          className="cursor-context-menu px-4 py-6 rounded-xl mb-1 hover:bg-edit-button-bg transition-colors ease-in duration-[0.1s]"
        >
          <NotificationItem notificationDto={notification} />
        </li>
      );
    });
  };

  const oldNotifications = generateNotificationsItem(
    authCtx.readOldNotificationsFromLocalStorage()
  );

  const newNotifications = generateNotificationsItem(notifCtx.newNotifications);

  return (
    <div
      className="absolute top-16 right-5 bg-white w-16rem md:w-[21rem] mb-24 shadow-default rounded-xl overflow-hidden animate-slide-down"
      data-testid="drop"
      ref={ref}
    >
      <div className="font-bold px-6 pt-4 tracking-wide">Notifications</div>
      <ul className="my-3 flex flex-col px-2 max-h-72 overflow-x-hidden overflow-y-scroll scroll-my-13">
        {newNotifications}
        <li key={"a special key"}>-----------------------</li>
        {oldNotifications}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
