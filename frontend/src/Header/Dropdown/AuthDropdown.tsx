import { useHistory } from "react-router-dom";
import Dropdown from "../../shared/DropdownCard";

const AuthDropdown = ({
  closeDropdown,
}: {
  closeDropdown: (event: any) => void;
}) => {
  const history = useHistory();

  const showLoginFormModal = (event: any) => {
    closeDropdown(event);
    history.replace("/login");
  };

  const showSignupFormModal = (event: any) => {
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
    />
  );
};

export default AuthDropdown;
