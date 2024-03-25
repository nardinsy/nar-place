const { Router } = require("express");
const { check } = require("express-validator");

const usersController = require("../controllers/users-controller");
const { authentication } = require("../authentication/getUserIfAuthenticate");

const router = Router();

router.get("/", usersController.getUsers);

router.post(
  "/signup",
  [
    check("name").not().isEmpty(),
    check("email").normalizeEmail().isEmail(),
    check("password").isLength({ min: 6 }),
  ],
  usersController.signup
);

router.post("/login", usersController.login);

// router.postAuth("/login", usersController.login);

module.exports = router;
