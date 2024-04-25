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

interface AuthContextT {
  isLoggedin: boolean;
  token: string | undefined;
  username: string | undefined;
  userPictureUrl: string | undefined;
  userId: string | undefined;
  signup: (userinfo: UserSignupInformation) => Promise<void>;
  login: (userinfo: UserLoginInformation) => Promise<void>;
  logout: () => Promise<void>;
  setPictureUrl: (picrute: string | undefined) => void;
  setUsername: (username: string) => void;
}

const defaultState = {
  isLoggedin: false,
  token: undefined,
  username: undefined,
  userPictureUrl: undefined,
  userId: undefined,
  signup: async (userInfo: UserSignupInformation) => {},
  login: async (userInfo: UserLoginInformation) => {},
  logout: async () => {},
  setPictureUrl: (picture: string | undefined) => {},
  setUsername: (username: string) => {},
};

const AuthContext = createContext<AuthContextT>(defaultState);

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
  const [isLoggedin, setIsloggedin] = useState(false);
  const [token, setToken] = useState<string | undefined>(undefined);
  const [userId, setUserId] = useState<string | undefined>(undefined);
  const [username, setUsername] = useState<string | undefined>(undefined);
  const [userPictureUrl, setUserPictureUrl] = useState<string | undefined>(
    undefined
  );

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
    try {
      const data = await sendHttpRequest(address, requestOptions);
      localLogin(data.token, data.userId, data.username, undefined);
      history.replace("/");
    } catch (e) {
      console.log(e);
    }
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

    const data = await sendHttpRequest(address, requestOptions);

    const pictureUrl = data.pictureUrl
      ? createAbsoluteApiAddress(data.pictureUrl)
      : undefined;

    localLogin(data.token, data.userId, data.username, pictureUrl);

    history.replace("/");
  };

  const logout = async () => {
    const requestOptions = {
      method: "GET",
      headers: { "Content-Type": "application/json", token },
    };
    const address = getApiAddress(ENDPOINTS.logout);
    console.log(address);
    const data = await sendHttpRequest(address, requestOptions);
    if (data.ok) {
      console.log(data);
      console.log(data.message);
    }

    localLogout();
  };

  const localLogout = () => {
    setToken("");
    setUserId("");
    setUsername("");
    setUserPictureUrl("");
    setIsloggedin(false);
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
    setToken(token);
    setUserId(userId);
    setUsername(username);
    setUserPictureUrl(pictureUrl);
    setIsloggedin(true);

    saveUserInfoToLocalStorage(token, userId, username, pictureUrl);
  };

  const setPictureUrlMethod = (picture: string | undefined) => {
    setUserPictureUrl(picture);
  };

  const changeUsernameMethod = (username: string) => {
    setUsername(username);
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedin,
        token,
        username,
        userPictureUrl,
        userId,
        signup,
        login,
        logout,
        setPictureUrl: setPictureUrlMethod,
        setUsername: changeUsernameMethod,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
