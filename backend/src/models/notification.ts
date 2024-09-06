import mongoose from "mongoose";
import { model, Schema, Types } from "mongoose";
import { CommentAction } from "../shared/dtos";

export interface IUserNotification extends mongoose.Document {
  _id: Types.ObjectId;
  kind: "Comment" | "Follow";
  from: {
    userId: string;
    username: string;
    pictureUrl: string | undefined;
    placeCount?: number;
  };
  commentContent: {
    placeId: string;
    commentId: string;
    action: CommentAction;
  };
}

const userNotificationSchema = new Schema<IUserNotification>({
  kind: String,
  from: {
    userId: String,
    username: String,
    pictureUrl: String,
    placeCount: String,
  },
  commentContent: {
    placeId: String,
    commentId: String,
    action: String,
  },
});

const UserNotification = model<IUserNotification>(
  "UserNotification",
  userNotificationSchema
);
export default UserNotification;
