import {
  CommentDto,
  NotificationDto,
  PlaceDto,
  UserDto,
  UserSignupInformation,
} from "./dtos";

export enum LocalStorageKeys {
  LoggedUsers = "loggedUsers",
  Users = "users",
  Comments = "comments",
  Notifications = "notifications",
  Places = "places",
}

export type IUser = {
  userId: string;
  username: string;
  email: string;
  password: string;
  picture: string | undefined;
  places: PlaceDto[];
  oldNotifications: NotificationDto[];
  newNotifications: NotificationDto[];
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
type StorePlace = StoreValueFunc<LocalStorageKeys.Places, PlaceDto>;
type StoreComment = StoreValueFunc<LocalStorageKeys.Comments, CommentDto>;
type StoreNotification = StoreValueFunc<
  LocalStorageKeys.Notifications,
  NotificationDto
>;

export type StoreValue = StoreUser &
  StoreLogedUsers &
  StorePlace &
  StoreComment &
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
type RetrievePlaces = RetrieveValueFunc<LocalStorageKeys.Places, PlaceDto[]>;
type RetrieveComments = RetrieveValueFunc<
  LocalStorageKeys.Comments,
  CommentDto[]
>;
type RetrieveNotifications = RetrieveValueFunc<
  LocalStorageKeys.Notifications,
  NotificationDto[]
>;

export type RetrieveValue = RetrieveUsers &
  RetrieveLoggedUsers &
  RetrievePlaces &
  RetrieveComments &
  RetrieveNotifications;

// export const retrieveValue: RetrieveValue = (key) => {
//   try {
//     const data = localStorage.getItem(key);
//     if (data) {
//       return JSON.parse(data);
//     } else {
//       throw new Error("Can not find this key in local storage");
//     }
//     // return JSON.parse(localStorage.getItem(key) || "null");
//   } catch {
//     return null;
//   }
// };
