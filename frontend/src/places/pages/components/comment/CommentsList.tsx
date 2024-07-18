import { FC } from "react";
import CommentItem from "./CommentItem";
import { CommentDto } from "../../../../helpers/dtos";
import classes from "./Comment.module.css";

type CommetnListT = {
  comments: CommentDto[];
};

const CommetnsList: FC<CommetnListT> = ({ comments }) => {
  if (comments.length === 0) {
    return <div style={{ paddingLeft: "0.8rem" }}>No comments yet!</div>;
  }

  const commentsList = comments.map((comment, index) => {
    return <CommentItem commentDto={comment} key={index} />;
  });

  return (
    <div>
      <ul className={classes["comments-list"]}>{commentsList}</ul>
    </div>
  );
};

export default CommetnsList;
