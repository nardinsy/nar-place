import { FC, MouseEvent, useEffect, useRef, useState } from "react";
import Avatar from "../../../../Profile/UI/Avatar";
import { CommentDto, UserDto } from "../../../../helpers/dtos";
import { createAbsoluteApiAddress } from "../../../../helpers/api-url";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import Dropdown from "../../../../Header/Dropdown/DropdownCard";
import classes from "./CommentItem.module.css";
import useRequiredCommentContext from "../../../../hooks/use-required-commentContext";
import CommentEditTextare from "./CommentEditTextarea";

type EditableCommentItemT = {
  commentDto: CommentDto;
};

const EditableCommentItem: FC<EditableCommentItemT> = ({ commentDto }) => {
  const commentContext = useRequiredCommentContext();

  const [showDropDown, setShowDropDown] = useState(false);
  const [activeEditingMode, setActiveEditingMode] = useState(false);

  const moreButtonRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    const checkIfClickedOutside = (e: any) => {
      if (!moreButtonRef.current) return;

      if (showDropDown && !moreButtonRef.current.contains(e.target)) {
        setShowDropDown(false);
        // closeDropdown(e);
      }
    };

    window.addEventListener("mousedown", checkIfClickedOutside);
    window.addEventListener("scroll", (event) => setShowDropDown(false));

    return () => {
      window.removeEventListener("mousedown", checkIfClickedOutside);
      window.addEventListener("scroll", (event) => setShowDropDown(false));
    };
  }, [showDropDown]);

  const { id, date, postID, text, writer } = commentDto;
  const { pictureUrl, userId, username, placeCount } = writer;
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
    event.preventDefault();
    event.stopPropagation();
    setShowDropDown(false);
    setActiveEditingMode(true);
  };

  const deleteButtonClickHandler = async (event: MouseEvent<HTMLElement>) => {
    await commentContext.deleteComment(id);
    setShowDropDown(false);
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

  const commentDiv = (
    <div className={classes["comment-text"]}>{commentText}</div>
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
            ref={moreButtonRef}
            className={classes["comment-edit-button"]}
            onClick={moreButtonClickHandler}
          >
            <FontAwesomeIcon icon={faEllipsis} />
            {showDropDown && (
              <Dropdown
                items={items}
                key={Math.random()}
                propClassName={classes["dropdown-more-button"]}
              />
            )}
          </button>
        </div>
        {activeEditingMode ? (
          <CommentEditTextare
            text={text}
            disableEditMode={async () => setActiveEditingMode(false)}
            commentDto={commentDto}
          />
        ) : (
          commentDiv
        )}
      </div>
    </div>
  );
};

export default EditableCommentItem;
