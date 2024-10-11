import { RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { AuthRequestHandler } from "../lib/auth";
import createHttpError from "../models/createHttpError";
import User, { IUser } from "../models/user";
import Place, { IPlace } from "../models/place";
import PlacePicture, { IPlacePicture } from "../models/place-picture";
import getCoordsForAddress from "../util/location";
import contentTypeBufferSplit from "../helpers/data-url";
import { NewPlace, PlaceDto, UserDto, UrlPath } from "../shared/dtos";
import { getProfilePictureUrl } from "./users-controller";

export const getPlacePictureUrl = (id: string) => {
  return `~places/place-picture/${id}`;
};

export const getPlaces: RequestHandler = async (req, res, next) => {
  const places = await Place.find().exec();

  const placesDtos = await Promise.all(
    places.map(async (place) => {
      const placePictureId: string = place.picture.toHexString();

      let placePictureUrl = "";
      let placePicture: IPlacePicture | null;
      try {
        placePicture = await PlacePicture.findOne({
          _id: placePictureId,
        });
      } catch (error) {
        console.log(error);
        return next(
          createHttpError(
            "Something went wrong, could not find place's picture.",
            500
          )
        );
      }

      if (!placePicture) {
        console.log("Can not find place picture");
      } else if (placePicture.image.kind === "File") {
        placePictureUrl = getPlacePictureUrl(place.picture.toHexString());
      } else if (placePicture.image.kind === "Url") {
        placePictureUrl = placePicture.image.path;
      }

      return new PlaceDto(
        place.title,
        place.description,
        place.address,
        place.picture,
        place._id,
        place.creator,
        placePictureUrl
      );
    })
  );

  res.json({ places: placesDtos });
};

export const getLoggedUserPlaces: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  //authed user places
  const placesId = user.places.map((place) => {
    // const userPlace = await Place.findById(placeId);
    return place._id.toHexString();
  });

  const places: IPlace[] = [];

  for (let i = 0; i < user.places.length; i++) {
    const id = placesId[i];
    const u = await Place.findById(id);
    if (u !== null) {
      places.push(u);
    }
  }
  // places = places.filter((place) => place !== null);

  const placesWithPictureUrl = await Promise.all(
    places.map(async (place) => {
      const placePictureId: string = place.picture.toHexString();

      let placePictureUrl = "";
      let placePicture: IPlacePicture | null;
      try {
        placePicture = await PlacePicture.findOne({
          _id: placePictureId,
        });
      } catch (error) {
        console.log(error);
        return next(
          createHttpError(
            "Something went wrong, could not find place's picture.",
            500
          )
        );
      }

      if (!placePicture) {
        console.log("Can not find place picture");
      } else if (placePicture.image.kind === "File") {
        placePictureUrl = getPlacePictureUrl(place.picture.toHexString());
      } else if (placePicture.image.kind === "Url") {
        placePictureUrl = placePicture.image.path;
      }

      return new PlaceDto(
        place.title,
        place.description,
        place.address,
        place.picture,
        place._id,
        place.creator,
        placePictureUrl
      );
    })
  );

  res.json({
    places: placesWithPictureUrl,
  });
};

export const addPlaceWithPictureTypeFile: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const { title, description, address, picture }: NewPlace = req.body;

  const coordinates: { lat: number; lng: number } =
    getCoordsForAddress(address);

  const { contentType, buffer } = contentTypeBufferSplit(picture);

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator: user._id,
  });

  const placePicture = new PlacePicture({
    image: {
      kind: "File",
      data: buffer,
      contentType,
    },
    placeId: newPlace.id,
  });

  newPlace.picture = placePicture._id;

  try {
    await newPlace.save();
    user.places.push(newPlace._id);
    await user.save();
  } catch (error) {
    return next(
      createHttpError(`Creating place failed, please try again. ${error}`, 500)
    );
  }

  try {
    await placePicture.save();
  } catch (error) {
    console.log(error);
  }

  const placeDto = new PlaceDto(
    newPlace.title,
    newPlace.description,
    newPlace.address,
    placePicture._id,
    newPlace.id,
    user.id,
    getPlacePictureUrl(placePicture._id.toHexString())
  );

  res.status(201).json({
    place: placeDto,
  });
};

export const addPlaceWithPictureTypeUrl: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const { title, description, address, picture }: NewPlace = req.body;

  const coordinates: { lat: number; lng: number } =
    getCoordsForAddress(address);

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator: user._id,
  });

  const placePicture = new PlacePicture({
    image: {
      kind: "Url",
      path: picture,
    },
    placeId: newPlace.id,
  });

  newPlace.picture = placePicture._id;

  try {
    await newPlace.save();
    user.places.push(newPlace._id);
    await user.save();
  } catch (error) {
    return next(
      createHttpError(`Creating place failed, please try again. ${error}`, 500)
    );
  }

  try {
    await placePicture.save();
  } catch (error) {
    console.log(error);
  }

  const placeDto = new PlaceDto(
    newPlace.title,
    newPlace.description,
    newPlace.address,
    placePicture._id,
    newPlace.id,
    user.id,
    getPlacePictureUrl(placePicture._id.toHexString())
  );

  res.status(201).json({
    place: placeDto,
  });
};

export const editPlaceById: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const {
    title,
    description,
    address,
    id,
  }: {
    title: string;
    description: string;
    address: string;
    id: string;
  } = req.body;

  // db.places.find({ _id: new ObjectId("65d5ef04ff5588f10abe77cb") });

  let place: IPlace | null;

  try {
    place = await Place.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!place) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }

    if (checkPlaceBelongsToUser(place, user)) {
      place.title = title;
      place.description = description;
      place.address = address;
    } else {
      return res.status(401).json({
        message: "unauthorize",
      });
    }
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could not update place 1.", 500)
    );
  }

  try {
    await place.save();
  } catch (err) {
    // return next(
    //   createHttpError("Something went wrong, could not update place 2.", 500)
    // );
    console.log(err);
  }

  const placeDto = new PlaceDto(
    place.title,
    place.description,
    place.address,
    place.picture,
    place.id,
    user.id,
    getPlacePictureUrl(place.picture._id.toHexString())
  );

  res.status(200).json({ place: placeDto });
};

export const deletePlaceById: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const id: string = req.params.pid;

  let place: IPlace | null;
  try {
    place = await Place.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!place) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }

    if (checkPlaceBelongsToUser(place, user)) {
      let filteredPlace = user.places.filter(
        (place) => place._id.toHexString() !== id
      );

      user.places = filteredPlace;
      await user.save();

      //-- delete image from place pictures
      const pictureId = place.picture.toHexString();
      await PlacePicture.findByIdAndDelete(pictureId);
      //--

      await Place.findByIdAndDelete(id);
    } else {
      return res.status(401).json({
        message: "unauthorize",
      });
    }
  } catch (error) {
    return next(createHttpError(error, 500));
  }

  res.status(200).json({ message: "Place removed successfully." });
};

export const getAnyUserPlacesByUserId: RequestHandler = async (
  req,
  res,
  next
) => {
  const acountId: string = req.params.uid;
  const user: IUser | null = await User.findById(acountId);

  if (!user) {
    return next(
      createHttpError(
        "Something went wrong, could not find user with given id.",
        500
      )
    );
  }

  const placesId = user.places.map((place) => {
    return place._id.toHexString();
  });

  const places: IPlace[] = [];

  for (const id of placesId) {
    const place = await Place.findById(id);
    if (place) {
      places.push(place);
    }
  }

  const placesDtos = await Promise.all(
    places.map(async (place) => {
      const placePictureId: string = place.picture.toHexString();

      let placePictureUrl = "";
      let placePicture: IPlacePicture | null;
      try {
        placePicture = await PlacePicture.findOne({
          _id: placePictureId,
        });
      } catch (error) {
        console.log(error);
        return next(
          createHttpError(
            "Something went wrong, could not find place's picture.",
            500
          )
        );
      }

      if (!placePicture) {
        console.log("Can not find place picture");
      } else if (placePicture.image.kind === "File") {
        placePictureUrl = getPlacePictureUrl(place.picture.toHexString());
      } else if (placePicture.image.kind === "Url") {
        placePictureUrl = placePicture.image.path;
      }

      return new PlaceDto(
        place.title,
        place.description,
        place.address,
        place.picture,
        place._id,
        place.creator,
        placePictureUrl
      );
    })
  );

  res.json({
    mesaage: "Get some users place successfully",
    places: placesDtos,
  });
};

export const getPlacePictureByUrl: RequestHandler = async (req, res, next) => {
  // id -> place picture id
  const placePictureId: string = req.params.id;

  let placePicture: IPlacePicture | null;
  try {
    placePicture = await PlacePicture.findOne({
      _id: placePictureId,
    });
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(
        "Something went wrong, could not find place's picture.",
        500
      )
    );
  }

  // if (!placePicture) {
  //   res.status(404).end();
  // } else {
  //   res.set("Content-Type", placePicture.image.contentType);
  //   res.send(placePicture.image.data);
  // }

  if (!placePicture) {
    res.status(404).end();
  } else if (placePicture.image.kind === "File") {
    res.set("Content-Type", placePicture.image.contentType);
    res.send(placePicture.image.data);
  }
};

const checkPlaceBelongsToUser = (place: IPlace, user: IUser) => {
  const userId = user.id;
  const placeCreatorId = place.creator.toHexString();

  return placeCreatorId === userId ? true : false;
};

export const getPlaceById: RequestHandler = async (req, res, next) => {
  const placeId: string = req.params.placeId;
  let place: IPlace | null;
  let user: IUser | null;

  try {
    place = await Place.findOne({
      _id: new Types.ObjectId(placeId),
    });

    if (!place) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could not find place 1.", 500)
    );
  }

  try {
    user = await User.findOne(place.creator);

    if (!user) {
      return next(
        createHttpError("Something went wrong, could not find user.", 500)
      );
    }
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could not find user 1.", 500)
    );
  }

  const placeDto = new PlaceDto(
    place.title,
    place.description,
    place.address,
    place.picture,
    place.id,
    place.creator,
    getPlacePictureUrl(place.picture._id.toHexString())
  );

  const userDto = new UserDto(
    user.id,
    user.username,
    user.picture ? getProfilePictureUrl(user.picture.toHexString()) : undefined,
    user.places.length
  );

  res.status(200).json({ placeDto, userDto });
};
