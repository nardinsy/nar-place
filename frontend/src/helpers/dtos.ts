import { Types } from "mongoose";

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
    public pictureId: string,
    public readonly placeId: string,
    public readonly creator: string,
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

export interface NewPlace {
  title: string;
  description: string;
  address: string;
  picture: Base64<"jpeg">;
}

export interface placeInfoCard {
  title: string;
  description: string;
  address: string;
}

export interface PlaceInfoCardWithPictire extends placeInfoCard {
  picture: File;
}

export type Base64<imageType extends string> =
  `data:image/${imageType};base64${string}`;

export type UserInfoType = {
  userId: string;
  username: string;
  placeCount: number;
  pictureUrl: string | undefined;
};

export class LoginResult {
  public readonly message = "User logged in successfully";
  constructor(public readonly token: string, public readonly user: UserDto) {}
}

export type CommentDto = {
  id: string;
  text: string;
  date: string;
  postID: string;
  likes: { userId: string; commentId: string }[];
  writer: CommentWriter;
};

export type CommentWriter = {
  userId: string;
  username: string;
  pictureUrl: string | undefined;
  placeCount: number;
};

export type NewComment = {
  text: string;
  date: Date;
  postID: string;
};

export type CommentLikeDto = {
  userId: string;
  commentId: string;
  date: Date;
};

export type CommentReplyDto = {
  text: string;
  userId: string;
  commentId: string;
  date: Date;
};
