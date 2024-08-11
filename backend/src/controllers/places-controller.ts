import { Response, NextFunction, RequestHandler } from "express";
import { validationResult } from "express-validator";
import { Types } from "mongoose";
import { AuthRequestHandler } from "../lib/auth";
import createHttpError from "../models/createHttpError";
import User, { IUser } from "../models/user";
import Place, { IPlace } from "../models/place";
import PlacePicture, { IPlacePicture } from "../models/place-picture";
import PostComment, { IPostComment } from "../models/comment";
import CommentLike from "../models/comment-like";
import getCoordsForAddress from "../util/location";
import contentTypeBufferSplit from "../helpers/data-url";
import {
  CommentDto,
  CommentLikeDto,
  CommentReplyDto,
  NewComment,
  NewPlace,
  PlaceDto,
} from "../shared/dtos";
import { getProfilePictureUrl } from "./users-controller";

export const getPlacePictureUrl = (id: string) => {
  return `places/place-picture/${id}`;
};

export const getPlaces: RequestHandler = async (req, res, next) => {
  const places = await Place.find().exec();

  const placesDto = places.map((place) => {
    return new PlaceDto(
      place.title,
      place.description,
      place.address,
      place.picture,
      place._id,
      place.creator,
      getPlacePictureUrl(place.picture.toHexString())
    );
  });
  res.json({ places: placesDto });
};

export const getLoggedUserPlaces: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  //authed user places
  const placesId = user.places.map((place) => {
    // const userPlace = await Place.findById(placeId);
    return place._id.toHexString();
  });

  const places: IPlace[] = [];

  for (let i = 0; i < user.places.length; i++) {
    const id = placesId[i];
    const u = await Place.findById(id);
    if (u !== null) {
      places.push(u);
    }
  }
  // places = places.filter((place) => place !== null);

  const placesWithPictureUrl = places.map((place) => {
    // const placepictureId = place.picture.toHexString();
    return new PlaceDto(
      place.title,
      place.description,
      place.address,
      place.picture,
      place._id,
      place.creator,
      getPlacePictureUrl(place.picture.toHexString())
    );
  });

  res.json({
    places: placesWithPictureUrl,
  });
};

export const addPlace: AuthRequestHandler = async (user, req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const { title, description, address, picture }: NewPlace = req.body;

  const coordinates: { lat: number; lng: number } =
    getCoordsForAddress(address);

  const { contentType, buffer } = contentTypeBufferSplit(picture);

  const newPlace = new Place({
    title,
    description,
    address,
    location: coordinates,
    creator: user._id,
  });

  const placePicture = new PlacePicture({
    image: {
      data: buffer,
      contentType,
    },
    placeId: newPlace.id,
  });

  newPlace.picture = placePicture._id;

  try {
    await newPlace.save();
    user.places.push(newPlace._id);
    await user.save();
  } catch (error) {
    return next(
      createHttpError(`Creating place failed, please try again. ${error}`, 500)
    );
  }

  try {
    await placePicture.save();
  } catch (error) {
    console.log(error);
  }

  const placeDto = new PlaceDto(
    newPlace.title,
    newPlace.description,
    newPlace.address,
    placePicture._id,
    newPlace.id,
    user.id,
    getPlacePictureUrl(placePicture._id.toHexString())
  );

  res.status(201).json({
    place: placeDto,
  });
};

export const editPlaceById: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const {
    title,
    description,
    address,
    id,
  }: {
    title: string;
    description: string;
    address: string;
    id: string;
  } = req.body;

  // db.places.find({ _id: new ObjectId("65d5ef04ff5588f10abe77cb") });

  let place: IPlace | null;

  try {
    place = await Place.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!place) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }

    if (checkPlaceBelongsToUser(place, user)) {
      place.title = title;
      place.description = description;
      place.address = address;
    } else {
      return res.status(401).json({
        message: "unauthorize",
      });
    }
  } catch (err) {
    return next(
      createHttpError("Something went wrong, could not update place 1.", 500)
    );
  }

  try {
    await place.save();
  } catch (err) {
    // return next(
    //   createHttpError("Something went wrong, could not update place 2.", 500)
    // );
    console.log(err);
  }

  const placeDto = new PlaceDto(
    place.title,
    place.description,
    place.address,
    place.picture,
    place.id,
    user.id,
    getPlacePictureUrl(place.picture._id.toHexString())
  );

  res.status(200).json({ place: placeDto });
};

export const deletePlaceById: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const id: string = req.params.pid;

  let place: IPlace | null;
  try {
    place = await Place.findOne({
      _id: new Types.ObjectId(id),
    });

    if (!place) {
      return next(
        createHttpError("Something went wrong, could not find place.", 500)
      );
    }

    if (checkPlaceBelongsToUser(place, user)) {
      let filteredPlace = user.places.filter(
        (place) => place._id.toHexString() !== id
      );

      user.places = filteredPlace;
      await user.save();

      //-- delete image from place pictures
      const pictureId = place.picture.toHexString();
      await PlacePicture.findByIdAndDelete(pictureId);
      //--

      await Place.findByIdAndDelete(id);
    } else {
      return res.status(401).json({
        message: "unauthorize",
      });
    }
  } catch (error) {
    return next(createHttpError(error, 500));
  }

  res.status(200).json({ message: "Place removed successfully." });
};

export const getAnyUserPlacesByUserId: RequestHandler = async (
  req,
  res,
  next
) => {
  const acountId: string = req.params.uid;
  const user: IUser | null = await User.findById(acountId);

  if (!user) {
    return next(
      createHttpError(
        "Something went wrong, could not find user with given id.",
        500
      )
    );
  }

  const placesId = user.places.map((place) => {
    return place._id.toHexString();
  });

  const places: IPlace[] = [];

  for (const id of placesId) {
    const place = await Place.findById(id);
    if (place) {
      places.push(place);
    }
  }

  const placesDto = places.map((place) => {
    return new PlaceDto(
      place.title,
      place.description,
      place.address,
      place.picture,
      place._id,
      place.creator,
      getPlacePictureUrl(place.picture.toHexString())
    );
  });

  res.json({
    mesaage: "Get some users place successfully",
    places: placesDto,
  });
};

export const getPlacePictureByUrl: RequestHandler = async (req, res, next) => {
  // id -> place picture id
  const placePictureId: string = req.params.id;

  let placePicture: IPlacePicture | null;
  try {
    placePicture = await PlacePicture.findOne({
      _id: placePictureId,
    });
    // console.log(placePicture._id);
  } catch (error) {
    console.log(error);
    return next(
      createHttpError(
        "Something went wrong, could not find place's picture.",
        500
      )
    );
  }

  if (!placePicture) {
    res.status(404).end();
  } else {
    res.set("Content-Type", placePicture.image.contentType);
    res.send(placePicture.image.data);
  }
};

const checkPlaceBelongsToUser = (place: IPlace, user: IUser) => {
  const userId = user.id;
  const placeCreatorId = place.creator.toHexString();

  return placeCreatorId === userId ? true : false;
};

//Comments

export const addComment: AuthRequestHandler = async (user, req, res, next) => {
  const errors = validationResult(req.body.newComment);
  if (!errors.isEmpty()) {
    const error = createHttpError(
      "Invalid input passed, please check your data.",
      422
    );
    return next(error);
  }

  const { text, date, postID }: NewComment = req.body.newComment;
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
