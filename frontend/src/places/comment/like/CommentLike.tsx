import { MouseEvent, FC, useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import useRequiredCommentContext from "../../../hooks/use-required-commentContext";
import { CommentDto, CommentLikeDto } from "../../../helpers/dtos";
import classes from "./Commentlike.module.css";

type CommentLikeT = {
  commentDto: CommentDto;
  loggedUserUserId: string;
};

const CommentLike: FC<CommentLikeT> = ({ commentDto, loggedUserUserId }) => {
  const commentCtx = useRequiredCommentContext();

  const [commentLikeNumber, setCommentLikeNumber] = useState(
    commentDto.likes.length
  );
  const [userLikedComment, setUserLikedComment] = useState(false);

  useEffect(() => {
    const setInitialHeartIconColor = () => {
      if (checkIfUserLikedComment()) {
        setUserLikedComment(true);
      } else {
        setUserLikedComment(false);
      }
    };

    setInitialHeartIconColor();
  }, []);

  const likeCommentClickHandler = async (event: MouseEvent<SVGSVGElement>) => {
    event.preventDefault();

    if (checkIfUserLikedComment()) {
      await unlikeCommetn();
    } else {
      await likeCommetn();
    }
  };

  const likeCommetn = async () => {
    const newCommentLike: CommentLikeDto = {
      userId: loggedUserUserId,
      commentId: commentDto.id,
      date: new Date(),
    };

    await commentCtx.likeComment(newCommentLike);

    // commentDto.likes.unshift({
    //   userId: loggedUserUserId,
    //   commentId: commentDto.id,
    // });

    setUserLikedComment(true);
    setCommentLikeNumber((pre) => pre + 1);
  };

  const unlikeCommetn = async () => {
    await commentCtx.unlikeComment(loggedUserUserId, commentDto.id);

    // commentDto.likes = commentDto.likes.filter(
    //   (like) => like.userId !== loggedUserUserId
    // );

    setUserLikedComment(false);
    setCommentLikeNumber((pre) => pre - 1);
  };

  const checkIfUserLikedComment = () => {
    return commentDto.likes.find((like) => like.userId === loggedUserUserId);
  };

  const heartIconClassName = userLikedComment ? `${classes["red-heart"]}` : "";

  return (
    <button className={classes["container"]}>
      <FontAwesomeIcon
        onClick={likeCommentClickHandler}
        icon={faHeart}
        className={`${classes["heart-icon"]} ${heartIconClassName}`}
      />
      <span className={classes["likes-number"]}>
        {commentLikeNumber ? commentLikeNumber : ""}
      </span>
    </button>
  );
};

export default CommentLike;
