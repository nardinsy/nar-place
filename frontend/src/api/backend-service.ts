import {
  LoginResult,
  UserLoginInformation,
  PlaceDto,
  UserDto,
  placeInfoCard,
  UserSignupInformation,
  NewPlace,
} from "../helpers/dtos";

export interface BackendService {
  getAllUsers(): Promise<UserDto[]>;

  signup(userInfo: UserSignupInformation): Promise<LoginResult>;

  login(userInfo: UserLoginInformation): Promise<LoginResult>;

  logout(token: string): Promise<void>;

  changeProfilePicture(
    pictureFile: string | ArrayBuffer | undefined,
    token: string
  ): Promise<{
    message: string;
    userInfo: UserDto;
  }>;

  changePassword(
    newPassword: string,
    token: string
  ): Promise<{ message: string }>;

  changeUsername(
    newUsername: string,
    token: string
  ): Promise<{ message: string }>;

  deletePlace(placeId: string, token: string): Promise<{ message: string }>;

  getPlaces(token: string): Promise<{
    mesaage: string;
    places: PlaceDto[];
  }>;

  addPlace(
    place: NewPlace,
    token: string
  ): Promise<{
    message: string;
    place: PlaceDto;
  }>;

  editPlace(
    placeInfo: placeInfoCard & { id: string },
    token: string
  ): Promise<{ message: string; place: PlaceDto }>;

  getuserPlaces(userId: string): Promise<{
    mesaage: string;
    places: PlaceDto[];
  }>;
}
