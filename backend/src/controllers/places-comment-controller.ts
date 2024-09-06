import { Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { AuthRequestHandler } from "../lib/auth";
import createHttpError from "../models/createHttpError";
import User, { IUser } from "../models/user";
import Place, { IPlace } from "../models/place";
import PostComment, { IPostComment } from "../models/comment";
import CommentLike from "../models/comment-like";
import {
  CommentAction,
  CommentDto,
  CommentLikeDto,
  CommentReplyDto,
  NewComment,
  NotificationDto,
} from "../shared/dtos";
import { getProfilePictureUrl } from "./users-controller";
import UserNotification, { IUserNotification } from "../models/notification";
import { getWSServer } from "../services/web-socket";

export const addComment: AuthRequestHandler = async (user, req, res, next) => {
  const errors = validationResult(req.body.newComment);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const ws = getWSServer(req.app);

  const { text, date, postID }: NewComment = req.body.newComment;
  const commentActionTo: string = req.body.commentActionTo;

  const newComment = new PostComment({ text, date, postID, writer: user._id });

  try {
    await newComment.save();
  } catch (error) {
    return next(
      createHttpError(`Adding comment failed, please try again. ${error}`, 500)
    );
  }

  let place: IPlace | null;

  try {
    place = await Place.findOne({
      _id: new Types.ObjectId(postID),
    });

    if (!place) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }

    place.comments.unshift(newComment._id);
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could add comment.", 500)
    );
  }

  try {
    await place.save();
  } catch (err) {
    console.log(err);
  }

  const notificationDto = await addCommetnNotificationToUser(
    user,
    commentActionTo,
    postID,
    newComment._id.toHexString(),
    CommentAction.WriteComment
  );

  if (notificationDto) {
    ws.to(commentActionTo).emit("place-received-comment", notificationDto);
  }

  const commentDto = {
    id: newComment._id.toHexString(),
    text,
    date,
    postID,
    writer: {
      userId: user.id,
      username: user.username,
      pictureUrl: user.picture,
      placeCount: user.places.length,
    },
    likes: [],
    replies: [],
  };

  res.status(201).json({
    comment: commentDto,
  });
};

export const getPlaceCommetns: RequestHandler = async (req, res, next) => {
  const postID = req.body.placeID;
  let post: IPlace | null;

  try {
    post = await Place.findById(postID);
  } catch (error) {
    return next(createHttpError("Could not find place or Wrong place id", 401));
  }

  if (!post) {
    return next(createHttpError("Could not find place or Wrong place id", 401));
  }

  const comments = getCommentsById(post.comments);
  const commentsDto = await getcommnetsDto(await comments);

  res.status(200).json(commentsDto);
};

export const editComment: AuthRequestHandler = async (user, req, res, next) => {
  const errors = validationResult(req.body.editedComment);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const editedComment: CommentDto = req.body.editedComment;
  const commentId = editedComment.id;
  let comment: IPostComment | null;

  try {
    comment = await PostComment.findOne({
      _id: new Types.ObjectId(commentId),
    });
  } catch {
    return next(
      createHttpError("Something went wrong, could not find comment.", 500)
    );
  }

  if (!comment) {
    return next(
      createHttpError("Something went wrong, could not find comment.", 500)
    );
  }

  comment.text = editedComment.text;
  // comment.date = editedComment.date;

  try {
    await comment.save();
  } catch {
    return next(
      createHttpError("Something went wrong, could not update comment.", 500)
    );
  }

  res.status(201).json({
    comment,
  });
};

export const deleteParentComment = async (
  commentId: string,
  user: IUser,
  res: Response,
  next: NextFunction
) => {
  let comment: IPostComment | null;
  let place: IPlace | null;

  try {
    comment = await PostComment.findById(commentId);
  } catch {
    return next(
      createHttpError("Something went wrong, could not find comment.", 500)
    );
  }

  if (!comment) {
    return next(
      createHttpError("Something went wrong, could not find comment.", 500)
    );
  }

  if (!checkCommentBelongsToUser(comment, user)) {
    return res.status(401).json({
      message: "unauthorize",
    });
  }

  try {
    const postId = comment.postID;
    place = await Place.findById(postId.toHexString());
  } catch {
    return next(
      createHttpError(
        "Something went wrong, could not find comment's post.",
        500
      )
    );
  }

  if (!place) {
    return next(
      createHttpError("Something went wrong, could not find place.", 500)
    );
  }

  const newCommentsList = place.comments.filter(
    (comment) => comment._id.toHexString() !== commentId
  );

  place.comments = newCommentsList;

  try {
    await place.save();
  } catch {
    return next(
      createHttpError(
        "Something went wrong, could not save place comments.",
        500
      )
    );
  }
};

const deleteReplyComment = async (
  replyId: string,
  parentId: string,
  user: IUser,
  res: Response,
  next: NextFunction
) => {
  let parentComment: IPostComment | null;

  try {
    parentComment = await PostComment.findById(parentId);
  } catch {
    return next(
      createHttpError("Something went wrong, could not find comment.", 500)
    );
  }

  if (!parentComment) {
    return next(
      createHttpError("Something went wrong, could not find comment.", 500)
    );
  }

  // if (!checkCommentBelongsToUser(parentComment, user)) {
  //   return res.status(401).json({
  //     message: "unauthorize",
  //   });
  // }

  parentComment.replies = parentComment.replies.filter(
    (reply) => reply._id.toHexString() !== replyId
  );

  try {
    await parentComment.save();
  } catch {
    return next(
      createHttpError(
        "Something went wrong, could not save comment replies.",
        500
      )
    );
  }
};

export const deleteComment: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const { commentId, parentId } = req.body;
  if (parentId) {
    await deleteReplyComment(commentId, parentId, user, res, next);
  } else {
    await deleteParentComment(commentId, user, res, next);
  }

  try {
    await PostComment.findByIdAndDelete(commentId);
  } catch {
    return next(
      createHttpError("Something went wrong, could not delete comments.", 500)
    );
  }

  res.status(200).json({ message: "Comment removed successfully." });
};

const getCommentsById = async (commentsID: Types.ObjectId[]) => {
  // [new ObjectId('665463c07ffe177e8275f436'), ]
  const comments: IPostComment[] = [];

  for (const commentID of commentsID) {
    const u = await PostComment.findById(commentID._id.toHexString());
    if (u !== null) {
      comments.push(u);
    }
  }
  return comments;
};

const getCommentWriter = async (comment: IPostComment) => {
  const userThatWroteComment = await User.findById(
    comment.writer._id.toHexString()
  );

  if (userThatWroteComment) {
    return {
      userId: userThatWroteComment.id,
      username: userThatWroteComment.username,
      pictureUrl: userThatWroteComment.picture
        ? getProfilePictureUrl(userThatWroteComment.picture.toHexString())
        : undefined,
      placeCount: userThatWroteComment.places.length,
    };
  }
  throw new Error("Can not found comment writer");
};

const getcommnetsDto = async (comments: IPostComment[]) => {
  return await Promise.all(
    comments.map(async (comment) => {
      const writer = await getCommentWriter(comment);

      const commentDto: CommentDto = {
        id: comment._id.toHexString(),
        parentId: comment.parentId ? comment.parentId.toHexString() : undefined,
        text: comment.text,
        date: comment.date,
        postID: comment.postID,
        writer,
        likes: comment.likes,
        // replies: comment.replies
        replies: await getCommentsReplies(comment.replies),
      };
      return commentDto;
    })
  );
};

const getCommentsReplies = async (
  replies: Types.ObjectId[]
): Promise<CommentDto[]> => {
  return await Promise.all(
    replies.map(async (reply) => {
      let comment: IPostComment | null;

      try {
        comment = await PostComment.findOne(reply._id);

        if (!comment) {
          throw new Error("Something went wrong, could not find comment 1.");
        }
      } catch (err) {
        throw new Error("Something went wrong, could not find comment 2.");
      }

      const writer = await getCommentWriter(comment);

      const commentDto: CommentDto = {
        id: comment._id.toHexString(),
        parentId: comment.parentId.toHexString(),
        text: comment.text,
        date: comment.date,
        postID: comment.postID,
        writer,
        likes: comment.likes,
        replies: await getCommentsReplies(comment.replies),
      };
      return commentDto;
    })
  );
};

const checkCommentBelongsToUser = (comment: IPostComment, user: IUser) => {
  const userId = user.id;
  const commentId = comment.writer._id.toHexString();

  return commentId === userId ? true : false;
};

export const likeComment: AuthRequestHandler = async (user, req, res, next) => {
  const commentLike: CommentLikeDto = req.body.newCommentLike;
  const commentActionTo: string = req.body.commentActionTo;

  const ws = getWSServer(req.app);

  const { userId, commentId, date } = commentLike;

  const newCommentLike = new CommentLike({ userId, commentId, date });
  try {
    newCommentLike.save();
  } catch (error) {
    return next(
      createHttpError(`Liking comment failed, please try again. ${error}`, 500)
    );
  }

  // new like{
  //   liker: new ObjectId('66923931226ca70e0528d3c0'),
  //   postId: new ObjectId('65f700dae771ff3a4ddababd'),
  //   commentId: new ObjectId('66a1057c7bd9d0f21972fc12'),
  //   date: 2024-07-28T08:33:33.000Z,
  //   _id: new ObjectId('66a60312eaf92218eec861d7')
  // }

  let comment: IPostComment | null;

  try {
    comment = await PostComment.findOne({
      _id: new Types.ObjectId(commentId),
    });

    if (!comment) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }
    comment.likes.unshift({ userId, commentId });
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could add comment.", 500)
    );
  }

  try {
    comment.save();
    // comment => {
    //   _id: new ObjectId('66a1057c7bd9d0f21972fc12'),
    //   text: "It's gorgeousssses?",
    //   date: 2024-07-24T13:45:30.029Z,
    //   postID: new ObjectId('65f700dae771ff3a4ddababd'),
    //   writer: new ObjectId('65f70343ec6d2699d66e5bb7'),
    //   __v: 1,
    //   likes: [
    //     new ObjectId('66a62771b610b3006e767452'),
    //     new ObjectId('66a627bd29e6ccaf646a30fb')
    //   ]
    // }
  } catch (error) {
    return next(
      createHttpError(
        `Saving comment's like failed, please try again. ${error}`,
        500
      )
    );
  }

  comment.postID;

  // const notificationDto1 = await addCommetnNotificationToUser(
  //   user,
  //   commentActionTo,
  //   comment.postID.toHexString(),
  //   commentId,
  //   CommentAction.LikeComment
  // );

  // if (notificationDto1) {
  //   ws.to(commentActionTo).emit("", notificationDto1);
  // }

  const notificationDto = await addCommetnNotificationToUser(
    user,
    comment.writer.toHexString(),
    comment.postID.toHexString(),
    commentId,
    CommentAction.LikeComment
  );

  if (notificationDto) {
    ws.to(comment.writer.toHexString()).emit("comment-liked", notificationDto);
  }

  const commentLikeDto: CommentLikeDto = {
    userId: newCommentLike.userId.toHexString(),
    commentId: newCommentLike.commentId.toHexString(),
    date: commentLike.date,
  };

  res.status(201).json({
    commentLikeDto,
  });
};

export const unlikeComment: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const { commentId, userId } = req.body;

  let comment: IPostComment | null;

  try {
    comment = await PostComment.findOne({
      _id: new Types.ObjectId(commentId),
    });

    if (!comment) {
      return next(
        createHttpError("Something went wrong, could not find comment.", 500)
      );
    }
    comment.likes = comment.likes.filter((like) => like.userId !== userId);
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could add comment.", 500)
    );
  }

  try {
    comment.save();
  } catch (error) {
    return next(
      createHttpError(
        `Saving comment's like failed, please try again. ${error}`,
        500
      )
    );
  }

  res.status(201).json({
    commentLikes: comment.likes,
  });
};

export const replyComment: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const commentReply: CommentReplyDto = req.body.commentReply;
  const commentActionTo: string = req.body.commentActionTo;

  const ws = getWSServer(req.app);

  const { parentId, date, text, userId, postId } = commentReply;

  const newReplyToComment = new PostComment({
    text,
    date,
    postID: postId,
    writer: userId,
    parentId,
  });

  try {
    await newReplyToComment.save();
  } catch (error) {
    return next(
      createHttpError(
        `Adding reply to comment failed, please try again. ${error}`,
        500
      )
    );
  }

  let parentComment: IPostComment | null;

  try {
    parentComment = await PostComment.findOne({
      _id: new Types.ObjectId(parentId),
    });

    if (!parentComment) {
      return next(
        createHttpError(
          "Something went wrong, could not find parent comment.",
          500
        )
      );
    }
    parentComment.replies.unshift(newReplyToComment._id);
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could add reply to comment.", 500)
    );
  }

  try {
    parentComment.save();
  } catch (error) {
    return next(
      createHttpError(
        `Saving comment's reply failed, please try again. ${error}`,
        500
      )
    );
  }

  // await addCommetnNotificationToUser(
  //   user,
  //   commentActionTo,
  //   postId,
  //   newReplyToComment._id.toHexString(),
  //   CommentAction.ReplyComment
  // );

  const notificationDto = await addCommetnNotificationToUser(
    user,
    parentComment.writer.toHexString(),
    postId,
    newReplyToComment._id.toHexString(),
    CommentAction.ReplyComment
  );

  if (notificationDto) {
    ws.to(parentComment.writer.toHexString()).emit(
      "comment-replied",
      notificationDto
    );
  }

  const replyCommentDto = {
    id: newReplyToComment._id.toHexString(),
    parentId,
    text,
    date,
    postID: postId,
    writer: {
      userId: user.id,
      username: user.username,
      pictureUrl: user.picture,
      placeCount: user.places.length,
    },
    likes: [],
    replies: [],
  };

  res.status(201).json({
    replyComment: replyCommentDto,
  });
};

// notification
const addCommetnNotificationToUser = async (
  from: IUser,
  to: string,
  placeId: string,
  commentId: string,
  action: CommentAction
) => {
  if (from.id === to) return;

  const fromUser = {
    userId: from.id,
    username: from.username,
    pictureUrl: from.picture
      ? getProfilePictureUrl(from.picture.toHexString())
      : undefined,
    placeCount: from.places.length,
  };
  const commentContent = {
    placeId,
    commentId,
    action,
  };

  const commentNotification: IUserNotification = new UserNotification({
    kind: "Comment",
    from: fromUser,
    commentContent,
  });

  try {
    await commentNotification.save();
  } catch (error) {
    throw new Error("Adding comment failed, please try again.");
  }

  let toUser: IUser | null;
  try {
    toUser = await User.findOne({
      _id: new Types.ObjectId(to),
    });

    if (!toUser) {
      throw new Error("Could't find user, please try again");
    }
  } catch (err) {
    throw new Error("Could't find user, please try again");
  }

  toUser.newNotifications.unshift(commentNotification._id);

  try {
    await toUser.save();
  } catch (error) {
    throw new Error("Updating user notification failed, please try again.");
  }

  const notificationDto: NotificationDto = {
    kind: commentNotification.kind,
    commentContent: commentNotification.commentContent,
    from: commentNotification.from,
  };

  return notificationDto;
};
