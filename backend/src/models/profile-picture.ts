import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface IProfilePicture extends mongoose.Document {
  image: {
    data: Buffer;
    contentType: string;
  };
  userId: string;
}

const pictureSchema = new Schema<IProfilePicture>({
  image: {
    data: Buffer,
    contentType: String,
  },
  userId: { type: String },
});

const ProfilePicture = model<IProfilePicture>("Picture", pictureSchema);
export default ProfilePicture;
