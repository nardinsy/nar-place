import { CommentActions, NotificationDto, UserDto } from "../helpers/dtos";
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

  if (notificationDto.kind === "Comment") {
    message = getCommentNotificationMessage(notificationDto);
  } else if (notificationDto.kind === "Follow") {
    message = getFollowNotificationMessage(notificationDto);
  }

  const absolutePictuteUrl = notificationDto.from.pictureUrl
    ? createAbsoluteApiAddress(notificationDto.from.pictureUrl)
    : undefined;

  return (
    <div className="flex flex-row items-center">
      <Avatar
        pictureUrl={absolutePictuteUrl}
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
  notificationDto: NotificationDto
): string => {
  const { commentContent } = notificationDto;

  let message: string = "Notification";

  switch (+commentContent.action) {
    case CommentActions.LikeComment:
      message = `liked your comment`;
      break;
    case CommentActions.ReplyComment:
      message = `replied to your comment`;
      break;
    case CommentActions.UnlikeComment:
      message = `unliked to your comment`;
      break;
    case CommentActions.WriteComment:
      message = `commented on your post`;
      break;
  }

  return message;
};

const getFollowNotificationMessage = (
  notificationDto: NotificationDto
): string => {
  return `wants to follow you`;
};

export default NotificationItem;
