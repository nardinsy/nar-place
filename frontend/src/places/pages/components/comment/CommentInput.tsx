import { ChangeEvent, KeyboardEvent, FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaperPlane,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import { NewComment } from "../../../../helpers/dtos";
import classes from "./CommentInput.module.css";

type CommentInputT = {
  placeId: string;
  onUpload: (newCommetn: NewComment) => void;
};

const CommentInput: FC<CommentInputT> = ({ placeId, onUpload }) => {
  const [commentInput, setCommentInput] = useState("");
  const [submitButtonIsActive, setSubmitButtonIsActive] = useState(false);

  const commentInputChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
    event.preventDefault();
    setCommentInput(event.target.value);

    if (event.target.value === "") {
      setSubmitButtonIsActive(false);
      return;
    }
    if (event.target.value !== "" && !submitButtonIsActive) {
      setSubmitButtonIsActive(true);
      return;
    }
  };

  const keyDownHandler = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key !== "Enter" || commentInput === "") {
      return;
    }

    await submit();
  };

  const submit = async () => {
    const newComment: NewComment = {
      date: new Date(),
      postID: placeId,
      text: commentInput,
    };

    await onUpload(newComment);
    setCommentInput("");
    setSubmitButtonIsActive(false);
  };

  const submitCommentHandler = async () => {
    await submit();
  };

  return (
    <div className={classes["comment-input-container"]}>
      <FontAwesomeIcon icon={faHeart} className={classes["heart-button"]} />

      <input
        type="text"
        placeholder="Add a comment"
        className={classes["comment-input"]}
        value={commentInput}
        onKeyDown={keyDownHandler}
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
