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
