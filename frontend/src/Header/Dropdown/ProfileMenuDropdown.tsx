import { useHistory } from "react-router-dom";

import Dropdown from "../../shared/DropdownCard";

const ProfileMenuDropdown = ({
  closeDropdown,
}: {
  closeDropdown: (event: any) => void;
}) => {
  const history = useHistory();

  const showLogoutMessageModal = (event: any) => {
    closeDropdown(event);
    history.replace("/logout");
  };

  return (
    <Dropdown
      items={[
        // {
        //   title: "Message",
        //   handler: (event) => {
        //     closeDropdown(event);
        //     console.log("Message page");
        //   },
        // },
        // {
        //   title: "Notification",
        //   handler: (event) => {
        //     closeDropdown(event);
        //     console.log("Notification Page");
        //   },
        // },
        {
          title: "Profile Settings",
          handler: (event) => {
            closeDropdown(event);
            //navigate to profile setting page
            history.replace("/profile-settings");
          },
        },
        // {
        //   title: "App Settings",
        //   handler: (event) => {
        //     closeDropdown(event);
        //     //navigate to profile setting page
        //   },
        // },
        {
          title: "Logout",
          handler: showLogoutMessageModal,
        },
      ]}
    ></Dropdown>
  );
};

export default ProfileMenuDropdown;
