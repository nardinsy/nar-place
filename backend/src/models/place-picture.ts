import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

export interface IPlacePicture {
  image: {
    data: Buffer;
    contentType: string;
  };
  placeId: { type: string };
}

const placePictureSchema = new Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
  placeId: { type: String },
});

const PlacePicture = mongoose.model("PlacePicture", placePictureSchema);
export default PlacePicture;
