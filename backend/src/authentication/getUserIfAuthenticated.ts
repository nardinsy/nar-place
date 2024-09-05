import { Response } from "express";
import User, { IUser } from "../models/user";
import { verifyToken } from "./auth";

const getUserIfAuthenticated = async (
  token: any,
  res: Response
): Promise<IUser | undefined> => {
  const decodedToken = verifyToken(token);

  if (!decodedToken) {
    res.json({ message: "Invalid token, please try again" });
    return undefined;
  }

  const user = await User.findOne({ email: decodedToken.email });
  // const user = await User.findOne({ email: "nardin@gmail.com" });

  return user ? (user as IUser) : undefined;
};

export default getUserIfAuthenticated;
