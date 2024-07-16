import { FC } from "react";
import CommentItem from "./CommentItem";
import { CommentDto } from "../../../../helpers/dtos";
import classes from "./Comment.module.css";

type CommetnListT = {
  comments: CommentDto[];
};

const CommetnsList: FC<CommetnListT> = ({ comments }) => {
  const commentsList = comments.map((comment, index) => {
    return <CommentItem commentDto={comment} key={index} />;
  });
  return <ul className={classes["comments-list"]}>{commentsList}</ul>;
};

export default CommetnsList;
