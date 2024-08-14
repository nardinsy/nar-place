import { FC, useEffect, useRef, useState } from "react";
import { NavLink } from "react-router-dom";
import { MenuListT } from "../MainHeader";

interface BoxMenuProps {
  menulist: MenuListT;
}
const style = { show: "translate-0", hide: "-translate-x-72" };

const BoxMenu: FC<BoxMenuProps> = ({ menulist }) => {
  const [showSidebar, setShowSidebar] = useState(false);
  const sidebarRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (!sidebarRef.current) return;

      if (showSidebar && !sidebarRef.current.contains(e.target)) {
        setShowSidebar(false);
      }
    };

    window.addEventListener("mousedown", checkIfClickedOutside);

    return () => {
      window.removeEventListener("mousedown", checkIfClickedOutside);
    };
  }, [showSidebar]);

  const toggleSideNavbar = (event: React.MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setShowSidebar((pre) => !pre);
  };

  return (
    <>
      <i
        className="bx bx-menu md:hidden block text-4xl text-gray-dark cursor-pointer p-1 hover:bg-gray-light hover:rounded-full hover:p-1"
        onClick={toggleSideNavbar}
      />

      <div
        ref={sidebarRef}
        className={`md:hidden absolute top-0 left-0 w-56 h-dvh m-0 p-0 bg-white shadow-xl shadow-blue-gray-900/5 ${
          showSidebar ? style.show : style.hide
        } transition ease-out delay-150 duration-500`}
      >
        <i
          className={`bx bx-menu py-4 ml-9 text-4xl mt-px w-3 text-gray-dark cursor-pointer`}
          onClick={toggleSideNavbar}
        />

        <ul className="flex flex-col px-3 gap-5 cursor-pointer">
          {menulist.map(([title, icon, path]) => (
            <li key={title} onClick={toggleSideNavbar}>
              <NavLink
                className="flex flex-row items-center w-full py-3 hover:bg-primary-hover hover:text-white hover:rounded-md transition-all"
                to={path}
                exact
              >
                <i className={`bx bx-${icon} px-3 text-2xl`} />
                {title}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>
    </>
  );
};

export default BoxMenu;
