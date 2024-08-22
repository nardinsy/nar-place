import { FC, useRef } from "react";
import useRequiredNotificationContext from "../hooks/use-required-notificationContext";
import NotificationItem from "./NotificationItem";
import { NotificationDto } from "../helpers/dtos";

interface NotificationDropdownT {}

const NotificationDropdown: FC<NotificationDropdownT> = ({}) => {
  const notifCtx = useRequiredNotificationContext();
  const notifications = notifCtx.oldNotifications;
  const ref = useRef<HTMLDivElement | null>(null);

  const rows = notifications.map(
    (notification: NotificationDto, index: number) => {
      return (
        <li
          key={index}
          className="cursor-context-menu px-4 py-6 rounded-xl mb-1 hover:bg-edit-button-bg transition-colors ease-in duration-[0.1s]"
        >
          <NotificationItem notificationDto={notification} />
        </li>
      );
    }
  );

  return (
    <div
      className="absolute top-16 right-5 bg-white w-16rem md:w-[21rem] mb-24 shadow-default rounded-xl overflow-hidden animate-slide-down"
      data-testid="drop"
      ref={ref}
    >
      <div className="font-bold px-6 pt-4 tracking-wide">Notifications</div>
      <ul className="my-3 flex flex-col px-2 max-h-72 overflow-x-hidden overflow-y-scroll scroll-my-13">
        {rows}
      </ul>
    </div>
  );
};

export default NotificationDropdown;
