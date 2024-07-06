import { AuthContextT } from "../contexts/auth-context";

export const authProviderValueLoggedin = {
  isLoggedin: true,
  token: "1234",
  username: "nardin",
  userPictureUrl: undefined,
  userId: "1234",
  logout: jest.fn(() => Promise.resolve()),
  setPictureUrl: jest.fn(),
  setUsername: jest.fn(),
} satisfies AuthContextT;
