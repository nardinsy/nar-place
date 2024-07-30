import { useState, FC, ChangeEvent, MouseEvent } from "react";
import Button from "../../../shared-UI/Button";
import classes from "./Textarea.module.css";

type TextareaT = {
  text: string;
  onSubmit: (text: string) => {};
  onCancel: () => {};
};

const Textare: FC<TextareaT> = ({ text, onSubmit, onCancel }) => {
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

  const submitButtonClickHandler = async (event: MouseEvent<HTMLElement>) => {
    // setActiveEditingMode(false);
    onCancel();
    setSubmitEditButtonActive(false);
    await onSubmit(textareaText);
  };

  const cancelButtonClickHandler = (event: MouseEvent<HTMLElement>) => {
    // setActiveEditingMode(false);
    event.preventDefault();
    onCancel();
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
        className={classes["comment-textarea"]}
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
        onClick={cancelButtonClickHandler}
      >
        Cancel
      </Button>
      {submitEditButtonActive && (
        <Button
          action="submit"
          className={classes["textarea-button"]}
          onClick={submitButtonClickHandler}
        >
          Save
        </Button>
      )}
    </>
  );
};

export default Textare;
