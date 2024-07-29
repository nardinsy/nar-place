import { MouseEvent, FC, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import useRequiredCommentContext from "../../hooks/use-required-commentContext";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { CommentDto, CommentLikeDto, NewLikeComment } from "../../helpers/dtos";
import classes from "./Commentlike.module.css";

type CommentLikeT = {
  commentDto: CommentDto;
};

const CommentLike: FC<CommentLikeT> = ({ commentDto }) => {
  const authCtx = useRequiredAuthContext();
  const commentCtx = useRequiredCommentContext();

  const [commentLikeNumber, setCommentLikeNumber] = useState(
    commentDto.likes.length
  );
  const [userLikedComment, setUserLikedComment] = useState(false);

  useEffect(() => {
    const setInitialHeartIconColor = () => {
      if (checkIfUserLikesComment()) {
        setUserLikedComment(true);
      } else {
        setUserLikedComment(false);
      }
    };

    setInitialHeartIconColor();
  }, [commentDto]);

  const likeCommentHandler = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    if (!authCtx.isLoggedin) {
      throw new Error("Please login first, then you can like comments");
    }
    const userCanLikeComment = checkIfUserLikesComment();
    userCanLikeComment ? unlikeCommetn() : likeCommetn();
  };

  const likeCommetn = async () => {
    if (!authCtx.isLoggedin) {
      throw new Error("Please login first, then you can like comments");
    }

    const newLikeComment: NewLikeComment = {
      userId: commentDto.writer.userId,
      postId: commentDto.postID,
      commentId: commentDto.id,
      date: new Date(),
    };

    const commentLike = await commentCtx.likeComment(newLikeComment);

    commentDto.likes.unshift({
      userId: authCtx.userId,
      commentId: commentDto.id,
    });

    setUserLikedComment(true);
    setCommentLikeNumber((pre) => pre + 1);
  };

  const unlikeCommetn = async () => {
    const unlikeComment: CommentLikeDto = {
      likeId: "",
      userId: commentDto.writer.userId,
      postId: commentDto.postID,
      commentId: commentDto.id,
      date: new Date(),
    };

    const commentLike = await commentCtx.unlikeComment(
      commentDto.id,
      commentDto.writer.userId
    );

    commentDto.likes = commentDto.likes.filter(
      (like) => like.userId !== commentDto.writer.userId
    );

    setUserLikedComment(false);
    setCommentLikeNumber((pre) => pre - 1);
  };

  const checkIfUserLikesComment = () => {
    if (!authCtx.isLoggedin) {
      throw new Error("Please login first, then you can like comments");
    }

    return commentDto.likes.find((like) => like.userId === authCtx.userId);
  };

  const heartIconClassName = userLikedComment ? `${classes["red-heart"]}` : "";

  return (
    <div onClick={likeCommentHandler}>
      <FontAwesomeIcon
        icon={faHeart}
        className={`${classes["heart-icon"]} ${heartIconClassName}`}
      />
      <span className={classes["likes-number"]}>
        {commentLikeNumber ? commentLikeNumber : ""}
      </span>
    </div>
  );
};

export default CommentLike;
