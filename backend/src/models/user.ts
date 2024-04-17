import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

// const { Schema } = mongoose;

export interface IUser extends mongoose.Document {
  username: string;
  email: string;
  password: string;
  places: Types.ObjectId[];
  picture: Types.ObjectId | null;
  _id: Types.ObjectId;
}

const userSchema = new Schema<IUser>({
  username: { type: String, required: true },
  email: { type: String, required: true },
  password: { type: String, required: true },
  places: [{ type: Schema.Types.ObjectId, required: true, ref: "Place" }],
  picture: { type: Schema.Types.ObjectId, ref: "Picture" },
});

const User = model<IUser>("User", userSchema);
export default User;
