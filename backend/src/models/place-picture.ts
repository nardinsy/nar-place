import mongoose from "mongoose";
import { Model, Schema } from "mongoose";

const placePictureSchema = new Schema({
  image: {
    data: Buffer,
    contentType: String,
  },
  placeId: { type: String },
});

const PlacePicture = mongoose.model("PlacePicture", placePictureSchema);
export default PlacePicture;
