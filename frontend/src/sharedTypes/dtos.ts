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
    public picture: string,
    public readonly id: string,
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
