import { FC } from "react";
import Comment from "./Comment";
import { CommentDto } from "../../../../helpers/dtos";
import classes from "./Comment.module.css";

type CommetnListT = {
  comments: CommentDto[];
};

const CommetnsList: FC<CommetnListT> = ({ comments }) => {
  const x = comments.map((comment, index) => {
    return <Comment commentDto={comment} key={index} />;
  });
  return <ul className={classes["comments"]}>{x}</ul>;
};

export default CommetnsList;
