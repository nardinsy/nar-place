const routerAuth = require("../lib/router-auth");
const { check } = require("express-validator");
const { validationResult } = require("express-validator");
// const upload = require("../helpers/uploadMiddleware");

const { createHttpError } = require("../models/createHttpError");

const usersController = require("../controllers/users-controller");

const router = routerAuth();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("username").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

router.getAuth("/logout", usersController.logout);

router.postAuth("/editUserInfo", usersController.editUserInfo);

router.postAuth("/changeProfilePicture", usersController.changeProfilePicture);

router.get("/profile-picture/:uid", usersController.getUserProfilePicture);

router.postAuth("/changePassword", usersController.changePassword);

router.postAuth("/changeUsername", usersController.changeUsername);

module.exports = router;
