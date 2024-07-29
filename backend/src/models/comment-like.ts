import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";

export interface ICommentLike extends mongoose.Document {
  userId: Types.ObjectId;
  postId: Types.ObjectId;
  commentId: Types.ObjectId;
  date: Date;
  _id: Types.ObjectId;
}

const commentLikeSchema = new Schema<ICommentLike>({
  userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
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
commentLikeSchema.index({ userId: 1, commnetId: 1 }, { unique: true });

const CommentLike = model<ICommentLike>("CommentLike", commentLikeSchema);
export default CommentLike;
