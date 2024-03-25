import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import Dropdown from "./DropdownCard";

const AuthDropdown = ({ closeDropdown }) => {
  let history = useHistory();

  const showLoginFormModal = (event) => {
    closeDropdown(event);
    history.replace("/login");
  };

  const showSignupFormModal = (event) => {
    closeDropdown(event);
    history.replace("/signup");
  };

  return (
    <Dropdown
      items={[
        {
          title: "Sign up",
          handler: showSignupFormModal,
        },
        {
          title: "Login",
          handler: showLoginFormModal,
        },
      ]}
    ></Dropdown>
  );
};

export default AuthDropdown;
