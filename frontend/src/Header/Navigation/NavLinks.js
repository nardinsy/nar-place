import { NavLink, useLocation } from "react-router-dom";

import classes from "./NavLinks.module.css";
import { useContext } from "react";
import AuthContext from "../../store/auth-context";

const NavLinks = (props) => {
  const authContext = useContext(AuthContext);

  const location = useLocation();

  return (
    <ul className={classes["nav-links"]}>
      <li>
        <NavLink
          activeClassName={location.pathname === "/" ? classes.active : ""}
          to="/"
          exact
        >
          USERS
        </NavLink>
      </li>
      <li>
        {authContext.isLoggedin && (
          <NavLink
            activeClassName={
              location.pathname === "/myplace" ? classes.active : ""
            }
            to="/myplace"
          >
            MY PLACES
          </NavLink>
        )}
      </li>
      <li>
        {authContext.isLoggedin && (
          <NavLink
            activeClassName={location.pathname === "/new" ? classes.active : ""}
            to="/new"
          >
            ADD PLACE
          </NavLink>
        )}
      </li>
    </ul>
  );
};

export default NavLinks;
