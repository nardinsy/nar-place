import { createContext, useState, useEffect, FC } from "react";
import { useHistory } from "react-router-dom";
import { createAbsoluteApiAddress } from "../helpers/api-url";
import {
  UserLoginInformation,
  UserSignupInformation,
} from "../../../backend/src/shared/dtos";
import { HasChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import useRequiredToastContext from "../hooks/use-required-toastContext";
import { NotificationDto } from "../helpers/dtos";
import useRequiredLocalBackendContext from "../local-storage/use-required-local-backend-service-contex";

interface LoggedOutAuthContextT {
  isLoggedin: false;
  signup: (userinfo: UserSignupInformation) => Promise<void>;
  login: (userinfo: UserLoginInformation) => Promise<void>;
}

interface LoggedInAuthContextT {
  isLoggedin: true;
  token: string;
  username: string;
  userPictureUrl: string | undefined;
  userId: string;
  placeCount: number;
  logout: () => Promise<void>;
  setPictureUrl: (picture: string | undefined) => void;
  setUsername: (username: string) => void;
  readOldNotificationsFromLocalStorage: () => NotificationDto[] | undefined;
}

type LoginInfo =
  | {
      isLoggedin: true;
      token: string;
      username: string;
      userPictureUrl: string | undefined;
      userId: string;
      placeCount: number;
    }
  | { isLoggedin: false };

export type AuthContextT = LoggedInAuthContextT | LoggedOutAuthContextT;

const AuthContext = createContext<AuthContextT | undefined>(undefined);

const saveUserInfoToLocalStorage = (
  token: string,
  userId: string,
  username: string,
  userPictureUrl: string | undefined,
  placeCount: number
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
  if (userPictureUrl) {
    localStorage.setItem("userPictureUrl", userPictureUrl);
  }

  localStorage.setItem("placeCount", String(placeCount));
};

const readOldNotificationsFromLocalStorage = ():
  | NotificationDto[]
  | undefined => {
  if (localStorage.getItem("oldNotifications")) {
    return JSON.parse(localStorage.getItem("oldNotifications")!);
  }
  return undefined;
};

export const AuthContextProvider: FC<HasChildren> = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({ isLoggedin: false });

  const history = useHistory();
  // const backend = useRequiredBackend();
  const backend = useRequiredLocalBackendContext();
  const showSuccessToast = useRequiredToastContext().showSuccess;

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const storedUserId = localStorage.getItem("userId")!;
      const storedUsername = localStorage.getItem("username")!;
      const storedUserPictureUrl = localStorage.getItem("userPictureUrl")!;
      const placeCount = localStorage.getItem("placeCount")!;

      localLogin(
        storedToken,
        storedUserId,
        storedUsername,
        storedUserPictureUrl,
        +placeCount
      );
    }
  }, []);

  const signup = async (userInfo: UserSignupInformation) => {
    const data = await backend.signup(userInfo);
    const { token, user } = data;

    localLogin(token, user.userId, user.username, user.pictureUrl, 0);
    showSuccessToast(`Hey ${user.username}, welcome to Narplace 🤗`);

    history.replace("/");
  };

  const login = async (userInfo: UserLoginInformation) => {
    // if (userInfo.email.length === 0 || userInfo.password.length === 0) {
    //   console.log("Please enter email or password");
    //   return;
    // }

    const data = await backend.login(userInfo);
    const { token, user } = data;

    const pictureUrl = user.pictureUrl
      ? createAbsoluteApiAddress(user.pictureUrl)
      : undefined;

    const placeCount = user.placeCount ? user.placeCount : 0;

    localLogin(token, user.userId, user.username, pictureUrl, placeCount);
    showSuccessToast(`Hey ${user.username}, welcome to Narplace 🤗`);

    history.replace("/");
  };

  const logout = async () => {
    if (!loginInfo.isLoggedin) {
      throw new Error("User must be logged in");
    }

    await backend.logout(loginInfo.token);

    localLogout();
  };

  const localLogout = () => {
    setLoginInfo({ isLoggedin: false });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userPictureUrl");
    localStorage.removeItem("placeCount");
    localStorage.removeItem("oldNotifications");

    showSuccessToast("See you soon, have fun 🫡");
    history.replace("/");
  };

  const localLogin = (
    token: string,
    userId: string,
    username: string,
    pictureUrl: string | undefined,
    placeCount: number
  ) => {
    setLoginInfo({
      isLoggedin: true,
      token,
      userId,
      username,
      userPictureUrl: pictureUrl,
      placeCount,
    });
    saveUserInfoToLocalStorage(token, userId, username, pictureUrl, placeCount);
  };

  const setPictureUrlMethod = (picture: string | undefined) => {
    // setUserPictureUrl(picture);
    setLoginInfo((pre) => {
      return { ...pre, userPictureUrl: picture };
    });
  };

  const changeUsernameMethod = (username: string) => {
    // setUsername(username);
    localStorage.removeItem("username");

    localStorage.setItem("username", username);

    setLoginInfo((pre) => {
      return { ...pre, username };
    });
  };

  const value: AuthContextT = loginInfo.isLoggedin
    ? {
        isLoggedin: true,
        token: loginInfo.token,
        username: loginInfo.username,
        userPictureUrl: loginInfo.userPictureUrl,
        userId: loginInfo.userId,
        placeCount: loginInfo.placeCount,
        logout,
        setPictureUrl: setPictureUrlMethod,
        setUsername: changeUsernameMethod,
        readOldNotificationsFromLocalStorage,
      }
    : { isLoggedin: false, signup, login };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
