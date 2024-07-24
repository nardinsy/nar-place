import { ChangeEvent, FC, MouseEvent, useState } from "react";
import Avatar from "../../../../Profile/UI/Avatar";
import { CommentDto, UserDto } from "../../../../helpers/dtos";
import { createAbsoluteApiAddress } from "../../../../helpers/api-url";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../../../Header/Dropdown/DropdownCard";
import Button from "../../../../shared-UI/Button";
import classes from "./CommentItem.module.css";

type EditableCommentItemT = {
  commentDto: CommentDto;
  onEdit: (editedCommetn: CommentDto, id: string) => Promise<void>;
  onDelete: (commentId: string) => Promise<void>;
};

const EditableCommentItem: FC<EditableCommentItemT> = ({
  commentDto,
  onEdit,
  onDelete,
}) => {
  const { id, date, postID, text, writer } = commentDto;
  const { pictureUrl, userId, username, placeCount } = writer;

  const [showDropDown, setShowDropDown] = useState(false);
  const [activeEditingMode, setActiveEditingMode] = useState(false);
  const [textareaText, setTextareaText] = useState(text);
  const [submitEditButtonActive, setSubmitEditButtonActive] = useState(false);

  const absolutePictureUrl = pictureUrl
    ? createAbsoluteApiAddress(pictureUrl)
    : undefined;

  const userDto: UserDto = {
    pictureUrl: absolutePictureUrl,
    userId,
    username,
    placeCount,
  };

  const moreButtonClickHandler = (event: MouseEvent<HTMLElement>) => {
    event.preventDefault();
    setShowDropDown((pre) => !pre);
  };

  const editButtonClickHandler = (event: any) => {
    setShowDropDown(false);
    setActiveEditingMode(true);
  };

  const validateTextareaText = (teaxtareaText: string) => {
    if (teaxtareaText === text || teaxtareaText.match("^\\s*$")) {
      return false;
    }

    return true;
  };

  const changeTextareaText = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setTextareaText(event.target.value);

    if (!validateTextareaText(event.target.value)) {
      setSubmitEditButtonActive(false);
      return;
    }

    setSubmitEditButtonActive(true);
  };

  const submitEditedCommetn = async (event: MouseEvent<HTMLElement>) => {
    setActiveEditingMode(false);
    setSubmitEditButtonActive(false);

    commentDto.text = textareaText;
    commentDto.date = new Date().toDateString();

    await onEdit(commentDto, id);
  };

  const cancelEditingHandler = (event: MouseEvent<HTMLElement>) => {
    setActiveEditingMode(false);
    setSubmitEditButtonActive(false);
  };

  const deleteButtonClickHandler = async (event: MouseEvent<HTMLElement>) => {
    await onDelete(id);
    setShowDropDown(false);
  };

  const commentText = text.split("\n").map((item, index) => {
    return (
      <span key={index}>
        {item}
        <br />
      </span>
    );
  });

  const items = [
    { title: "Edit", handler: editButtonClickHandler },
    {
      title: "Delete",
      handler: deleteButtonClickHandler,
    },
  ];

  const commentDiv = (
    <div className={classes["comment-text"]}>{commentText}</div>
  );

  const commentTextarea = (
    <>
      <textarea
        className={`${classes["comment-text"]} ${classes["comment-textarea"]}`}
        value={textareaText}
        onChange={changeTextareaText}
        // autoFocus
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

  return (
    <div className={classes["comment-item"]}>
      <div className={classes["writer-avatar"]}>
        <Link
          to={{
            pathname: `/places/${userId}`,
            state: { userDto },
          }}
        >
          <Avatar
            alt="comment"
            pictureUrl={absolutePictureUrl}
            key={userId}
            width="2rem"
          />
        </Link>
      </div>
      <div className={classes["commetn-details"]}>
        <div className={classes["comment-info"]}>
          <div className={classes["writer-username"]}>@{username}</div>
          <button
            data-testid="more-button"
            className={classes["comment-edit-button"]}
            onClick={moreButtonClickHandler}
          >
            <FontAwesomeIcon icon={faEllipsis} />
          </button>
          {showDropDown && <Dropdown items={items} key={Math.random()} />}
        </div>
        {activeEditingMode ? commentTextarea : commentDiv}
      </div>
    </div>
  );
};

export default EditableCommentItem;
