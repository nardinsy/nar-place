import { createContext, useState, useEffect, FC } from "react";
import { useHistory } from "react-router-dom";
import sendHttpRequest, { MyRequestOptions } from "../helpers/http-request";
import { getApiAddress, createAbsoluteApiAddress } from "../helpers/api-url";
import { ENDPOINTS } from "../helpers/api-url";
import {
  UserLoginInformation,
  UserSignupInformation,
} from "../../../backend/src/shared/dtos";
import { HasChildren } from "../helpers/props";
import { LoginResult } from "../sharedTypes/dtos";

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
  logout: () => Promise<void>;
  setPictureUrl: (picture: string | undefined) => void;
  setUsername: (username: string) => void;
}

type LoginInfo =
  | {
      isLoggedin: true;
      token: string;
      username: string;
      userPictureUrl: string | undefined;
      userId: string;
    }
  | { isLoggedin: false };

type AuthContextT = LoggedInAuthContextT | LoggedOutAuthContextT;

const AuthContext = createContext<AuthContextT | undefined>(undefined);

const saveUserInfoToLocalStorage = (
  token: string,
  userId: string,
  username: string,
  userPictureUrl: string | undefined
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
  if (userPictureUrl) {
    localStorage.setItem("userPictureUrl", userPictureUrl);
  }
};

export const AuthContextProvider: FC<HasChildren> = ({ children }) => {
  const [loginInfo, setLoginInfo] = useState<LoginInfo>({ isLoggedin: false });
  const history = useHistory();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const storedUserId = localStorage.getItem("userId")!;
      const storedUsername = localStorage.getItem("username")!;
      const storedUserPictureUrl = localStorage.getItem("userPictureUrl")!;

      localLogin(
        storedToken,
        storedUserId,
        storedUsername,
        storedUserPictureUrl
      );
    }
  }, []);

  const signup = async (userInfo: UserSignupInformation) => {
    console.log("here");
    const requestOptions: MyRequestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };
    const address = getApiAddress(ENDPOINTS.signup);

    const data: LoginResult = await sendHttpRequest(address, requestOptions);
    const { token, user, message } = data;

    localLogin(token, user.userId, user.username, user.pictureUrl);
    history.replace("/");
  };

  const login = async (userInfo: UserLoginInformation) => {
    console.log("login");
    if (userInfo.email.length === 0 || userInfo.password.length === 0) {
      console.log("Please enter email or password");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };
    const address = getApiAddress(ENDPOINTS.login);

    const data: LoginResult = await sendHttpRequest(address, requestOptions);

    const { token, user, message } = data;

    const pictureUrl = user.pictureUrl
      ? createAbsoluteApiAddress(user.pictureUrl)
      : undefined;

    localLogin(token, user.userId, user.username, pictureUrl);

    history.replace("/");
  };

  const logout = async () => {
    if (!loginInfo.isLoggedin) {
      throw new Error("User must be logged in");
    }
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token: loginInfo.token },
    };
    const address = getApiAddress(ENDPOINTS.logout);

    await sendHttpRequest(address, requestOptions);

    localLogout();
  };

  const localLogout = () => {
    setLoginInfo({ isLoggedin: false });
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    localStorage.removeItem("username");
    localStorage.removeItem("userPictureUrl");

    history.replace("/");
  };

  const localLogin = (
    token: string,
    userId: string,
    username: string,
    pictureUrl: string | undefined
  ) => {
    setLoginInfo({
      isLoggedin: true,
      token,
      userId,
      username,
      userPictureUrl: pictureUrl,
    });
    saveUserInfoToLocalStorage(token, userId, username, pictureUrl);
  };

  const setPictureUrlMethod = (picture: string | undefined) => {
    // setUserPictureUrl(picture);
    setLoginInfo((pre) => {
      return { ...pre, userPictureUrl: picture };
    });
  };

  const changeUsernameMethod = (username: string) => {
    // setUsername(username);
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
        logout,
        setPictureUrl: setPictureUrlMethod,
        setUsername: changeUsernameMethod,
      }
    : { isLoggedin: false, signup, login };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export default AuthContext;
