import { Types } from "mongoose";

export class UserDto {
  userId: string;
  username: string;
  pictureUrl: string | undefined;

  constructor(
    userId: string,
    username: string,
    pictureUrl: string | undefined
  ) {
    this.userId = userId;
    this.username = username;
    this.pictureUrl = pictureUrl;
  }
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
    public readonly title: string,
    public readonly description: string,
    public readonly address: string,
    public readonly picture: Types.ObjectId,
    public readonly id: Types.ObjectId,
    public readonly creator: Types.ObjectId,
    public readonly pictureUrl: string
  ) {}
}

export interface UserLoginInformation {
  email: string;
  password: string;
}

export interface UserSignupInformation {
  username: string;
  email: string;
  password: string;
}
