import { NavLink, useLocation } from "react-router-dom";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { MenuListT } from "../MainHeader";
import { FC } from "react";

interface MiddleNavLinksT {
  menulist: MenuListT;
}

const MiddleNavLinks: FC<MiddleNavLinksT> = ({ menulist }) => {
  const authContext = useRequiredAuthContext();
  const location = useLocation();

  return (
    <ul className="hidden md:flex items-center gap-3 font-semibold">
      {menulist.map(([title, icon, path]) => (
        <li key={title}>
          {authContext.isLoggedin && (
            <NavLink
              className="p-3 hover:bg-primary hover:text-white rounded-3xl transition-all"
              activeClassName={
                location.pathname === path
                  ? "p-3 text-primary hover:text-white"
                  : ""
              }
              to={path}
            >
              {title}
            </NavLink>
          )}
        </li>
      ))}
    </ul>
  );
};

export default MiddleNavLinks;
