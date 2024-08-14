import MenuButton from "./MenuButton/MenuButton";
import BoxMenu from "./Navigation/BoxMenu";
import MiddleNavLinks from "./Navigation/MiddleNavLinks";
import Logo from "./Components/Logo";

const HeaderMenuList: MenuListT = [
  ["Users", "home", "/"],
  ["My Places", "image", "/myplace"],
  ["New Place", "image-add", "/new"],
];

export type MenuListT = [title: string, icon: string, path: string][];

const MainHeader = () => {
  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <header className="flex justify-between items-center text-black py-3 px-8 md:px-29 bg-white drop-shadow-md">
        <BoxMenu menulist={HeaderMenuList} />
        <Logo />
        <MiddleNavLinks menulist={HeaderMenuList} />
        <MenuButton />
      </header>
    </div>
  );
};

export default MainHeader;
