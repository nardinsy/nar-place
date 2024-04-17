import { RequestHandler, Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { ObjectId } from "mongoose";

import createHttpError from "../models/createHttpError";
import getCoordsForAddress from "../util/location";

import User, { IUser } from "../models/user";
import Place, { IPlace } from "../models/place";

import contentTypeBufferSplit from "../helpers/data-url";
import PlacePicture from "../models/place-picture";
import getUserIfAuthenticated from "../authentication/getUserIfAuthenticated";
import { ResponsePlace } from "../types/types";

class MyPlaceClass extends Place {}

export const getPlacePictureUrl = (id: any) => {
  return `places/place-picture/${id}`;
};

export const getPlaces: RequestHandler = async (req, res, next) => {
  const places = await Place.find().exec();
  res.json({ places });
};

export const getUserPlaces = async (
  user: IUser,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  //authed user places
  const placesId = user.places.map((place) => {
    const placeId = place._id.toHexString();
    // const userPlace = await Place.findById(placeId);
    return placeId;
  });

  let places = [];

  for (let i = 0; i < user.places.length; i++) {
    const id = placesId[i];
    const u = await Place.findById(id);
    places.push(u);
  }

  places = places.filter((place) => place !== null);

  const placesWithImageUrl = places.map((place) => {
    if (place) {
      const placepictureId = place.image.toHexString();
      const editedPlace = {
        id: place.id,
        title: place.title,
        description: place.description,
        address: place.address,
        location: place.location,
        pictureUrl: getPlacePictureUrl(placepictureId),
      };
      return editedPlace;
    }
  });

  res.json({
    mesaage: "Get user's places successfully",
    places: placesWithImageUrl,
  });
};

export const addPlace = async (
  user: IUser,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const { title, description, address, image } = req.body;

  const coordinates: { lat: number; lng: number } =
    getCoordsForAddress(address);

  const { contentType, buffer } = contentTypeBufferSplit(image);

  const newPlace = new MyPlaceClass({
    title,
    description,
    address,
    location: coordinates,
    creator: user._id,
  });

  const placePicture = new PlacePicture({
    image: {
      data: buffer,
      contentType,
    },
    placeId: newPlace.id,
  });

  newPlace.image = placePicture._id;

  try {
    await newPlace.save();
    await user.places.push(newPlace._id);
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

  const placepictureId = placePicture._id.toHexString();

  res.status(201).json({
    message: "Created new place.",
    place: {
      id: newPlace.id,
      title: newPlace.title,
      description: newPlace.description,
      address: newPlace.address,
      location: newPlace.location,
      pictureUrl: getPlacePictureUrl(placepictureId),
    } as ResponsePlace,
  });
};

// export const editPlaceById = async (user, req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     const error = createHttpError(
//       "Invalid input passed, please check your data.",
//       422
//     );
//     return next(error);
//   }

//   const { title, description, address, id } = req.body;

//   // db.places.find({ _id: new ObjectId("65d5ef04ff5588f10abe77cb") });

//   let place;

//   try {
//     place = await Place.findOne({
//       _id: new ObjectId(id),
//     });

//     if (checkPlaceBelongsToUser(place, user)) {
//       place.title = title;
//       place.description = description;
//       place.address = address;
//     } else {
//       return res.status(401).json({
//         message: "unauthorize",
//       });
//     }
//   } catch (err) {
//     return next(
//       createHttpError("Something went wrong, could not update place 1.", 500)
//     );
//   }

//   try {
//     await place.save();
//   } catch (err) {
//     // return next(
//     //   createHttpError("Something went wrong, could not update place 2.", 500)
//     // );
//     console.log(err);
//   }

//   res.status(200).json({ message: "Plcas update successfully", place });
// };

// export const deletePlaceById = async (user, req, res, next) => {
//   const id = req.params.pid;

//   let place;
//   try {
//     place = await Place.findOne({
//       _id: new ObjectId(id),
//     });

//     if (checkPlaceBelongsToUser(place, user)) {
//       let filteredPlace;
//       filteredPlace = await user.places.filter(
//         (place) => place._id.toHexString() !== id
//       );

//       user.places = filteredPlace;
//       await user.save();

//       //-- delete image from place pictures
//       const imageId = place.image.toHexString();
//       await PlacePicture.findByIdAndDelete(imageId);
//       //--

//       await Place.findByIdAndDelete(id);
//     } else {
//       return res.status(401).json({
//         message: "unauthorize",
//       });
//     }
//   } catch (error) {
//     return next(createHttpError(error, 500));
//   }

//   res.status(200).json({ message: "Place removed successfully." });
// };

// export const checkPlaceBelongsToUser = (place, user) => {
//   const userId = user.id;
//   const placeCreatorId = place.creator.toHexString();

//   if (placeCreatorId === userId) {
//     return true;
//   } else {
//     return false;
//   }
// };

// export const getOtherUserPlacesByUserId = async (req, res, next) => {
//   const acountId = req.params.uid;
//   const result = await User.findById(acountId);

//   const userPlacesID = result.places;

//   const placesId = userPlacesID.map((place) => {
//     const placeId = place._id.toHexString();
//     return placeId;
//   });

//   let places = [];

//   for (let i = 0; i < userPlacesID.length; i++) {
//     const id = placesId[i];
//     const u = await Place.findById(id);
//     places.push(u);
//   }

//   places = places.filter((place) => place !== null);

//   places = places.filter((place) => place !== null);

//   const placesWithImageUrl = places.map((place) => {
//     const placepictureId = place.image.toHexString();
//     const editedPlace = {
//       id: place.id,
//       title: place.title,
//       description: place.description,
//       address: place.address,
//       location: place.location,
//       pictureUrl: getPlacePictureUrl(placepictureId),
//     };

//     return editedPlace;
//   });

//   // console.log(result);
//   res.json({
//     mesaage: "Get some users place successfully",
//     places: placesWithImageUrl,
//   });
// };

// export const getPlacePictureByUrl = async (req, res, next) => {
//   // id -> place picture id
//   const placePictureId = req.params.id;

//   let placePicture;
//   try {
//     placePicture = await PlacePicture.findOne({
//       _id: placePictureId,
//     });
//     // console.log(placePicture._id);
//   } catch (error) {
//     console.log(error);
//   }

//   if (!placePicture) {
//     res.status(404).end();
//   } else {
//     res.set("Content-Type", placePicture.image.contentType);
//     res.send(placePicture.image.data);
//   }
// };
