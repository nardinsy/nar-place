import { NavLink } from "react-router-dom";

const Logo = () => {
  return (
    <NavLink to="/">
      <h2 className="text-primary-dark hover:text-primary-hover font-bold text-xl tracking-wide transition-all">
        NarPlace
      </h2>
    </NavLink>
  );
};

export default Logo;
