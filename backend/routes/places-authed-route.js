const routerAuth = require("../lib/router-auth");
const { check } = require("express-validator");

const placesControllers = require("../controllers/places-controller");

const router = routerAuth();

router.get("/", placesControllers.getPlaces);

router.getAuth("/userPlaces", placesControllers.getUserPlaces);

router.postAuth(
  "/addPlace",
  [
    check("title").not().isEmpty(),
    check("description").isLength({ min: 5 }),
    check("address").not().isEmpty(),
  ],
  placesControllers.addPlace
);

router.patchAuth(
  "/edit",
  [check("title").not().isEmpty(), check("description").isLength({ min: 5 })],
  placesControllers.editPlaceById
);

router.deleteAuth("/:pid", placesControllers.deletePlaceById);

router.get(
  "/placesByUserId/:uid",
  placesControllers.getOtherUserPlacesByUserId
);

router.get("/place-picture/:id", placesControllers.getPlacePictureByUrl);

module.exports = router;
