import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import useRequiredBackend from "../../../../hooks/use-required-backend";
import CommetnsList from "./CommentsList";
import {
  CommentDto,
  CommentWriter,
  NewComment,
} from "../../../../helpers/dtos";
import classes from "./Comment.module.css";
import useRequiredAuthContext from "../../../../hooks/use-required-authContext";
import { createRelativePath } from "../../../../helpers/api-url";

const CommentBox = ({ placeId }: { placeId: string }) => {
  const authContext = useRequiredAuthContext();
  const [comments, setCommetns] = useState<CommentDto[]>([]);
  const backend = useRequiredBackend();

  useEffect(() => {
    const getCommetns = async () => {
      const comments = await backend.getComments(placeId);
      setCommetns(comments);
    };

    getCommetns();
    return () => {};
  }, []);

  const uploadNewCommetn = (newCommetn: NewComment) => {
    if (!localStorage.getItem("token")) {
      throw new Error("Please login first");
    }

    const writer: CommentWriter = {
      userId: localStorage.getItem("userId")!,
      username: localStorage.getItem("username")!,
      pictureUrl: createRelativePath(localStorage.getItem("userPictureUrl")!),
      placeCount: +localStorage.getItem("placeCount")!,
    };

    const comment: CommentDto = {
      date: newCommetn.date.toString(),
      text: newCommetn.text,
      postID: newCommetn.postID,
      writer,
    };
    setCommetns((pre) => [...pre, comment]);
  };

  return (
    <div>
      <CommetnsList comments={comments} />

      <div className={classes["comment-scope"]}>
        {authContext.isLoggedin && (
          <CommentInput placeId={placeId} onUpload={uploadNewCommetn} />
        )}
      </div>
    </div>
  );
};

export default CommentBox;
