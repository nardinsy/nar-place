import { Document } from "mongoose";

export interface JwtData {
  email: string;
  password: string;
}

export interface ResponsePlace {
  id: string;
  title: string;
  description: string;
  address: string;
  location: { lat: number; lng: number };
  pictureUrl: string;
}

export type UserInfoType = {
  userId: string;
  username: string;
  placeCount: number;
  pictureUrl: string | undefined;
};
