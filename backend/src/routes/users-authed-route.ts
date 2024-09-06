import { check } from "express-validator";
import routerAuth from "../lib/router-auth";
import {
  getAllUsers,
  signup,
  login,
  logout,
  changeProfilePicture,
  getUserProfilePicture,
  changePassword,
  changeUsername,
} from "../controllers/users-controller";

import {
  getNewNotifications,
  mergeAndResetNotifications,
  getCurrentNotifications,
} from "../controllers/users-notification-controller";

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
usersRouter.getAuth("/current-notifications", getCurrentNotifications);

usersRouter.getAuth("/new-notification", getNewNotifications);

usersRouter.getAuth("/update-notifications", mergeAndResetNotifications);
export default usersRouter;
