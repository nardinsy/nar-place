import { useState, FC, ChangeEvent, MouseEvent } from "react";
import Button from "../../../../shared-UI/Button";
import { CommentDto } from "../../../../helpers/dtos";
import useRequiredCommentContext from "../../../../hooks/use-required-commentContext";
import classes from "./CommentItem.module.css";

type CommentEditTextareaT = {
  text: string;
  disableEditMode: () => {};
  commentDto: CommentDto;
};

const CommentEditTextare: FC<CommentEditTextareaT> = ({
  text,
  disableEditMode,
  commentDto,
}) => {
  const commentContext = useRequiredCommentContext();
  const [textareaText, setTextareaText] = useState(text);
  const [submitEditButtonActive, setSubmitEditButtonActive] = useState(false);

  const changeTextareaText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaText(event.target.value);

    if (!validateTextareaText(event.target.value)) {
      setSubmitEditButtonActive(false);
      return;
    }

    setSubmitEditButtonActive(true);
  };

  const submitEditedCommetn = async (event: MouseEvent<HTMLElement>) => {
    // setActiveEditingMode(false);
    disableEditMode();
    setSubmitEditButtonActive(false);

    commentDto.text = textareaText;
    commentDto.date = new Date().toDateString();

    await commentContext.editComment(commentDto);
  };

  const cancelEditingHandler = (event: MouseEvent<HTMLElement>) => {
    // setActiveEditingMode(false);
    event.preventDefault();
    disableEditMode();
    setSubmitEditButtonActive(false);
  };

  const validateTextareaText = (teaxtareaText: string) => {
    if (teaxtareaText === text || teaxtareaText.match("^\\s*$")) {
      return false;
    }

    return true;
  };

  return (
    <>
      <textarea
        className={`${classes["comment-text"]} ${classes["comment-textarea"]}`}
        value={textareaText}
        onChange={changeTextareaText}
        onFocus={(e) =>
          e.currentTarget.setSelectionRange(
            e.currentTarget.value.length,
            e.currentTarget.value.length
          )
        }
        autoFocus
      />
      <Button
        action="cancel"
        className={classes["textarea-button"]}
        onClick={cancelEditingHandler}
      >
        Cancel
      </Button>
      {submitEditButtonActive && (
        <Button
          action="submit"
          className={classes["textarea-button"]}
          onClick={submitEditedCommetn}
        >
          Save
        </Button>
      )}
    </>
  );
};

export default CommentEditTextare;
