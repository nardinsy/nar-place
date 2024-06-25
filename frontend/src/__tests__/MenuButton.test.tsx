import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import MenuButton from "../Header/MenuButton/MenuButton";
import AuthContext, { AuthContextT } from "../contexts/auth-context";

const renderMenuButton = () => {
  const authProviderValue = {
    isLoggedin: false,
    signup: jest.fn(async (userInfo) => Promise.resolve()),
    login: jest.fn((userInfo) => Promise.resolve()),
  } satisfies AuthContextT;

  render(
    <AuthContext.Provider value={authProviderValue}>
      <MenuButton />
    </AuthContext.Provider>
  );
};

const renderMenuButtonWithUserLoggedin = () => {
  const authProviderValue = {
    isLoggedin: true,
    token: "1234",
    username: "nardin",
    userPictureUrl: undefined,
    userId: "1234",
    logout: jest.fn(() => Promise.resolve()),
    setPictureUrl: jest.fn(),
    setUsername: jest.fn(),
  } satisfies AuthContextT;

  const { container, baseElement } = render(
    <AuthContext.Provider value={authProviderValue}>
      <MenuButton />
    </AuthContext.Provider>
  );

  return { baseElement };
};

describe("menu button when logged in", () => {
  test("on click show ProfileMenuDropdown", () => {
    renderMenuButtonWithUserLoggedin();
    const menuBtn = screen.getByTestId("menu-button");
    fireEvent.click(menuBtn);

    expect(screen.getByText("Profile Settings")).toBeInTheDocument();
  });

  test("close ProfileMenuDropdown", () => {
    renderMenuButtonWithUserLoggedin();
    const menuBtn = screen.getByTestId("menu-button");
    fireEvent.click(menuBtn);
    fireEvent.click(menuBtn);

    expect(screen.queryByText("Profile Settings")).not.toBeInTheDocument();
  });
});

test("close dropdown when click outside", () => {
  renderMenuButton();

  const menuBtn = screen.getByTestId("menu-button");
  fireEvent.click(menuBtn);

  const outside = screen.getByRole("list");
  fireEvent.click(outside);

  expect(screen.queryByTestId("drop")).not.toBeInTheDocument();
});
