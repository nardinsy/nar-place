import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface IPlace extends mongoose.Document {
  title: string;
  description: string;
  address: string;
  picture: Types.ObjectId;
  location: { lat: number; lng: number };
  creator: Types.ObjectId;
  comments: Types.ObjectId[];
  _id: Types.ObjectId;
}

const placeSchema = new Schema<IPlace>({
  title: { type: String, required: true },
  description: { type: String, required: true },
  address: { type: String, required: true },
  picture: { type: Schema.Types.ObjectId, ref: "PlacePicture" },
  location: {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  creator: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "PostComment",
    },
  ],

  // creator: { type: String, required: true, ref: "User" },
});

const Place = model<IPlace>("Place", placeSchema);
export default Place;
