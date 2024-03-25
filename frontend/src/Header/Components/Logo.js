import { NavLink } from "react-router-dom";

import classes from "./Logo.module.css";

const Logo = (props) => {
  return (
    <NavLink to="/">
      <h2 className={classes["logo-name"]}>
        <span>N</span>arPlace
      </h2>
    </NavLink>
  );
};

export default Logo;
