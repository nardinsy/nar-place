import { createContext, useState, FC } from "react";
import { createRelativePath } from "../helpers/api-url";
import { HasChildren, WithChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import useRequiredToastContext from "../hooks/use-required-toastContext";
import {
  CommentDto,
  CommentLikeDto,
  CommentReplyDto,
  NewComment,
} from "../helpers/dtos";
import useRequiredLocalBackendContext from "../local-storage/use-required-local-backend-service-contex";

export interface CommentT {
  comments: CommentDto[];
  getCommetns: (placeId: string) => Promise<void>;
  uploadNewCommetn: (newCommetn: NewComment) => Promise<void>;
  editComment: (editedComment: CommentDto) => Promise<void>;
  deleteComment: (
    commentId: string,
    parentId: string | undefined
  ) => Promise<void>;
  likeComment: (
    updatedComment: CommentDto,
    newLikeComment: CommentLikeDto
  ) => Promise<void>;
  unlikeComment: (
    updatedComment: CommentDto,
    userId: string,
    commentId: string
  ) => Promise<void>;
  replyToComment: (
    parentCommentDto: CommentDto,
    commentReply: CommentReplyDto
  ) => Promise<void>;
  commentActionTo: string;
}

const CommentContext = createContext<CommentT | undefined>(undefined);

export const CommentContextProvider: FC<
  WithChildren<{ commentActionTo: string }>
> = ({ children, commentActionTo }) => {
  // const backend = useRequiredBackend();
  const backend = useRequiredLocalBackendContext();
  const showSuccessToast = useRequiredToastContext().showSuccess;

  const [comments, setCommetns] = useState<CommentDto[]>([]);

  const getCommetns = async (placeId: string) => {
    const comments = await backend.getComments(placeId);
    setCommetns(comments);
  };

  const uploadNewCommetn = async (newCommetn: NewComment) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }
    const pic = localStorage.getItem("userPictureUrl");

    // const writer: CommentWriter = {
    //   userId: localStorage.getItem("userId")!,
    //   username: localStorage.getItem("username")!,
    //   pictureUrl: pic ? createRelativePath(pic) : undefined,
    //   placeCount: localStorage.getItem("placeCount")
    //     ? +localStorage.getItem("placeCount")! + 1
    //     : 0,
    // };

    // const comment: CommentDto = {
    //   id: Math.random().toString(),
    //   date: newCommetn.date.toString(),
    //   text: newCommetn.text,
    //   postID: newCommetn.postID,
    //   writer,
    // };

    const result = await backend.addComment(newCommetn, commentActionTo, token);
    const comment = result.comment;
    comment.writer.pictureUrl = pic ? createRelativePath(pic) : undefined;

    setCommetns((pre) => [comment, ...pre]);
    showSuccessToast("Comment added successfully");
  };

  const editComment = async (editedComment: CommentDto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await backend.editComment(editedComment, token);
    findAndUpdateComment(editedComment);
    showSuccessToast("Comment edited successfully");
  };

  const findAndUpdateComment = (comment: CommentDto) => {
    const commentIndex = comments.findIndex((cm) => cm.id === comment.id);
    comments[commentIndex] = comment;

    setCommetns((pre) => [...pre]);
  };

  const deleteComment = async (
    commentId: string,
    parentId: string | undefined
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await backend.deleteComment(commentId, parentId, token);
    if (parentId) {
      const parentComment = findParentComment(comments, parentId) as CommentDto;

      parentComment.replies = parentComment.replies.filter(
        (reply) => reply.id !== commentId
      );

      findAndUpdateComment(parentComment);
    } else {
      setCommetns((pre) => {
        return pre.filter((comment) => comment.id !== commentId);
      });
    }

    showSuccessToast("Comment deleted successfully");
  };

  const likeComment = async (
    updatedComment: CommentDto,
    newCommentLike: CommentLikeDto
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }
    await backend.likeComment(newCommentLike, commentActionTo, token);

    findAndUpdateComment(updatedComment);
    showSuccessToast("Comment liked successfully");
  };

  const unlikeComment = async (
    commentDto: CommentDto,
    userId: string,
    commentId: string
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await backend.unlikeComment(userId, commentId, token);

    findAndUpdateComment(commentDto);
    showSuccessToast("Comment unliked successfully");
  };

  const replyToComment = async (
    parentCommentDto: CommentDto,
    commentReply: CommentReplyDto
  ) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    const pic = localStorage.getItem("userPictureUrl");

    const { replyComment } = await backend.replyComment(
      commentReply,
      commentActionTo,
      token
    );
    replyComment.writer.pictureUrl = pic ? createRelativePath(pic) : undefined;

    parentCommentDto.replies.unshift(replyComment);
    findAndUpdateComment(parentCommentDto);
    showSuccessToast("Replyed to comment successfully");
  };

  const findParentComment = (
    commentsList: CommentDto[],
    parentId: string,
    nestingKey = "replies"
  ): any =>
    commentsList.reduce((a, item) => {
      if (a) return a;
      if (item.id === parentId) return item;
      if (item.replies)
        return findParentComment(item.replies, parentId, nestingKey);
    }, null);

  const value: CommentT = {
    comments,
    getCommetns,
    uploadNewCommetn,
    editComment,
    deleteComment,
    likeComment,
    unlikeComment,
    replyToComment,
    commentActionTo,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export default CommentContext;
