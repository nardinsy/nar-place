import { FC } from "react";
import { CommentDto } from "../../../helpers/dtos";
import CommentReplyTextarea from "./CommentReplyTextarea";
import CommentReplies from "./CommentReplies";
import useRequiredAuthContext from "../../../hooks/use-required-authContext";
import classes from "../CommentItem.module.css";

type ReplyT = {
  commentDto: CommentDto;
  closeReplyTextarea: () => void;
  showReplyTextarea: boolean;
};

const Reply: FC<ReplyT> = ({
  commentDto,
  showReplyTextarea,
  closeReplyTextarea,
}) => {
  const authCtx = useRequiredAuthContext();

  return (
    <>
      {authCtx.isLoggedin && showReplyTextarea && (
        <div className={classes["reply-textarea"]}>
          <CommentReplyTextarea
            commentDto={commentDto}
            closeReplyTextarea={closeReplyTextarea}
            loggedUserUserId={authCtx.userId}
          />
        </div>
      )}

      <CommentReplies replies={commentDto.replies} />
    </>
  );
};

export default Reply;
