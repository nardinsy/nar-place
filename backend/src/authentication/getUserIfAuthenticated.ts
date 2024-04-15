import { Response } from "express";
import jwt from "jsonwebtoken";
import User from "../models/user";
import privateKey from "../privateKey";
import { JwtData } from "../types/types";
import { IUser } from "../models/user";

const getUserIfAuthenticated = async (
  token: any,
  res: Response
): Promise<IUser | undefined> => {
  let decodedToken: JwtData;

  try {
    // decodedToken = jwt.verify(token, privateKey) as JwtData;
    // decodedToken: {
    //   userId: '65e08b9b240cdd0c6532a78c',
    //   email: 'f5@gmail.com',
    //   iat: 1709215028,
    //   exp: 1709218628
    // }
  } catch (error) {
    console.log(error);
    res.json({ message: "Invalid token, please try again" });
    return undefined;
  }

  // const user = await User.findOne({ email: decodedToken.email });
  const user = await User.findOne({ email: "nardin@gmail.com" });

  if (user) {
    return user as IUser;
  } else {
    return undefined;
  }
};

export default getUserIfAuthenticated;
