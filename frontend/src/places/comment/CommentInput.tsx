import { ChangeEvent, KeyboardEvent, FC, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faFaceSmile } from "@fortawesome/free-solid-svg-icons";
import { NewComment } from "../../helpers/dtos";
import useRequiredCommentContext from "../../hooks/use-required-commentContext";
import classes from "./CommentInput.module.css";

type CommentInputT = {
  placeId: string;
};

const CommentInput: FC<CommentInputT> = ({ placeId }) => {
  const commentContext = useRequiredCommentContext();

  const [commentInput, setCommentInput] = useState("");
  const [submitButtonIsActive, setSubmitButtonIsActive] = useState(false);

  const commentInputChangeHandler = (
    event: ChangeEvent<HTMLTextAreaElement>
  ) => {
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

    await commentContext.uploadNewCommetn(newComment);
    setCommentInput("");
    setSubmitButtonIsActive(false);
  };

  const submitCommentHandler = async () => {
    await submit();
  };

  return (
    <div className={classes["comment-input-container"]}>
      <div className={classes["left"]}>
        <textarea
          placeholder="Add a comment"
          className={classes["comment-input"]}
          value={commentInput}
          onChange={commentInputChangeHandler}
        />
      </div>

      <div className={classes.actions}>
        <FontAwesomeIcon
          icon={faFaceSmile}
          className={classes["emoji-button"]}
        />

        <div onClick={submitCommentHandler}>
          <FontAwesomeIcon
            icon={faPaperPlane}
            className={
              submitButtonIsActive
                ? classes["send-button"]
                : classes["notActive"]
            }
          />
        </div>
      </div>
    </div>
  );
};

export default CommentInput;

{
  /* <input
        type="text"
        placeholder="Add a comment"
        className={classes["comment-input"]}
        value={commentInput}
        onKeyDown={keyDownHandler}
        onChange={commentInputChangeHandler}
      /> */
}
