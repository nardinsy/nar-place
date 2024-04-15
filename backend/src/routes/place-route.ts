import { check } from "express-validator";
import routerAuth from "../lib/router-auth";
import { getPlaces } from "../controllers/places-controller";
import { Request, Response, NextFunction } from "express";
import { IUser } from "../models/user";

const placeRouter = routerAuth();
//test
// placeRouter.postAuth(
//   "/test3",
//   (user: IUser, req: Request, res: Response, next: NextFunction) => {
//     console.log("test from place router post ok");
//     console.log(user);
//     res.json({ message: "test from place router post ok", user });
//   }
// );
// placeRouter.postAuth(
//   "/test",
//   [check("title").not().isEmpty()],
//   (user: IUser, req: Request, res: Response, next: NextFunction) => {
//     console.log("test post ok");
//     res.json({ message: "Test check, check" });
//   }
// );
// placeRouter.get("/test", (req, res, next) => {
//   console.log("hello good morning");
//   res.json({ message: "test ok" });
// });

placeRouter.get("/", getPlaces);

export default placeRouter;
