import { FC, MouseEvent, useState } from "react";
import { CommentDto } from "../../helpers/dtos";
import useRequiredCommentContext from "../../hooks/use-required-commentContext";
import CommentEditTextare from "./CommentEditTextarea";
import CommentItem from "./CommentItem";
import classes from "./CommentItem.module.css";

type EditableCommentItemT = {
  commentDto: CommentDto;
};

const EditableCommentItem: FC<EditableCommentItemT> = ({ commentDto }) => {
  const commentContext = useRequiredCommentContext();
  const [activeEditingMode, setActiveEditingMode] = useState(false);

  const { id, text } = commentDto;

  const editButtonClickHandler = (event: any) => {
    event.preventDefault();
    // event.stopPropagation();
    // setShowDropDown(false);
    setActiveEditingMode(true);
  };

  const deleteButtonClickHandler = async (event: MouseEvent<HTMLElement>) => {
    await commentContext.deleteComment(id);
    // setShowDropDown(false);
    // setTextareaText("");
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

  return (
    <CommentItem commentDto={commentDto} items={items}>
      {activeEditingMode ? (
        <CommentEditTextare
          text={text}
          disableEditMode={async () => setActiveEditingMode(false)}
          commentDto={commentDto}
        />
      ) : (
        <div className={classes["comment-text"]}>{commentText}</div>
      )}
    </CommentItem>
  );
};

export default EditableCommentItem;
