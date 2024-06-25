import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import MenuButtonIcon from "../Header/MenuButton/MenuButtonIcon";
import AuthContext, { AuthContextT } from "../contexts/auth-context";

const renderMenuButtonIconWithUserLoggedin = (userpicture: any) => {
  const authProviderValue = {
    isLoggedin: true,
    token: "1234",
    username: "nardin",
    userPictureUrl: userpicture,
    userId: "1234",
    logout: jest.fn(() => Promise.resolve()),
    setPictureUrl: jest.fn(),
    setUsername: jest.fn(),
  } satisfies AuthContextT;

  render(
    <AuthContext.Provider value={authProviderValue}>
      <MenuButtonIcon />
    </AuthContext.Provider>
  );
};

const renderMenuButtonUserLoggedout = () => {
  const authProviderValue = {
    isLoggedin: false,
    signup: jest.fn(async (userInfo) => Promise.resolve()),
    login: jest.fn((userInfo) => Promise.resolve()),
  } satisfies AuthContextT;

  render(
    <AuthContext.Provider value={authProviderValue}>
      <MenuButtonIcon />
    </AuthContext.Provider>
  );
};

test("show user avatar when not loggedin", () => {
  renderMenuButtonUserLoggedout();
  expect(screen.getByTestId("icon")).toBeInTheDocument();
});

test("show user avatar when logged in with out profile picture", () => {
  renderMenuButtonIconWithUserLoggedin(undefined);
  expect(screen.getByTestId("no-image")).toBeInTheDocument();
});

test("show user picture when logged in with profile picture", () => {
  renderMenuButtonIconWithUserLoggedin("picture");
  expect(screen.getByAltText("nardin")).toBeInTheDocument();
});
