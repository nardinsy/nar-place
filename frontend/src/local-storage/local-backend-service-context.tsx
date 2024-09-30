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

// REMEMBER TO SET INITIAL LOCAL STORAGE **********************
// REMEMBER TO manage user picture type **********************

// TODO: REMEMBER TO cahnge createAbsoluteApiAddress in api-url

class LocalBackendService implements BackendService {
  // global
  setLocalStorageKeys = () => {
    if (!localStorage.getItem(LocalStorageKeys.Users)) {
      localStorage.setItem(LocalStorageKeys.Users, JSON.stringify([]));
    }
    if (!localStorage.getItem(LocalStorageKeys.LoggedUsers)) {
      localStorage.setItem(LocalStorageKeys.LoggedUsers, JSON.stringify([]));
    }
  };

  setValueToLocalStorage: StoreValue = (key, value) => {
    if (localStorage.getItem(key)) {
      localStorage.removeItem(key);
    }
    localStorage.setItem(key, JSON.stringify(value));
  };

  getValueFromLocalStorage: RetrieveValue = (key) => {
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
    const loggedUsers = this.getValueFromLocalStorage(
      LocalStorageKeys.LoggedUsers
    );
    const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

    const loginInfo = loggedUsers.find((info) => info.token === token);
    if (!loginInfo) throw new Error("Token is invalid");

    const user = users.find((user) => user.userId === loginInfo.userId);
    if (!user) throw new Error("Can not find user");

    return user;
  };

  findUserByUserId = (userId: string) => {
    const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

    const user = users.find((u) => u.userId === userId);
    if (!user) throw new Error("Can not find user");

    return user;
  };

  changedUserInfo = (user: IUser) => {
    const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

    const userIndex = users.findIndex((u) => u.userId === user.userId);
    if (!user) throw new Error("Can not find user");

    users[userIndex] = user;
    this.setValueToLocalStorage(LocalStorageKeys.Users, users);
  };

  getAllUsers(): Promise<UserDto[] | []> {
    return new Promise((resolve, reject) => {
      const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

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
      const loggedUsers = this.getValueFromLocalStorage(
        LocalStorageKeys.LoggedUsers
      );
      const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

      const userId = uuid();
      const token = uuid();
      loggedUsers.push({ email, token, userId });
      this.setValueToLocalStorage(LocalStorageKeys.LoggedUsers, loggedUsers);

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
      this.setValueToLocalStorage(LocalStorageKeys.Users, users);

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
      const loggedUsers = this.getValueFromLocalStorage(
        LocalStorageKeys.LoggedUsers
      );
      const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

      const user = users.find((user) => user.email === email);
      if (!user) return reject("Can not find user");

      if (user.password !== password) {
        throw new Error("Password is invalid, please try again");
      }

      const token = uuid();
      loggedUsers.push({ email, token, userId: user.userId });
      this.setValueToLocalStorage(LocalStorageKeys.LoggedUsers, loggedUsers);

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
    const loggedUsers = this.getValueFromLocalStorage(
      LocalStorageKeys.LoggedUsers
    );

    const filteredLoggedUsers = loggedUsers.filter(
      (info) => info.token !== token
    );
    this.setValueToLocalStorage(
      LocalStorageKeys.LoggedUsers,
      filteredLoggedUsers
    );

    // localStorage.removeItem(LocalStorageKeys.Comments);
    // localStorage.removeItem(LocalStorageKeys.Notifications);
    // localStorage.removeItem(LocalStorageKeys.Places);

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
    const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

    const user = users.find((user) => user.userId === userId);
    if (!user) throw new Error("Can not find user");
    const places = this.getPlaceDtoFromIPlace(user.places);
    return Promise.resolve({ places });
  }

  getPlaceById(
    placeId: string
  ): Promise<{ placeDto: PlaceDto; userDto: UserDto }> {
    const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

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
    const users = this.getValueFromLocalStorage(LocalStorageKeys.Users);

    let commentDto: CommentDto[] = [];
    users.forEach((user) => {
      const place = user.places.find((p) => p.placeId === placeId);
      if (place) {
        commentDto = place.comments;
      }
    });

    return Promise.resolve(commentDto);
  }

  checkIfCommentIsParent = (
    comment: CommentDto,
    parentId: string,
    commentId: string
  ) => {
    return comment.id === parentId;
    // return comment.id === parentId &&
    //   comment.replies.find((reply) => reply.id === commentId)
    //   ? true
    //   : false;
  };

  findAndReplaceReplies = (
    primaryList: CommentDto[],
    parentId: string,
    commentId: string,
    callback: (commentId: string, replies: CommentDto[]) => CommentDto[]
  ): boolean => {
    for (const item of primaryList) {
      if (this.checkIfCommentIsParent(item, parentId, commentId)) {
        item.replies = callback(commentId, item.replies);
        return true;
      } else if (item.replies.length > 0) {
        if (
          this.findAndReplaceReplies(
            item.replies,
            parentId,
            commentId,
            callback
          )
        ) {
          return true;
        }
      }
    }
    return false;
  };

  editComment(editComment: CommentDto, token: string): Promise<void> {
    const { id, parentId, date, text, writer } = editComment;

    const owner = this.findUserByToken(token);
    if (owner.userId !== writer.userId) {
      throw new Error("You can not edit this comment");
    }

    const editTargetCommentFromReplies = (
      commentId: string,
      replies: CommentDto[]
    ) => {
      const editedReplies = replies.map((reply) => {
        if (reply.id !== commentId) {
          return reply;
        }
        reply.text = text;
        reply.date = date;
        return reply;
      });

      return editedReplies;
    };

    if (parentId) {
      owner.places.forEach((place) => {
        this.findAndReplaceReplies(
          place.comments,
          parentId,
          id,
          editTargetCommentFromReplies
        );
      });
    } else {
      for (const place of owner.places) {
        for (const comment of place.comments) {
          if (comment.id !== id) {
            continue;
          }
          comment.text = text;
          comment.date = date;
          break;
        }
      }
    }

    this.changedUserInfo(owner);

    return Promise.resolve();
    // const allUsers = this.retrieveValue(LocalStorageKeys.Users);
    // const userIndex = allUsers.findIndex((user) =>
    //   user.places.find((place) => place.placeId === postID)
    // );

    // const places = allUsers[userIndex].places.map((place) => {
    //   if (place.placeId === postID) {
    //     const comments = place.comments.map((comment) => {
    //       if (comment.id === id) {
    //         comment.date = date;
    //         comment.text = text;
    //         return comment;
    //       }
    //       return comment;
    //     });
    //     place.comments = comments;
    //   }
    //   return place;
    // });

    // const user = allUsers[userIndex];
    // user.places = places;
    // this.changedUserInfo(user);
  }

  deleteComment(
    commentId: string,
    parentId: string | undefined,
    token: string
  ): Promise<void> {
    const owner = this.findUserByToken(token);

    const deleteTargetCommentFromReplies = (
      targetCommentId: string,
      replies: CommentDto[]
    ) => {
      const filteredComments = replies.filter(
        (item) => item.id !== targetCommentId
      );

      return filteredComments;
    };

    if (parentId) {
      for (const place of owner.places) {
        if (
          this.findAndReplaceReplies(
            place.comments,
            parentId,
            commentId,
            deleteTargetCommentFromReplies
          )
        ) {
          break;
        }
      }
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

  findNestedCommentAndEditLikesList = (
    listOfComments: CommentDto[],
    commentId: string,
    callback: (comment: CommentDto) => void
  ) => {
    for (const comment of listOfComments) {
      if (comment.id !== commentId && comment.replies.length > 0) {
        this.findNestedCommentAndEditLikesList(
          comment.replies,
          commentId,
          callback
        );
      }
      if (comment.id === commentId) {
        callback(comment);
        return true;
      }
    }
    return false;
  };

  likeComment(
    NewCommentLike: CommentLikeDto,
    commentActionTo: string,
    token: string
  ): Promise<{ commentLikeDto: CommentLikeDto }> {
    const { commentId, date, userId } = NewCommentLike;

    const from = this.findUserByToken(token);
    const to = this.findUserByUserId(commentActionTo);

    const addLikeToLikes = (comment: CommentDto) => {
      comment.likes.unshift({
        commentId,
        userId,
      });
    };

    let currentIndex = 0;
    let placeIndex = 0;
    for (const place of to.places) {
      if (
        this.findNestedCommentAndEditLikesList(
          place.comments,
          commentId,
          addLikeToLikes
        )
      ) {
        placeIndex = currentIndex;
        break;
      } else {
        currentIndex++;
      }
    }

    this.changedUserInfo(to);

    this.addCommetnNotificationToUser(
      from,
      commentActionTo,
      to.places[placeIndex].placeId,
      commentId,
      CommentAction.LikeComment
    );

    const commentLikeDto: CommentLikeDto = { commentId, date, userId };
    return Promise.resolve({ commentLikeDto });
  }

  unlikeComment(
    userId: string,
    commentId: string,
    token: string
  ): Promise<{ commentLikes: { userId: string; commentId: string }[] }> {
    const to = this.findUserByUserId(userId);
    const from = this.findUserByToken(token);

    let newCommentlikes: {
      userId: string;
      commentId: string;
    }[] = [];

    const removeLikefromLikes = (comment: CommentDto) => {
      newCommentlikes = comment.likes.filter(
        (like) => like.userId !== from.userId
      );
      comment.likes = newCommentlikes;
    };

    for (const place of to.places) {
      if (
        this.findNestedCommentAndEditLikesList(
          place.comments,
          commentId,
          removeLikefromLikes
        )
      ) {
        break;
      }
    }

    this.changedUserInfo(to);

    return Promise.resolve({ commentLikes: newCommentlikes });
  }

  replyComment(
    commentReply: CommentReplyDto,
    commentActionTo: string,
    token: string
  ): Promise<{ replyComment: CommentDto }> {
    const { date, parentId, postId, text, userId } = commentReply;

    const from = this.findUserByToken(token);
    const to = this.findUserByUserId(commentActionTo);

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

    const addReplyToReplies = (commentId: string, replies: CommentDto[]) => {
      replies.unshift(newReplyComment);
      return replies;
    };

    for (const place of to.places) {
      if (
        this.findAndReplaceReplies(
          place.comments,
          parentId,
          newCommentId,
          addReplyToReplies
        )
      ) {
        break;
      }
    }

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
