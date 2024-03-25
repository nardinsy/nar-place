import { useContext, useEffect, useState, useRef } from "react";

import classes from "./MenuButton.module.css";

import MenuButtonIcon from "./MenuButtonIcon";
import AuthContext from "../../store/auth-context";
import ProfileMenuDropdown from "../Dropdown/ProfileMenuDropdown";
import AuthDropdown from "../Dropdown/AuthDropdown";

const MenuButton = (props) => {
  const authContext = useContext(AuthContext);

  const ref = useRef();

  const [dropdown, setDropdown] = useState({ show: false, component: "" });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e) => {
      if (isMenuOpen && !ref.current.contains(e.target)) {
        setIsMenuOpen(false);
        closeDropdown(e);
      }
    };

    window.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      window.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [isMenuOpen]);

  const closeDropdown = (event) => {
    event.preventDefault();
    event.stopPropagation();
    setDropdown({ show: false, component: "" });
  };

  const showDropDownHandler = (event) => {
    if (!dropdown.show) {
      const component = authContext.isLoggedin ? (
        <ProfileMenuDropdown closeDropdown={closeDropdown} />
      ) : (
        <AuthDropdown closeDropdown={closeDropdown} />
      );
      setDropdown({ show: true, component });
      setIsMenuOpen(true);
    } else {
      closeDropdown(event);
      setIsMenuOpen(false);
    }
  };

  return (
    <div
      className={classes["header-menu-button-container"]}
      onClick={showDropDownHandler}
      ref={ref}
    >
      <MenuButtonIcon isLoggedin={authContext.isLoggedin} />
      {dropdown.show && dropdown.component}
    </div>
  );
};

export default MenuButton;

// return (
//   <div
//     className={classes["auth-menu-container"]}
//     onClick={headerButtonClickHandler}
//   >
//     {authContext.isLoggedin ? authContext.username : <AuthButtonIcons />}
//     {showForms && (
//       <Forms closeAuthenticationModal={closeAuthenticationModal} />
//     )}
//     {showLogoutModal && (
//       <MessageModal message={"Do you want to log out?"}>
//         <Button onClick={logoutClient} action={"submit"}>
//           Logout
//         </Button>
//         <Button onClick={cancelLogoutHandler} action={"cancel"}>
//           Cancel
//         </Button>
//       </MessageModal>
//     )}
//   </div>
// );

// const authContext = useContext(AuthContext);

// const [showForms, setShowForms] = useState(false);
// const [showLogoutModal, setShowLogoutModal] = useState(false);

// useEffect(() => {
//   if (authContext.isLoggedin) {
//     // closeAuthenticationModal();
//     setDropdown({ show: false, component: "" });
//   }
// }, [authContext.isLoggedin]);

// const headerButtonClickHandler = (event) => {
//   event.preventDefault();
//   if (authContext.isLoggedin) {
//     setShowLogoutModal(true);
//     // authContext.logout();
//   } else {
//     showAuthenticationModal();
//   }
// };

// const logoutClient = async (event) => {
//   event.preventDefault();
//   event.stopPropagation();
//   await authContext.logout();
//   setShowLogoutModal(false);
// };

// const cancelLogoutHandler = (event) => {
//   event.preventDefault();
//   event.stopPropagation();
//   setShowLogoutModal(false);
// };

// const showAuthenticationModal = () => {
//   setShowForms(true);
// };

// const closeAuthenticationModal = () => {
//   setShowForms(false);
// };
