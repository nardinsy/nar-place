import { createContext, useState, useEffect } from "react";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

import sendHttpRequest from "../helpers/http-request";

import { getApiAddress, createAbsoluteApiAddress } from "../helpers/api-url";

const AuthContext = createContext({
  isLoggedin: false,
  token: "",
  username: "",
  userPictureUrl: "",
  userId: "",
  signup: (userInfo) => {},
  login: (userInfo) => {},
  logout: () => {},
  setPictureUrl: (picture) => {},
  setUsername: (username) => {},
});

const saveUserInfoToLocalStorage = (
  token,
  userId,
  username,
  userPictureUrl
) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("username", username);
  if (userPictureUrl) {
    localStorage.setItem("userPictureUrl", userPictureUrl);
  }
};

export const AuthContextProvider = (props) => {
  const [isLoggedin, setIsloggedin] = useState(false);
  const [token, setToken] = useState(undefined);
  const [userId, setUserId] = useState(undefined);
  const [username, setUsername] = useState(undefined);
  const [userPictureUrl, setUserPictureUrl] = useState(undefined);

  const history = useHistory();

  useEffect(() => {
    const storedToken = localStorage.getItem("token");

    if (storedToken) {
      const storedUserId = localStorage.getItem("userId");
      const storedUsername = localStorage.getItem("username");
      const storedUserPictureUrl = localStorage.getItem("userPictureUrl");
      localLogin(
        storedToken,
        storedUserId,
        storedUsername,
        storedUserPictureUrl
      );
    }
  }, []);

  const signup = async (userInfo) => {
    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };
    const address = getApiAddress("signup");

    const data = await sendHttpRequest(address, requestOptions);

    localLogin(data.token, data.userId, data.username, undefined);

    history.replace("/");
  };

  const login = async (userInfo) => {
    if (userInfo.email.length === 0 || userInfo.password.length === 0) {
      console.log("Please enter email or password");
      return;
    }

    const requestOptions = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userInfo),
    };
    const address = getApiAddress("login");

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
    const address = getApiAddress("logout");

    const data = await sendHttpRequest(address, requestOptions);
    console.log(data.message);

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

  const localLogin = (token, userId, username, pictureUrl) => {
    setToken(token);
    setUserId(userId);
    setUsername(username);
    setUserPictureUrl(pictureUrl);
    setIsloggedin(true);

    saveUserInfoToLocalStorage(token, userId, username, pictureUrl);
  };

  const setPictureUrlMethod = (picture) => {
    setUserPictureUrl(picture);
  };

  const changeUsernameMethod = (username) => {
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
      {props.children}
    </AuthContext.Provider>
  );
};

export default AuthContext;

// const addLoginListener = (loginHandler) => {
//   setLoginHandlers((pre) => [...pre, loginHandler]);
// };

// const addLogoutListener = (logoutHanlder) => {
//   setLogoutHandlers((pre) => [...pre, logoutHanlder]);
// };

//loginClientSide
// loginHandlers.forEach((hanlder) => hanlder());
// setLoginHandlers([]);
//

// const changeUserProfileClientSide = (pictureUrl) => {
//Is it simple like this? I should ponder!!
// setUserPictureUrl(URL.createObjectURL(image));
// setUserPictureUrl(absPictureUrl);
// };
