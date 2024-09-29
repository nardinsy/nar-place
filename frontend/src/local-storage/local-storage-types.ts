import { CommentDto, NotificationDto, PlaceDto } from "../helpers/dtos";

export enum LocalStorageKeys {
  LoggedUsers = "loggedUsers",
  Users = "users",
  Notifications = "notifications",
}

export type IUser = {
  userId: string;
  username: string;
  email: string;
  password: string;
  picture: string | undefined;
  places: IPlace[];
  oldNotifications: NotificationDto[];
  newNotifications: NotificationDto[];
};

export type IPlace = {
  placeId: string;
  title: string;
  description: string;
  address: string;
  picture: string;
  creator: string;
  comments: CommentDto[];
};

export type loggedUsers = { token: string; email: string; userId: string };

export type StoreValueFunc<LocalStorageKeys, V> = (
  type: LocalStorageKeys,
  value: V
) => void;

type StoreLogedUsers = StoreValueFunc<
  LocalStorageKeys.LoggedUsers,
  loggedUsers[]
>;
type StoreUser = StoreValueFunc<LocalStorageKeys.Users, IUser[]>;
// type StorePlace = StoreValueFunc<LocalStorageKeys.Places, PlaceDto>;
// type StoreComment = StoreValueFunc<LocalStorageKeys.Comments, CommentDto>;
type StoreNotification = StoreValueFunc<
  LocalStorageKeys.Notifications,
  NotificationDto
>;

export type StoreValue = StoreUser &
  StoreLogedUsers &
  // StorePlace &
  // StoreComment &
  StoreNotification;

// export const storeValue: StoreValue = (key, value) => {
//   localStorage.removeItem(key);
//   localStorage.setItem(key, JSON.stringify(value));
// };

export type RetrieveValueFunc<LocalStorageKeys, V> = (
  type: LocalStorageKeys
) => V;

type RetrieveLoggedUsers = RetrieveValueFunc<
  LocalStorageKeys.LoggedUsers,
  loggedUsers[]
>;
type RetrieveUsers = RetrieveValueFunc<LocalStorageKeys.Users, IUser[]>;
// type RetrievePlaces = RetrieveValueFunc<LocalStorageKeys.Places, PlaceDto[]>;
// type RetrieveComments = RetrieveValueFunc<
//   LocalStorageKeys.Comments,
//   CommentDto[]
// >;
type RetrieveNotifications = RetrieveValueFunc<
  LocalStorageKeys.Notifications,
  NotificationDto[]
>;

export type RetrieveValue = RetrieveUsers &
  RetrieveLoggedUsers &
  // RetrievePlaces &
  // RetrieveComments &
  RetrieveNotifications;
