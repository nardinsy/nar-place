import { createContext, useState, FC } from "react";
import { createRelativePath } from "../helpers/api-url";
import { HasChildren } from "../helpers/props";
import useRequiredBackend from "../hooks/use-required-backend";
import useRequiredToastContext from "../hooks/use-required-toastContext";
import {
  CommentDto,
  CommentLikeDto,
  CommentReplyDto,
  NewComment,
} from "../helpers/dtos";

interface CommentT {
  comments: CommentDto[];
  getCommetns: (placeId: string) => Promise<void>;
  uploadNewCommetn: (newCommetn: NewComment) => Promise<void>;
  editComment: (editedComment: CommentDto) => Promise<void>;
  deleteComment: (commentId: string) => Promise<void>;
  likeComment: (newLikeComment: CommentLikeDto) => Promise<void>;
  unlikeComment: (userId: string, commentId: string) => Promise<void>;
  replyToComment: (commentReply: CommentReplyDto) => Promise<void>;
}

const CommentContext = createContext<CommentT | undefined>(undefined);

export const CommentContextProvider: FC<HasChildren> = ({ children }) => {
  const backend = useRequiredBackend();
  const showSuccessToast = useRequiredToastContext().showSuccess;

  const [comments, setCommetns] = useState<CommentDto[]>([]);

  const getCommetns = async (placeId: string) => {
    const comments = await backend.getComments(placeId);
    setCommetns(comments);
    // return comments;
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

    const result = await backend.addComment(newCommetn, token);
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
    findAndEditCommentText(editedComment);
    showSuccessToast("Comment edited successfully");
  };

  const findAndEditCommentText = (editedComment: CommentDto) => {
    const item = comments.find((comment) => comment.id === editedComment.id);

    if (item) {
      item.text = editedComment.text;
      // item.date = editedComment.date.toString();
    }
    setCommetns((pre) => pre);
  };

  const deleteComment = async (commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    await backend.deleteComment(commentId, token);

    setCommetns((pre) => {
      return pre.filter((comment) => comment.id !== commentId);
    });

    showSuccessToast("Comment deleted successfully");
  };

  const likeComment = async (newCommentLike: CommentLikeDto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }
    await backend.likeComment(newCommentLike, token);

    findAndEditCommentLikes(newCommentLike.userId, newCommentLike.commentId);
    showSuccessToast("Comment liked successfully");
  };

  const findAndEditCommentLikes = (userId: string, commentId: string) => {
    const comment = comments.find((comment) => comment.id === commentId);
    if (comment) {
      comment.likes.unshift({
        userId,
        commentId,
      });
    }
    setCommetns((pre) => pre);
  };

  const unlikeComment = async (userId: string, commentId: string) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }
    const result = await backend.unlikeComment(userId, commentId, token);
    const commentLikes = result.commentLikes;

    const unlikedCm = comments.find((comment) => comment.id === commentId);
    if (unlikedCm) {
      unlikedCm.likes = commentLikes;
    }

    setCommetns((pre) => pre);
    showSuccessToast("Comment unliked successfully");
  };

  const replyToComment = async (commentReply: CommentReplyDto) => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Please login first");
    }

    const result = await backend.replyComment(commentReply, token);

    const comment = comments.find(
      (comment) => comment.id === commentReply.commentId
    );
    // if (comment) {
    //   comment.replys.unshift({
    //     userId,
    //     text,
    //   });
    // }
    setCommetns((pre) => pre);
    showSuccessToast("Replyed to comment successfully");
  };

  const value: CommentT = {
    comments,
    getCommetns,
    uploadNewCommetn,
    editComment,
    deleteComment,
    likeComment,
    unlikeComment,
    replyToComment,
  };

  return (
    <CommentContext.Provider value={value}>{children}</CommentContext.Provider>
  );
};

export default CommentContext;
