import { check } from "express-validator";
import routerAuth from "../lib/router-auth";
import {
  getUsers,
  signup,
  login,
  logout,
  editUserInfo,
  changeProfilePicture,
  getUserProfilePicture,
  changePassword,
  changeUsername,
} from "../controllers/users-controller";

const usersRouter = routerAuth();

usersRouter.get("/", getUsers);

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

usersRouter.postAuth("/editUserInfo", editUserInfo);

usersRouter.postAuth("/changeProfilePicture", changeProfilePicture);

usersRouter.get("/profile-picture/:uid", getUserProfilePicture);

usersRouter.postAuth("/changePassword", changePassword);

usersRouter.postAuth("/changeUsername", changeUsername);

export default usersRouter;
