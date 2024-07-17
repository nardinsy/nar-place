import { useState } from "react";
import CommentsBox from "./CommentsBox";
import CommentInput from "./CommentInput";
import useRequiredAuthContext from "../../../../hooks/use-required-authContext";
import classes from "./Comment.module.css";

const CommentInputAndBox = ({ placeId }: { placeId: string }) => {
  const authContext = useRequiredAuthContext();
  const [uploadedNewComment, setUploadedNewComment] = useState(false);

  return (
    <div>
      <CommentsBox
        placeId={placeId}
        uploadedNewComment={uploadedNewComment}
        onUpload={() => setUploadedNewComment(false)}
      />

      <div className={classes["comment-scope"]}>
        {authContext.isLoggedin && (
          <CommentInput
            placeId={placeId}
            onUpload={() => setUploadedNewComment(true)}
          />
        )}
      </div>
    </div>
  );
};

export default CommentInputAndBox;
