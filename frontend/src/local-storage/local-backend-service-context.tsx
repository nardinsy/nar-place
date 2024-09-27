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
  CommentWriter,
  CommentAction,
} from "../helpers/dtos";
import { BackendService } from "../api/backend-service";
import uuid from "react-uuid";
import {
  LocalStorageKeys,
  IUser,
  StoreValue,
  RetrieveValue,
  IPlace,
} from "../local-storage/local-storage-types";
import { comment } from "postcss";

const saveToLocalStorageList = (title: string, value: string) => {
  if (!localStorage.getItem(title)) return;

  const titleFromStorage: any[] = JSON.parse(localStorage.getItem(title)!);
  titleFromStorage.push(value);
  localStorage.removeItem(title);

  localStorage.setItem(title, JSON.stringify(titleFromStorage));
};

// REMEMBER TO SET INITIAL LOCAL STORAGE **********************
// REMEMBER TO manage user picture type **********************

class LocalBackendService implements BackendService {
  // global
  setLocalStorageKeys = () => {
    if (!localStorage.getItem(LocalStorageKeys.Users)) {
      localStorage.setItem(LocalStorageKeys.Users, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageKeys.LoggedUsers)) {
      localStorage.setItem(LocalStorageKeys.LoggedUsers, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageKeys.Comments)) {
      localStorage.setItem(LocalStorageKeys.Comments, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageKeys.Notifications)) {
      localStorage.setItem(LocalStorageKeys.Notifications, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageKeys.Places)) {
      localStorage.setItem(LocalStorageKeys.Places, JSON.stringify([]));
    }
  };

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

  findUserByToken = (token: string) => {
    const loggedUsers = this.retrieveValue(LocalStorageKeys.LoggedUsers);
    const users = this.retrieveValue(LocalStorageKeys.Users);

    const loginInfo = loggedUsers.find((info) => info.token === token);
    if (!loginInfo) throw new Error("Token is invalid");

    const user = users.find((user) => user.userId === loginInfo.userId);
    if (!user) throw new Error("Can not find user");

    return user;
  };

  findUserByUserId = (userId: string) => {
    const users = this.retrieveValue(LocalStorageKeys.Users);

    const user = users.find((u) => u.userId === userId);
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

  getPlaceDtoFromIPlace = (places: IPlace[]) => {
    const placeDtos = places.map((place) => {
      let { comments: _, ...rest } = place;

      const placeDto: PlaceDto = {
        ...rest,
        pictureUrl: rest.picture,
        pictureId: "",
      };

      return placeDto;
    });

    return placeDtos;
  };

  addCommetnNotificationToUser = async (
    from: IUser,
    to: string,
    placeId: string,
    commentId: string,
    action: CommentAction
  ) => {
    if (from.userId === to) return;

    const fromUser = {
      userId: from.userId,
      username: from.username,
      pictureUrl: from.picture,
      placeCount: from.places.length,
    };

    const commentContent = {
      placeId,
      commentId,
      action,
    };

    const commentNotification: NotificationDto = {
      kind: "Comment",
      from: fromUser,
      commentContent,
    };

    const toUser = this.findUserByUserId(to);
    toUser.newNotifications.unshift(commentNotification);

    this.changedUserInfo(toUser);

    return commentNotification;
  };

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

    localStorage.removeItem(LocalStorageKeys.Comments);
    localStorage.removeItem(LocalStorageKeys.Notifications);
    localStorage.removeItem(LocalStorageKeys.Places);

    return Promise.resolve();
  }

  // profile

  changeProfilePicture(
    pictureFile: string | ArrayBuffer | undefined,
    token: string
  ): Promise<{ userInfo: UserDto }> {
    const user = this.findUserByToken(token);
    user.picture = pictureFile as string;

    this.changedUserInfo(user);
    const userDto: UserDto = {
      userId: user.userId,
      username: user.username,
      pictureUrl: user.picture,
      placeCount: user.places.length,
    };

    return Promise.resolve({ userInfo: userDto });
  }

  changePassword(newPassword: string, token: string): Promise<void> {
    const user = this.findUserByToken(token);
    user.password = newPassword;
    this.changedUserInfo(user);

    return Promise.resolve();
  }

  changeUsername(newUsername: string, token: string): Promise<void> {
    const user = this.findUserByToken(token);
    user.username = newUsername;
    this.changedUserInfo(user);

    return Promise.resolve();
  }

  //places

  getLoggedUserPlaces(token: string): Promise<{ places: PlaceDto[] }> {
    const user = this.findUserByToken(token);

    const places = this.getPlaceDtoFromIPlace(user.places);
    return Promise.resolve({ places });
  }

  addPlace(place: NewPlace, token: string): Promise<{ place: PlaceDto }> {
    const user = this.findUserByToken(token);
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

    const IPlace: IPlace = {
      address,
      title,
      description,
      placeId: uuid(),
      creator: user.userId,
      comments: [],
      picture,
    };

    user.places.unshift(IPlace);
    this.changedUserInfo(user);

    return Promise.resolve({ place: placeDto });
  }

  editPlace(
    placeInfo: placeInfoCard & { id: string },
    token: string
  ): Promise<{ place: PlaceDto }> {
    const user = this.findUserByToken(token);
    const { id, title, description, address } = placeInfo;
    const placeIndex = user.places.findIndex((p) => p.placeId === id);

    const IPlace: IPlace = {
      ...user.places[placeIndex],
      address,
      description,
      title,
    };

    const placeDto: PlaceDto = {
      placeId: id,
      title,
      description,
      address,
      creator: IPlace.creator,
      pictureId: IPlace.picture,
      pictureUrl: IPlace.picture,
    };

    user.places[placeIndex] = IPlace;
    this.changedUserInfo(user);

    return Promise.resolve({ place: placeDto });
  }

  deletePlaceById(placeId: string, token: string): Promise<void> {
    const user = this.findUserByToken(token);
    const filteredPlaces = user.places.filter((p) => p.placeId !== placeId);

    user.places = filteredPlaces;

    this.changedUserInfo(user);

    return Promise.resolve();
  }

  getAnyUserPlacesByUserId(userId: string): Promise<{ places: PlaceDto[] }> {
    const users = this.retrieveValue(LocalStorageKeys.Users);

    const user = users.find((user) => user.userId === userId);
    if (!user) throw new Error("Can not find user");
    const places = this.getPlaceDtoFromIPlace(user.places);
    return Promise.resolve({ places });
  }

  getPlaceById(
    placeId: string
  ): Promise<{ placeDto: PlaceDto; userDto: UserDto }> {
    const users = this.retrieveValue(LocalStorageKeys.Users);

    let allusersPlaces: IPlace[] = [];

    users.forEach((user) => {
      allusersPlaces = [...allusersPlaces, ...user.places];
    });

    const place = allusersPlaces.find((p) => p.placeId === placeId);
    if (!place) {
      throw new Error("Can not find place with this id");
    }

    let { comments: _, ...rest } = place;

    const placeDto: PlaceDto = {
      ...rest,
      pictureUrl: rest.picture,
      pictureId: "",
    };

    const user = users.find((u) => u.userId === placeDto.creator);

    if (!user) {
      throw new Error("Can not find user with this id");
    }

    const userDto: UserDto = {
      userId: user.userId,
      username: user.username,
      pictureUrl: user.picture,
      placeCount: user.places.length,
    };

    return Promise.resolve({ placeDto, userDto });
  }

  // comments

  addComment(
    NewComment: NewComment,
    commentActionTo: string,
    token: string
  ): Promise<{ comment: CommentDto }> {
    const { date, postID, text } = NewComment;

    const from = this.findUserByToken(token);
    const to = this.findUserByUserId(commentActionTo);

    const commentWriter: CommentWriter = {
      userId: from.userId,
      username: from.username,
      pictureUrl: from.picture,
      placeCount: from.places.length,
    };

    const newCommentId = uuid();
    const comment: CommentDto = {
      id: newCommentId,
      postID,
      text,
      writer: commentWriter,
      likes: [],
      replies: [],
      date: date.toDateString(),
      parentId: undefined,
    };

    const place = to.places.find((p) => p.placeId === postID);
    if (!place) {
      throw new Error("Can not find place");
    }
    place.comments.unshift(comment);

    this.changedUserInfo(to);

    const notificationDto = this.addCommetnNotificationToUser(
      from,
      commentActionTo,
      postID,
      newCommentId,
      CommentAction.WriteComment
    );

    return Promise.resolve({ comment });
  }

  getComments(placeId: string): Promise<CommentDto[]> {
    const users = this.retrieveValue(LocalStorageKeys.Users);

    let commentDto: CommentDto[] = [];
    users.forEach((user) => {
      const place = user.places.find((p) => p.placeId === placeId);
      if (place) {
        commentDto = place.comments;
      }
    });

    return Promise.resolve(commentDto);
  }

  editComment(editComment: CommentDto, token: string): Promise<void> {
    const { id, parentId, postID, date, text, writer, likes, replies } =
      editComment;

    const editer = this.findUserByToken(token);
    if (editer.userId !== writer.userId) {
      throw new Error("You can not edit this comment");
    }

    const allUsers = this.retrieveValue(LocalStorageKeys.Users);
    const userIndex = allUsers.findIndex((user) =>
      user.places.find((place) => place.placeId === postID)
    );

    const places = allUsers[userIndex].places.map((place) => {
      if (place.placeId === postID) {
        const comments = place.comments.map((comment) => {
          if (comment.id === id) {
            comment.date = date;
            comment.text = text;
            return comment;
          }
          return comment;
        });
        place.comments = comments;
      }
      return place;
    });

    const user = allUsers[userIndex];
    user.places = places;
    this.changedUserInfo(user);

    return Promise.resolve();
  }

  deleteComment(
    commentId: string,
    parentId: string | undefined,
    token: string
  ): Promise<void> {
    const owner = this.findUserByToken(token);

    const checkCommentIsParentOrNot = (comment: CommentDto) => {
      return comment.id === parentId &&
        comment.replies.find((reply) => reply.id === commentId)
        ? true
        : false;
    };

    const deleteTargetCommentFromReplies = (
      targetCommentId: string,
      replies: CommentDto[]
    ) => {
      const filteredComments = replies.filter(
        (item) => item.id !== targetCommentId
      );
      // console.log("original", replies);
      // console.log("filtered", filteredComments);

      // listOfCom = filteredComments;
      return filteredComments;
    };

    const dfsFindComment = (primaryList: CommentDto[]) => {
      let newList: CommentDto[] = primaryList;
      primaryList.forEach((item) => {
        if (checkCommentIsParentOrNot(item)) {
          newList = deleteTargetCommentFromReplies(commentId, item.replies);
          item.replies = newList;
          // console.log("delelte", newList);
          return;
        } else if (item.replies.length > 0) {
          const newList = dfsFindComment(item.replies);
          item.replies = newList;
          return;
        }
        return;
      });
      // console.log(newList);
      return newList;
    };

    if (parentId) {
      owner.places.forEach((place) => {
        dfsFindComment(place.comments);
      });
    } else {
      owner.places.forEach((place) => {
        place.comments.forEach((comment) => {
          if (comment.id !== commentId) {
            return;
          }
          const filteredComments = place.comments.filter(
            (comment) => comment.id !== commentId
          );
          place.comments = filteredComments;
          return;
        });
      });
    }

    this.changedUserInfo(owner);

    return Promise.resolve();
  }

  likeComment(
    NewCommentLike: CommentLikeDto,
    commentActionTo: string,
    token: string
  ): Promise<{ commentLikeDto: CommentLikeDto }> {
    const { commentId, date, userId } = NewCommentLike;

    const to = this.findUserByUserId(commentActionTo);
    const from = this.findUserByToken(token);

    const placeIndex = to.places.findIndex((place) =>
      place.comments.find((comment) => comment.id === commentId)
    );

    const commentIndex = to.places[placeIndex].comments.findIndex(
      (comment) => comment.id === commentId
    );

    to.places[placeIndex].comments[commentIndex].likes.unshift({
      commentId,
      userId,
    });

    this.changedUserInfo(to);

    const commentLikeDto: CommentLikeDto = { commentId, date, userId };

    this.addCommetnNotificationToUser(
      from,
      commentActionTo,
      to.places[placeIndex].placeId,
      commentId,
      CommentAction.LikeComment
    );
    return Promise.resolve({ commentLikeDto });
  }

  unlikeComment(
    userId: string,
    commentId: string,
    token: string
  ): Promise<{ commentLikes: { userId: string; commentId: string }[] }> {
    const to = this.findUserByUserId(userId);
    const from = this.findUserByToken(token);

    const placeIndex = to.places.findIndex((place) =>
      place.comments.find((comment) => comment.id === commentId)
    );

    const commentIndex = to.places[placeIndex].comments.findIndex(
      (comment) => comment.id === commentId
    );

    const newCommentlikes = to.places[placeIndex].comments[
      commentIndex
    ].likes.filter((like) => like.userId !== from.userId);

    to.places[placeIndex].comments[commentIndex].likes = newCommentlikes;

    this.changedUserInfo(to);

    return Promise.resolve({ commentLikes: newCommentlikes });
  }

  replyComment(
    commentReply: CommentReplyDto,
    commentActionTo: string,
    token: string
  ): Promise<{ replyComment: CommentDto }> {
    const { date, parentId, postId, text, userId } = commentReply;

    const to = this.findUserByUserId(commentActionTo);
    const from = this.findUserByUserId(userId);

    const writer: CommentWriter = {
      userId,
      username: from.username,
      pictureUrl: from.picture,
      placeCount: from.places.length,
    };

    const newCommentId = uuid();
    const newReplyComment: CommentDto = {
      date: date.toString(),
      id: newCommentId,
      likes: [],
      parentId,
      postID: postId,
      replies: [],
      text,
      writer,
    };

    const newPlaces = to.places.map((place) => {
      if (place.placeId === postId) {
        // place.comments.unshift(newReplyComment);
        const parentindex = place.comments.findIndex(
          (comment) => comment.id === parentId
        );
        place.comments[parentindex].replies.unshift(newReplyComment);
      }
      return place;
    });

    to.places = newPlaces;
    this.changedUserInfo(to);

    this.addCommetnNotificationToUser(
      from,
      commentActionTo,
      postId,
      newCommentId,
      CommentAction.ReplyComment
    );

    return Promise.resolve({ replyComment: newReplyComment });
  }

  // notifications

  getCurrentNotifications(
    token: string
  ): Promise<{ currentNotifications: NotificationDto[] }> {
    const user = this.findUserByToken(token);

    const currentNotifications: NotificationDto[] = user.oldNotifications;
    return Promise.resolve({ currentNotifications });
  }

  getNewNotifications(token: string): Promise<NotificationDto[]> {
    const user = this.findUserByToken(token);

    const newNotifications: NotificationDto[] = user.newNotifications;
    return Promise.resolve(newNotifications);
  }

  mergeAndResetNotifications(token: string): Promise<void> {
    const user = this.findUserByToken(token);

    user.oldNotifications = [
      ...user.newNotifications,
      ...user.oldNotifications,
    ];

    user.newNotifications = [];

    return Promise.resolve();
  }
}

const LocalBackendContex = createContext<BackendService | undefined>(undefined);

export const LocalBackendContextProvider: FC<HasChildren> = ({ children }) => {
  const service = new LocalBackendService();
  service.setLocalStorageKeys();
  return (
    <LocalBackendContex.Provider value={service}>
      {children}
    </LocalBackendContex.Provider>
  );
};

export default LocalBackendContex;
