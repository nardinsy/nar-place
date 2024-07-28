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

export interface NewPlace {
  title: string;
  description: string;
  address: string;
  picture: Base64<"jpeg">;
}

export type Base64<imageType extends string> =
  `data:image/${imageType};base64${string}`;

export type NewComment = {
  text: string;
  date: Date;
  postID: Types.ObjectId;
};

export type CommentDto = {
  id: string;
  text: string;
  date: Date;
  postID: Types.ObjectId;
  writer: CommentWriter;
  likes: Types.ObjectId[];
};

export type CommentWriter = {
  userId: string;
  username: string;
  pictureUrl: string | undefined;
  placeCount: number;
};

export type CommentLikeDto = {
  likeId: Types.ObjectId;
  liker: Types.ObjectId;
  postId: Types.ObjectId;
  commentId: Types.ObjectId;
  date: Date;
};
