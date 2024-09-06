import { AuthContextT } from "../contexts/auth-context";
import { CommentT } from "../contexts/comment-contex";

export const authProviderValueLoggedinProps = {
  isLoggedin: true,
  token: "1234",
  username: "nardin",
  userPictureUrl: undefined,
  userId: "1234",
  placeCount: 1,
  logout: jest.fn(() => Promise.resolve()),
  setPictureUrl: jest.fn(),
  setUsername: jest.fn(),
  readOldNotificationsFromLocalStorage: jest.fn(),
  // updateOldNotifications: jest.fn(),
} satisfies AuthContextT;

export const authProviderValueLoggedoutProps = {
  isLoggedin: false,
  signup: jest.fn(),
  login: jest.fn((userInfo) => Promise.resolve()),
} satisfies AuthContextT;

export const commentProviderValueProps: CommentT = {
  comments: [],
  getCommetns: jest.fn(),
  uploadNewCommetn: jest.fn(),
  editComment: jest.fn(),
  deleteComment: jest.fn(),
  likeComment: jest.fn(),
  unlikeComment: jest.fn(),
  replyToComment: jest.fn(),
  commentActionTo: "65f700a6e771ff3a4ddabaaf",
};
