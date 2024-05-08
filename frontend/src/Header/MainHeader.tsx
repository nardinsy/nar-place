import MenuButton from "./MenuButton/MenuButton";
import NavLinks from "./Navigation/NavLinks";
import Logo from "./Components/Logo";
import classes from "./MainHeader.module.css";

const MainHeader = () => {
  return (
    <header className={classes["main-header"]}>
      <div className={classes["main-header-container"]}>
        <Logo />

        <NavLinks />

        <MenuButton />
      </div>
      <div className={classes["header-border-line"]}></div>
    </header>
  );
};

export default MainHeader;
