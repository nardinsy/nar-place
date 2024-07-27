import { FC } from "react";
import { CommentDto } from "../../helpers/dtos";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import EditableCommentItem from "./EditableCommentItem";
import NotEditableCommentItem from "./NotEditableCommentItem";
import classes from "./Comment.module.css";

type CommetnListT = {
  comments: CommentDto[];
};

const CommetnsList: FC<CommetnListT> = ({ comments }) => {
  const authContext = useRequiredAuthContext();

  if (comments.length === 0) {
    return <div style={{ paddingLeft: "0.8rem" }}>No comments yet!</div>;
  }

  const commentsList = comments.map((comment, index) => {
    if (
      authContext.isLoggedin &&
      authContext.userId === comment.writer.userId
    ) {
      return (
        <li key={index}>
          <EditableCommentItem commentDto={comment} key={index} />
        </li>
      );
    }
    return (
      <li key={index}>
        <NotEditableCommentItem commentDto={comment} key={index} />
      </li>
    );
  });

  return (
    <div>
      <ul className={classes["comments-list"]}>{commentsList}</ul>
    </div>
  );
};

export default CommetnsList;
