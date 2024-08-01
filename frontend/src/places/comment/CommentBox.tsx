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
    const getComments = async () => {
      await commentContext.getCommetns(placeId);
    };
    getComments();
    return () => {};
  }, [placeId]);

  return (
    <div>
      <h3 style={{ paddingLeft: "0.5rem" }}>Comments</h3>
      <div className={classes["commentList-container"]}>
        <CommetnsList comments={commentContext.comments} />
      </div>

      <div className={classes["comment-scope"]}>
        {authContext.isLoggedin && <CommentInput placeId={placeId} />}
      </div>
    </div>
  );
};

export default CommentBox;
