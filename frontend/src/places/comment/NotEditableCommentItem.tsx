import { FC } from "react";
import { CommentDto } from "../../helpers/dtos";
import CommentItem from "./CommentItem";
import classes from "./CommentItem.module.css";

type CommentItemT = {
  commentDto: CommentDto;
};

const NotEditableCommentItem: FC<CommentItemT> = ({ commentDto }) => {
  const { text } = commentDto;

  const commentText = text.split("\n").map((item, index) => {
    return (
      <span key={index}>
        {item}
        <br />
      </span>
    );
  });

  return (
    <CommentItem commentDto={commentDto}>
      <div className={classes["comment-text"]}>{commentText}</div>
    </CommentItem>
  );
};

export default NotEditableCommentItem;
