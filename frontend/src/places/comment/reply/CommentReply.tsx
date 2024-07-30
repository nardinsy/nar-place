import { FC } from "react";
import { CommentDto, CommentReplyDto } from "../../../helpers/dtos";
import Textare from "../textarea/Textarea";
import useRequiredCommentContext from "../../../hooks/use-required-commentContext";
import classes from "./CommentReply.module.css";

type CommentReplyT = {
  commentDto: CommentDto;
  disableReplyMode: () => {};
  loggedUserUserId: string;
};

const CommentReply: FC<CommentReplyT> = ({
  commentDto,
  disableReplyMode,
  loggedUserUserId,
}) => {
  const commentCtx = useRequiredCommentContext();

  const submitReplyToComment = async (text: string) => {
    const commentReply: CommentReplyDto = {
      commentId: commentDto.id,
      date: new Date(),
      text,
      userId: loggedUserUserId,
    };

    await commentCtx.replyToComment(commentReply);
  };

  return (
    <Textare
      text={""}
      onCancel={disableReplyMode}
      onSubmit={submitReplyToComment}
    />
  );
};

export default CommentReply;
