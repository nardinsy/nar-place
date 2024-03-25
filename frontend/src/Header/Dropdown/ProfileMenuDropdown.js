import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Dropdown from "./DropdownCard";

const ProfileMenuDropdown = ({ closeDropdown }) => {
  const history = useHistory();

  const showLogoutMessageModal = (event) => {
    closeDropdown(event);
    history.replace("/logout");
  };

  return (
    <Dropdown
      items={[
        {
          title: "Message",
          handler: (event) => {
            closeDropdown(event);
            console.log("Message page");
          },
        },
        {
          title: "Notification",
          handler: (event) => {
            closeDropdown(event);
            console.log("Notification Page");
          },
        },
        {
          title: "Profile Settings",
          handler: (event) => {
            closeDropdown(event);
            //navigate to profile setting page
            history.replace("/profile-settings");
          },
        },
        {
          title: "App Settings",
          handler: (event) => {
            closeDropdown(event);
            //navigate to profile setting page
          },
        },
        {
          title: "Logout",
          handler: showLogoutMessageModal,
        },
      ]}
    ></Dropdown>
  );
};

export default ProfileMenuDropdown;
