import { useEffect, useState } from "react";
import CommentInput from "./CommentInput";
import useRequiredBackend from "../../../../hooks/use-required-backend";
import CommetnsList from "./CommentsList";
import {
  CommentDto,
  CommentWriter,
  NewComment,
  UserDto,
} from "../../../../helpers/dtos";
import useRequiredAuthContext from "../../../../hooks/use-required-authContext";
import { createRelativePath } from "../../../../helpers/api-url";
import classes from "./Comment.module.css";

const CommentBox = ({
  placeId,
  userDto,
}: {
  placeId: string;
  userDto: UserDto;
}) => {
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
    const writer: CommentWriter = {
      userId: userDto.userId,
      username: userDto.username,
      pictureUrl: userDto.pictureUrl
        ? createRelativePath(userDto.pictureUrl)
        : undefined,
      placeCount: userDto.placeCount ? userDto.placeCount : 0,
    };

    const comment: CommentDto = {
      date: newCommetn.date.toString(),
      text: newCommetn.text,
      postID: newCommetn.postID,
      writer,
    };

    setCommetns((pre) => [comment, ...pre]);
  };

  return (
    <div>
      <h3 style={{ paddingLeft: "0.5rem" }}>Comments</h3>
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
