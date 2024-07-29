import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface IPostComment extends mongoose.Document {
  text: string;
  date: Date;
  postID: Types.ObjectId;
  writer: Types.ObjectId;
  likes: { userId: string; commentId: string }[];
  _id: Types.ObjectId;
}

const postCommentSchema = new Schema<IPostComment>({
  text: { type: String, required: true },
  date: {
    type: Date,
    default: Date.now,
  },
  postID: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "PlacePicture",
  },
  writer: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  likes: [
    {
      userId: { type: String },
      commentId: { type: String },
    },
  ],
});

const PostComment = model<IPostComment>("PostComment", postCommentSchema);
export default PostComment;
