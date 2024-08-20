import { useEffect, useRef, useState } from "react";
import NotificationDropdown from "./NotificationDropDown";
import useRequiredNotificationContext from "../hooks/use-required-notificationContext";

const NotificationButton = () => {
  const notifCtx = useRequiredNotificationContext();
  const [showDropdown, setShowDropdown] = useState(false);

  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (!ref.current) return;

      if (showDropdown && !ref.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };

    window.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      window.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showDropdown]);

  const notificationButtonHandler = (e: React.MouseEvent<HTMLElement>) => {
    e.preventDefault();
    setShowDropdown((pre) => !pre);
  };

  return (
    <div onClick={notificationButtonHandler} ref={ref}>
      <button
        className={`relative bx bx-bell text-2xl cursor-pointer hover:bg-gray-light rounded-full mx-4 py-1 px-2`}
      >
        {notifCtx.notificationBadge > 0 ? (
          <span className="absolute top-0 right-0 w-5 h-5 rounded-full flex justify-center items-center bg-red-heart text-white text-[0.6rem]">
            {notifCtx.notificationBadge}
          </span>
        ) : (
          ""
        )}
      </button>
      {showDropdown && <NotificationDropdown />}
    </div>
  );
};

export default NotificationButton;
