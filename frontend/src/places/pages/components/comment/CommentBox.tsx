import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import useRequiredBackend from "../../../../hooks/use-required-backend";
import CommetnsList from "./CommentsList";
import { CommentDto, NewComment } from "../../../../helpers/dtos";
import useRequiredAuthContext from "../../../../hooks/use-required-authContext";
import { createRelativePath } from "../../../../helpers/api-url";
import useRequiredToastContext from "../../../../hooks/use-required-toastContext";
import classes from "./Comment.module.css";

const CommentBox = ({ placeId }: { placeId: string }) => {
  const authContext = useRequiredAuthContext();
  const showSuccessToast = useRequiredToastContext().showSuccess;
  const showErrorToast = useRequiredToastContext().showError;

  const [comments, setCommetns] = useState<CommentDto[]>([]);
  const backend = useRequiredBackend();

  useEffect(() => {
    const getCommetns = async () => {
      const comments = await backend.getComments(placeId);
      setCommetns(comments);
    };

    getCommetns();
    return () => {};
  }, [backend, placeId]);

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
    findAndEditComment(editedComment);
    setCommetns((pre) => pre);
    showSuccessToast("Comment edited successfully");
  };

  const findAndEditComment = (editedComment: CommentDto) => {
    const item = comments.find((comment) => comment.id === editedComment.id);

    if (item) {
      item.text = editedComment.text;
      // item.date = editedComment.date.toString();
    }
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

  return (
    <div>
      <h3 style={{ paddingLeft: "0.5rem" }}>Comments</h3>
      <CommetnsList
        comments={comments}
        onEdit={editComment}
        onDelete={deleteComment}
      />

      <div className={classes["comment-scope"]}>
        {authContext.isLoggedin && (
          <CommentInput placeId={placeId} onUpload={uploadNewCommetn} />
        )}
      </div>
    </div>
  );
};

export default CommentBox;
