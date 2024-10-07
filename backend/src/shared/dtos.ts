import { Types } from "mongoose";
import { IUserNotification } from "../models/notification";

export class UserDto {
  constructor(
    public userId: string,
    public username: string,
    public pictureUrl: string | undefined,
    public placeCount?: number
  ) {}
}

export class UserWithPlacesDto extends UserDto {
  places: string[];
  constructor(
    userId: string,
    username: string,
    pictureUrl: string,
    places: string[]
  ) {
    super(userId, username, pictureUrl);
    this.places = places;
  }
}

export class PlaceDto {
  constructor(
    public title: string,
    public description: string,
    public address: string,
    public pictureId: Types.ObjectId,
    public readonly placeId: Types.ObjectId,
    public readonly creator: Types.ObjectId,
    public pictureUrl: string
  ) {}
}

// export interface Place {
//   title: string;
//   description: string;
//   address: string;
//   picture: string;
//   id: string;
//   creator: string;
//   pictureUrl: string;
// }

export interface UserLoginInformation {
  email: string;
  password: string;
}

export interface UserSignupInformation {
  username: string;
  email: string;
  password: string;
}

export type UrlPath = string;
export interface NewPlace {
  title: string;
  description: string;
  address: string;
  picture: Base64<"jpeg"> | UrlPath;
}

export type Base64<imageType extends string> =
  `data:image/${imageType};base64${string}`;

export type NewComment = {
  text: string;
  date: Date;
  postID: string;
};

export type CommentDto = {
  id: string;
  parentId: string | undefined;
  text: string;
  date: Date;
  postID: Types.ObjectId;
  writer: CommentWriter;
  likes: { userId: string; commentId: string }[];
  replies: CommentDto[];
};

export type CommentWriter = {
  userId: string;
  username: string;
  pictureUrl: string | undefined;
  placeCount: number;
};

export type CommentLikeDto = {
  userId: string;
  commentId: string;
  date: Date;
};

export type CommentReplyDto = {
  parentId: string;
  userId: string;
  postId: string;
  text: string;
  date: Date;
};

export enum CommentAction {
  LikeComment,
  UnlikeComment,
  ReplyComment,
  WriteComment,
}

export type NotificationDto = {
  kind: "Comment" | "Follow";
  from: {
    userId: string;
    username: string;
    pictureUrl: string | undefined;
    placeCount?: number;
  };
  commentContent: {
    placeId: string;
    commentId: string;
    action: CommentAction;
  };
};
