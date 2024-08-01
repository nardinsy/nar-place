import { FC } from "react";
import { CommentDto, CommentReplyDto } from "../../../helpers/dtos";
import Textare from "../textarea/Textarea";
import useRequiredCommentContext from "../../../hooks/use-required-commentContext";

type CommentReplyT = {
  commentDto: CommentDto;
  disableReplyMode: () => {};
  loggedUserUserId: string;
};

const CommentReplyTextarea: FC<CommentReplyT> = ({
  commentDto,
  disableReplyMode,
  loggedUserUserId,
}) => {
  const commentCtx = useRequiredCommentContext();

  const submitReplyToComment = async (text: string) => {
    const commentReply: CommentReplyDto = {
      parentId: commentDto.id,
      userId: loggedUserUserId,
      postId: commentDto.postID,
      text,
      date: new Date(),
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

export default CommentReplyTextarea;
