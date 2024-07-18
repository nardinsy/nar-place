import { ChangeEvent, FC, MouseEvent, useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaperPlane,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import useRequiredBackend from "../../../../hooks/use-required-backend";
import { NewComment } from "../../../../helpers/dtos";
import useRequiredAuthContext from "../../../../hooks/use-required-authContext";
import classes from "./CommentInput.module.css";
import { convertToObject } from "typescript";

type CommentInputT = {
  placeId: string;
  onUpload: (newCommetn: NewComment) => void;
};

const CommentInput: FC<CommentInputT> = ({ placeId, onUpload }) => {
  const backend = useRequiredBackend();
  const authContext = useRequiredAuthContext();

  if (!authContext.isLoggedin) {
    throw new Error("can not show commetn input");
  }

  const token = authContext.token;
  const [commentInput, setCommentInput] = useState("");
  const [submitButtonIsActive, setSubmitButtonIsActive] = useState(false);

  const commentInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCommentInput(event.target.value);

    if (event.target.value === "") {
      setSubmitButtonIsActive(false);
    } else {
      setSubmitButtonIsActive(true);
    }
  };

  const submitCommentHandler = async () => {
    const newCommetn: NewComment = {
      date: new Date(),
      postID: placeId,
      text: commentInput,
    };

    await backend.addComment(newCommetn, token);
    onUpload(newCommetn);
    setCommentInput("");
    setSubmitButtonIsActive(false);
  };

  return (
    <div className={classes["comment-input-container"]}>
      <FontAwesomeIcon icon={faHeart} className={classes["heart-button"]} />

      <input
        type="text"
        placeholder="Add a comment"
        className={classes["comment-input"]}
        value={commentInput}
        onChange={commentInputChangeHandler}
      />
      <FontAwesomeIcon icon={faFaceSmile} className={classes["emoji-button"]} />
      {/* <div className={classes["place-page-emoji"]}>😀</div> */}

      <div onClick={submitCommentHandler}>
        <FontAwesomeIcon
          icon={faPaperPlane}
          className={
            submitButtonIsActive ? classes["send-button"] : classes["notActive"]
          }
        />
      </div>
    </div>
  );
};

export default CommentInput;
