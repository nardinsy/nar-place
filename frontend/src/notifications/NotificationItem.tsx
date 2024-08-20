import {
  CommentActions,
  CommentNotificationDto,
  FollowNotificationDto,
  NotificationDto,
  UserDto,
} from "../helpers/dtos";
import Avatar from "../shared-UI/Avatar";
import { createAbsoluteApiAddress } from "../helpers/api-url";
import { Link } from "react-router-dom";

const NotificationItem = ({
  notificationDto,
}: {
  notificationDto: NotificationDto;
}) => {
  const { from }: { from: UserDto } = notificationDto;
  let message;
  if (notificationDto.type === "Comment") {
    message = getCommentNotificationMessage(notificationDto);
  } else if (notificationDto.type === "Follow") {
    message = getFollowNotificationMessage(notificationDto);
  }

  return (
    <div className="flex flex-row items-center">
      <Avatar
        pictureUrl={from.pictureUrl}
        alt={"user"}
        width={"2rem"}
        cssClassName="mr-1"
      />
      <div className="text-gray-fav tracking-wide text-sm">
        <Link
          to={{
            pathname: `/places/${from.userId}`,
            state: { userDto: from },
          }}
        >
          <span className="font-bold text-gray-dark hover:underline">
            {from.username}
          </span>
          <span> </span>
        </Link>

        {message}
      </div>
    </div>
  );
};

const getCommentNotificationMessage = (
  notificationDto: CommentNotificationDto
): string => {
  const { content } = notificationDto;
  switch (content.action) {
    case CommentActions.LikeComment:
      return `liked your comment`;
    case CommentActions.ReplyComment:
      return `replied to your comment`;
    case CommentActions.UnlikeComment:
      return `unliked to your comment`;
    case CommentActions.WriteComment:
      return `commented on your post`;
  }
};

const getFollowNotificationMessage = (
  notificationDto: FollowNotificationDto
): string => {
  return `wants to follow you`;
};

export default NotificationItem;
