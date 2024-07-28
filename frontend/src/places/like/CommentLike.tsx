import { MouseEvent, FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart } from "@fortawesome/free-solid-svg-icons";
import useRequiredCommentContext from "../../hooks/use-required-commentContext";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { CommentDto, NewLikeComment } from "../../helpers/dtos";
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

  const likeCommentHandler = async (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    const newLikeComment: NewLikeComment = {
      liker: commentDto.writer.userId,
      postId: commentDto.postID,
      commentId: commentDto.id,
      date: new Date(),
    };

    const commentLike = await commentCtx.likeComment(newLikeComment);
    setCommentLikeNumber((pre) => pre + 1);
  };

  return (
    <div onClick={likeCommentHandler}>
      <FontAwesomeIcon icon={faHeart} className={classes["heart-button"]} />
      <span className={classes["likes-number"]}>
        {commentLikeNumber ? commentLikeNumber : ""}
      </span>
    </div>
  );
};

export default CommentLike;
