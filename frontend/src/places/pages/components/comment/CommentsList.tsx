import { FC } from "react";
import CommentItem from "./CommentItem";
import { CommentDto } from "../../../../helpers/dtos";
import classes from "./Comment.module.css";
import useRequiredAuthContext from "../../../../hooks/use-required-authContext";
import EditableCommentItem from "./EditableCommentItem";

type CommetnListT = {
  comments: CommentDto[];
  onEdit: (editedComment: CommentDto, id: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

const CommetnsList: FC<CommetnListT> = ({ comments, onEdit, onDelete }) => {
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
          <EditableCommentItem
            commentDto={comment}
            key={index}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        </li>
      );
    }
    return (
      <li key={index}>
        <CommentItem commentDto={comment} key={index} />
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
