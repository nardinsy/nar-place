import { FC, ReactNode, useRef, MouseEvent, useState, useEffect } from "react";
import Avatar from "../../Profile/UI/Avatar";
import { CommentDto, UserDto } from "../../helpers/dtos";
import { createAbsoluteApiAddress } from "../../helpers/api-url";
import { Link } from "react-router-dom";
import Dropdown, { DropDownItem } from "../../Header/Dropdown/DropdownCard";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEllipsis } from "@fortawesome/free-solid-svg-icons";
import CommentLike from "./like/CommentLike";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import Reply from "./reply/Reply";
import classes from "./CommentItem.module.css";

type CommentItemT = {
  commentDto: CommentDto;
  children?: ReactNode | ReactNode[];
  items?: DropDownItem[];
};

const CommentItem: FC<CommentItemT> = ({ commentDto, children, items }) => {
  const authCtx = useRequiredAuthContext();
  const [showDropDown, setShowDropDown] = useState(false);
  const [replyMode, setReplyMode] = useState(false);

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

  // const { date, postID, text, writer, likes, replies, id } = commentDto;
  const { pictureUrl, userId, username, placeCount } = commentDto.writer;
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

  const replyButtonClickHandler = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setReplyMode((pre) => !pre);
  };

  const disableReplyMode = () => {
    setReplyMode(false);
  };

  const defaultItems = [
    { title: "Help", handler: () => {} },
    // {
    //   title: "Repost this content",
    //   handler: () => {},
    // },
  ];

  const dropdownItems = items ? [...defaultItems, ...items] : defaultItems;

  return (
    <>
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
            <div className={classes["comment-actions"]}>
              <Link
                to={{ pathname: `/places/${userId}`, state: { userDto } }}
                className={classes["writer-username"]}
              >
                @{username}
              </Link>
            </div>
            {authCtx.isLoggedin && (
              <div className={classes["comment-actions"]}>
                <button
                  className={classes["reply-button"]}
                  onClick={replyButtonClickHandler}
                >
                  Reply
                </button>
                <CommentLike
                  commentDto={commentDto}
                  loggedUserUserId={authCtx.userId}
                />
              </div>
            )}
            <button
              data-testid="more-button"
              ref={moreButtonRef}
              className={classes["comment-more-button"]}
              onClick={moreButtonClickHandler}
            >
              <FontAwesomeIcon icon={faEllipsis} />
              {showDropDown && (
                <Dropdown
                  items={dropdownItems}
                  key={Math.random()}
                  propClassName={classes["dropdown-more-button"]}
                />
              )}
            </button>
          </div>
          {children}
        </div>
      </div>

      <Reply
        commentDto={commentDto}
        showReplyTextarea={replyMode}
        closeReplyTextarea={disableReplyMode}
      />
    </>
  );
};

export default CommentItem;
