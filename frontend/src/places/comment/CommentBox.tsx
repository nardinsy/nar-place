import { useEffect } from "react";
import CommentInput from "./CommentInput";
import CommetnsList from "./CommentsList";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import useRequiredCommentContext from "../../hooks/use-required-commentContext";
import classes from "./Comment.module.css";

const CommentBox = ({ placeId }: { placeId: string }) => {
  const authContext = useRequiredAuthContext();
  const commentContext = useRequiredCommentContext();

  useEffect(() => {
    commentContext.getCommetns(placeId);
    return () => {};
  }, [placeId]);

  return (
    <div>
      <h3 style={{ paddingLeft: "0.5rem" }}>Comments</h3>
      <CommetnsList comments={commentContext.comments} />

      <div className={classes["comment-scope"]}>
        {authContext.isLoggedin && <CommentInput placeId={placeId} />}
      </div>
    </div>
  );
};

export default CommentBox;
