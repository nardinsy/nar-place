import { FC, createContext } from "react";
import { HasChildren } from "../helpers/props";
import {
  UserDto,
  UserSignupInformation,
  LoginResult,
  UserLoginInformation,
  PlaceDto,
  NewPlace,
  placeInfoCard,
  NewComment,
  CommentDto,
  CommentLikeDto,
  CommentReplyDto,
  NotificationDto,
} from "../helpers/dtos";
import { BackendService } from "../api/backend-service";
import uuid from "react-uuid";
import {
  LocalStorageKeys,
  IUser,
  StoreValue,
  RetrieveValue,
} from "../helpers/local-storage-types";

const saveToLocalStorageList = (title: string, value: string) => {
  if (!localStorage.getItem(title)) return;

  const titleFromStorage: any[] = JSON.parse(localStorage.getItem(title)!);
  titleFromStorage.push(value);
  localStorage.removeItem(title);

  localStorage.setItem(title, JSON.stringify(titleFromStorage));
};

// REMEMBER TO SET INITIAL LOCAL STORAGE **********************
// REMEMBER TO manage user picture type **********************

// const setUpLocalStorage = () => {
//   localStorage.setItem(LocalStorageKeys.LoggedUsers, JSON.stringify([]));
//   localStorage.setItem(LocalStorageKeys.Users, JSON.stringify([]));
//   localStorage.setItem(LocalStorageKeys.Comments, JSON.stringify([]));
//   localStorage.setItem(LocalStorageKeys.Notifications, JSON.stringify([]));
//   localStorage.setItem(LocalStorageKeys.Places, JSON.stringify([]));
// };

class LocalBackendService implements BackendService {
  // global

  storeValue: StoreValue = (key, value) => {
    localStorage.removeItem(key);
    localStorage.setItem(key, JSON.stringify(value));
  };

  retrieveValue: RetrieveValue = (key) => {
    try {
      const data = localStorage.getItem(key);
      if (data) {
        return JSON.parse(data);
      } else {
        throw new Error("Can not find this key in local storage");
      }
      // return JSON.parse(localStorage.getItem(key) || "null");
    } catch {
      return null;
    }
  };

  findUser = (token: string) => {
    const loggedUsers = this.retrieveValue(LocalStorageKeys.LoggedUsers);
    const users = this.retrieveValue(LocalStorageKeys.Users);

    const loginInfo = loggedUsers.find((info) => info.token === token);
    if (!loginInfo) throw new Error("Token is invalid");

    const user = users.find((user) => user.userId === loginInfo.userId);
    if (!user) throw new Error("Can not find user");

    return user;
  };

  changedUserInfo = (user: IUser) => {
    const users = this.retrieveValue(LocalStorageKeys.Users);

    const userIndex = users.findIndex((u) => u.userId === user.userId);
    if (!user) throw new Error("Can not find user");

    users[userIndex] = user;
    this.storeValue(LocalStorageKeys.Users, users);
  };

  getAllUsers(): Promise<UserDto[] | []> {
    return new Promise((resolve, reject) => {
      const users = this.retrieveValue(LocalStorageKeys.Users);

      const userDtos = users.map((user) => {
        const userDto: UserDto = {
          userId: user.userId,
          username: user.username,
          pictureUrl: user.picture,
          placeCount: user.places.length,
        };
        return userDto;
      });

      resolve(userDtos);
    });
  }

  // auth

  signup(userInfo: UserSignupInformation): Promise<LoginResult> {
    const { email, password, username } = userInfo;

    return new Promise((resolve, reject) => {
      const loggedUsers = this.retrieveValue(LocalStorageKeys.LoggedUsers);
      const users = this.retrieveValue(LocalStorageKeys.Users);

      const userId = uuid();
      const token = uuid();
      loggedUsers.push({ email, token, userId });
      this.storeValue(LocalStorageKeys.LoggedUsers, loggedUsers);

      const newUser: IUser = {
        userId,
        username,
        email,
        password,
        picture: undefined,
        places: [],
        oldNotifications: [],
        newNotifications: [],
      };
      users.push(newUser);
      this.storeValue(LocalStorageKeys.Users, users);

      const userDto: UserDto = {
        userId,
        username,
        pictureUrl: undefined,
        placeCount: 0,
      };

      const loginResult: LoginResult = {
        message: "User logged in successfully",
        token,
        user: userDto,
      };
      resolve(loginResult);
    });
  }

  login(userInfo: UserLoginInformation): Promise<LoginResult> {
    const { email, password } = userInfo;

    return new Promise((resolve, reject) => {
      const loggedUsers = this.retrieveValue(LocalStorageKeys.LoggedUsers);
      const users = this.retrieveValue(LocalStorageKeys.Users);

      const user = users.find((user) => user.email === email);
      if (!user) return reject("Can not find user");

      if (user.password !== password) {
        throw new Error("Password is invalid, please try again");
      }

      const token = uuid();
      loggedUsers.push({ email, token, userId: user.userId });
      this.storeValue(LocalStorageKeys.LoggedUsers, loggedUsers);

      const userDto: UserDto = {
        userId: user.userId,
        username: user.username,
        pictureUrl: user.picture,
        placeCount: user.places.length,
      };

      const loginResult: LoginResult = {
        message: "User logged in successfully",
        token,
        user: userDto,
      };
      resolve(loginResult);
    });
  }

  logout(token: string): Promise<void> {
    const loggedUsers = this.retrieveValue(LocalStorageKeys.LoggedUsers);
    const filteredLoggedUsers = loggedUsers.filter(
      (info) => info.token !== token
    );
    this.storeValue(LocalStorageKeys.LoggedUsers, filteredLoggedUsers);

    return Promise.resolve();
  }

  // profile

  changeProfilePicture(
    pictureFile: string | ArrayBuffer | undefined,
    token: string
  ): Promise<{ userInfo: UserDto }> {
    return new Promise((resolve, reject) => {
      const user = this.findUser(token);

      // user.picture = pictureFile;
    });
  }

  changePassword(newPassword: string, token: string): Promise<void> {
    const user = this.findUser(token);
    user.password = newPassword;
    this.changedUserInfo(user);

    return Promise.resolve();
  }

  changeUsername(newUsername: string, token: string): Promise<void> {
    const user = this.findUser(token);
    user.username = newUsername;
    this.changedUserInfo(user);

    return Promise.resolve();
  }

  //places

  getLoggedUserPlaces(token: string): Promise<{ places: PlaceDto[] }> {
    const user = this.findUser(token);

    return Promise.resolve({ places: user.places });
  }

  addPlace(place: NewPlace, token: string): Promise<{ place: PlaceDto }> {
    const user = this.findUser(token);
    const { title, description, address, picture } = place;

    const placeDto: PlaceDto = {
      address,
      title,
      description,
      placeId: uuid(),
      creator: user.userId,
      pictureId: "",
      pictureUrl: picture,
    };

    return Promise.resolve({ place: placeDto });
  }

  editPlace(
    placeInfo: placeInfoCard & { id: string },
    token: string
  ): Promise<{ place: PlaceDto }> {
    throw new Error("Method not implemented.");
  }

  deletePlaceById(placeId: string, token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  getAnyUserPlacesByUserId(userId: string): Promise<{ places: PlaceDto[] }> {
    throw new Error("Method not implemented.");
  }

  getPlaceById(
    placeId: string
  ): Promise<{ placeDto: PlaceDto; userDto: UserDto }> {
    throw new Error("Method not implemented.");
  }

  // comments

  addComment(
    NewComment: NewComment,
    commentActionTo: string,
    token: string
  ): Promise<{ comment: CommentDto }> {
    throw new Error("Method not implemented.");
  }

  getComments(placeId: string): Promise<CommentDto[]> {
    throw new Error("Method not implemented.");
  }

  editComment(editComment: CommentDto, token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }

  deleteComment(
    commentId: string,
    parentId: string | undefined,
    token: string
  ): Promise<void> {
    throw new Error("Method not implemented.");
  }

  likeComment(
    NewCommentLike: CommentLikeDto,
    commentActionTo: string,
    token: string
  ): Promise<{ commentLikeDto: CommentLikeDto }> {
    throw new Error("Method not implemented.");
  }

  unlikeComment(
    userId: string,
    commentId: string,
    token: string
  ): Promise<{ commentLikes: { userId: string; commentId: string }[] }> {
    throw new Error("Method not implemented.");
  }

  replyComment(
    commentReply: CommentReplyDto,
    commentActionTo: string,
    token: string
  ): Promise<{ replyComment: CommentDto }> {
    throw new Error("Method not implemented.");
  }

  // notifications

  getCurrentNotifications(
    token: string
  ): Promise<{ currentNotifications: NotificationDto[] }> {
    throw new Error("Method not implemented.");
  }

  getNewNotifications(token: string): Promise<NotificationDto[]> {
    throw new Error("Method not implemented.");
  }

  mergeAndResetNotifications(token: string): Promise<void> {
    throw new Error("Method not implemented.");
  }
}

const LocalBackendContex = createContext<BackendService | undefined>(undefined);

export const LocalBackendContextProvider: FC<HasChildren> = ({ children }) => {
  // const setUpLocalStorageKeys = useCallback(setUpLocalStorage, []);

  // useEffect(() => {
  //   setUpLocalStorageKeys();
  // }, [setUpLocalStorageKeys]);
  const service = new LocalBackendService();
  return (
    <LocalBackendContex.Provider value={service}>
      {children}
    </LocalBackendContex.Provider>
  );
};

export default LocalBackendContex;
