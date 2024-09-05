import jwt from "jsonwebtoken";
import privateKey from "../privateKey";
import { JwtData } from "../types/types";

export const verifyToken = (token: string): JwtData | undefined => {
  try {
    return jwt.verify(token, privateKey) as JwtData;

    // decodedToken: {
    //   userId: '65e08b9b240cdd0c6532a78c',
    //   email: 'f5@gmail.com',
    //   iat: 1709215028,
    //   exp: 1709218628
    // }
  } catch (error) {
    console.log(error);
    return undefined;
  }
};
