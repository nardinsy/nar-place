import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface ICommentLike extends mongoose.Document {
  liker: Types.ObjectId;
  postId: Types.ObjectId;
  commentId: Types.ObjectId;
  date: Date;
  _id: Types.ObjectId;
}

const commentLikeSchema = new Schema<ICommentLike>({
  liker: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  postId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "Place",
  },
  commentId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "PostComment",
  },

  date: {
    type: Date,
    default: Date.now,
    required: true,
  },
});

const CommentLike = model<ICommentLike>("CommentLike", commentLikeSchema);
export default CommentLike;
