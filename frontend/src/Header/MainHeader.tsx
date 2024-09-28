import MenuButton from "./MenuButton/MenuButton";
import BoxMenu from "./Navigation/BoxMenu";
import MiddleNavLinks from "./Navigation/MiddleNavLinks";
import Logo from "./Components/Logo";
import NotificationButton from "../notifications/NotificationButton";
import useRequiredAuthContext from "../hooks/use-required-authContext";
import { NotificationContextProvider } from "../contexts/notification-context";

const HeaderMenuListWhenOnline: MenuListT = [
  ["Users", "home", "/"],
  ["My Places", "image", "/myplace"],
  ["New Place", "image-add", "/new"],
];

const HeaderMenuListWhenOffline: MenuListT = [["Users", "home", "/"]];

export type MenuListT = [title: string, icon: string, path: string][];

const MainHeader = () => {
  const authCtx = useRequiredAuthContext();

  return (
    <div className="fixed top-0 left-0 w-full z-50">
      <header className="flex justify-between items-center text-black py-3 px-8 md:px-29 bg-white drop-shadow-md">
        <BoxMenu
          menulist={
            authCtx.isLoggedin
              ? HeaderMenuListWhenOnline
              : HeaderMenuListWhenOffline
          }
        />
        <Logo />
        <MiddleNavLinks menulist={HeaderMenuListWhenOnline} />
        <div className="flex flex-row items-center p-0 m-0">
          {authCtx.isLoggedin && (
            <NotificationContextProvider>
              <NotificationButton />
            </NotificationContextProvider>
          )}
          <MenuButton />
        </div>
      </header>
    </div>
  );
};

export default MainHeader;
