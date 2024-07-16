import { FC } from "react";
import Avatar from "../../../../Profile/UI/Avatar";
import { CommentDto, UserDto } from "../../../../helpers/dtos";
import { createAbsoluteApiAddress } from "../../../../helpers/api-url";
import { Link } from "react-router-dom";
import classes from "./CommentItem.module.css";

type CommentItemT = {
  commentDto: CommentDto;
};

const CommentItem: FC<CommentItemT> = ({ commentDto }) => {
  const { date, postID, text, writer } = commentDto;
  const { pictureUrl, userId, username, placeCount } = writer;
  const userDto: UserDto = { pictureUrl, userId, username, placeCount };
  const picUrl = pictureUrl ? createAbsoluteApiAddress(pictureUrl) : undefined;

  return (
    <li>
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
              pictureUrl={picUrl}
              key={userId}
              width="2rem"
            />
          </Link>
        </div>
        <div className={classes["comment-details"]}>
          <div className={classes["writer-info"]}>@{username}</div>
          <div className={classes["comment-text"]}>{text}</div>
        </div>
      </div>
    </li>
  );
};

export default CommentItem;
