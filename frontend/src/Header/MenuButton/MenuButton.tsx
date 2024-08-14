import { useEffect, useState, useRef, useCallback } from "react";
import MenuButtonIcon from "./MenuButtonIcon";
import ProfileMenuDropdown from "../Dropdown/ProfileMenuDropdown";
import AuthDropdown from "../Dropdown/AuthDropdown";
import useRequiredAuthContext from "../../hooks/use-required-authContext";

const MenuButton = () => {
  const authContext = useRequiredAuthContext();

  const ref = useRef<HTMLDivElement | null>(null);

  const [dropdown, setDropdown] = useState<{
    show: boolean;
    component: JSX.Element | undefined;
  }>({
    show: false,
    component: undefined,
  });

  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (!ref.current) return;

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

  const closeDropdown = useCallback((event: any) => {
    event.preventDefault();
    event.stopPropagation();
    setDropdown({ show: false, component: undefined });
  }, []);

  const showDropDownHandler = useCallback(
    (event: any) => {
      if (!dropdown.show) {
        const component = authContext.isLoggedin ? (
          <ProfileMenuDropdown closeDropdown={closeDropdown} />
        ) : (
          <AuthDropdown closeDropdown={closeDropdown} />
        );
        setDropdown({ show: true, component });
        setIsMenuOpen(true);
        return;
      }
      closeDropdown(event);
      setIsMenuOpen(false);
    },
    [dropdown.show, authContext.isLoggedin]
  );

  return (
    <div data-testid="menu-button" onClick={showDropDownHandler} ref={ref}>
      <MenuButtonIcon />
      {dropdown.show && dropdown.component}
    </div>
  );
};

export default MenuButton;
