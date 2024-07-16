import { check } from "express-validator";
import routerAuth from "../lib/router-auth";
import {
  getPlaces,
  getLoggedUserPlaces,
  addPlace,
  editPlaceById,
  deletePlaceById,
  getAnyUserPlacesByUserId,
  getPlacePictureByUrl,
  addComment,
  getPlaceCommetns,
} from "../controllers/places-controller";

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

// placeRouter.get("/", getPlaces);

placeRouter.getAuth("/userPlaces", getLoggedUserPlaces);

placeRouter.postAuth(
  "/add-place",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  addPlace
);

placeRouter.patchAuth(
  "/edit-place",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  editPlaceById
);

placeRouter.deleteAuth("/delete-place/:pid", deletePlaceById);

placeRouter.get("/any-user-places-by-userId/:uid", getAnyUserPlacesByUserId);

placeRouter.get("/place-picture/:id", getPlacePictureByUrl);

placeRouter.postAuth(
  "/addComment",
  [check("text").not().isEmpty(), check("text").isLength({ max: 30 })],
  addComment
);

placeRouter.post("/getComments", getPlaceCommetns);

export default placeRouter;
