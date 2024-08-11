import { useState, FC, ChangeEvent, MouseEvent, KeyboardEvent } from "react";
import Button from "../../../shared-UI/Button";
import classes from "./Textarea.module.css";

type TextareaT = {
  text: string;
  onSubmit: (text: string) => Promise<void>;
  closeTextarea: () => void;
};

const Textare: FC<TextareaT> = ({ text, onSubmit, closeTextarea }) => {
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
    await submit();
  };

  const cancelButtonClickHandler = (event: MouseEvent<HTMLElement>) => {
    // setActiveEditingMode(false);
    event.preventDefault();
    closeTextarea();
    setSubmitEditButtonActive(false);
  };

  const validateTextareaText = (teaxtareaText: string) => {
    if (teaxtareaText === text || teaxtareaText.match("^\\s*$")) {
      return false;
    }

    return true;
  };

  const keyDownHandler = async (event: KeyboardEvent<HTMLInputElement>) => {
    if (
      event.key !== "Enter" ||
      textareaText === "" ||
      textareaText.match(/^\s+$/)
    ) {
      return;
    }

    if (event.key === "Enter" && event.shiftKey) {
      return;
      // new line
    }

    await submit();
  };

  const submit = async () => {
    await onSubmit(textareaText);
    setSubmitEditButtonActive(false);
    closeTextarea();
  };

  return (
    <div className={classes["container"]} onKeyDown={keyDownHandler}>
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
    </div>
  );
};

export default Textare;
