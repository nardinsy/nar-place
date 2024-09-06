import { IUserNotification } from "../models/notification";
import { UserDto } from "./dtos";

export class LoginResult {
  public readonly message = "User logged in successfully";
  constructor(public readonly token: string, public readonly user: UserDto) {}
}
