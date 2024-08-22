import { check } from "express-validator";
import routerAuth from "../lib/router-auth";
import {
  getAllUsers,
  signup,
  login,
  logout,
  editUserInfo,
  changeProfilePicture,
  getUserProfilePicture,
  changePassword,
  changeUsername,
  getNewNotifications,
} from "../controllers/users-controller";

const usersRouter = routerAuth();

usersRouter.get("/", getAllUsers);

usersRouter.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  signup
);

usersRouter.post("/login", login);

usersRouter.getAuth("/logout", logout);

usersRouter.postAuth("/change/profile-picture", changeProfilePicture);

usersRouter.postAuth("/change/password", changePassword);

usersRouter.postAuth("/change/username", changeUsername);

usersRouter.get("/profile-picture/:uid", getUserProfilePicture);
// usersRouter.postAuth("/editUserInfo", editUserInfo);
usersRouter.getAuth("/new-notification", getNewNotifications);
export default usersRouter;
