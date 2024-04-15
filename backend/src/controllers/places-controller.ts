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

export const getPlacePictureUrl = (id: any) => {
  return `places/place-picture/${id}`;
};

export const getPlaces: RequestHandler = async (req, res, next) => {
  const places = await Place.find().exec();
  res.json({ places });
};
