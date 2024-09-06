import createHttpError from "../models/createHttpError";
import UserNotification, { IUserNotification } from "../models/notification";
import { AuthRequestHandler } from "../lib/auth";

export const getNewNotifications: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const notificationsId = user.newNotifications;

  const newNotificationsDto = await Promise.all(
    notificationsId.map(async (notificationId) => {
      let notification: IUserNotification | null;

      try {
        notification = await UserNotification.findOne(notificationId);

        if (!notification) {
          throw new Error(
            "Something went wrong, could not find notification 1."
          );
        }
      } catch (err) {
        throw new Error("Something went wrong, could not find notification 2.");
      }
      return notification;
    })
  );

  res.status(200).json(newNotificationsDto);
};

// const getOldNotifications = async (ids: Types.ObjectId[]) => {
//   return await Promise.all(
//     ids.map(async (id) => {
//       let notification: IUserNotification | null;

//       try {
//         notification = await UserNotification.findOne(id);

//         if (!notification) {
//           throw new Error(
//             "Something went wrong, could not find notification 1."
//           );
//         }
//       } catch (err) {
//         throw new Error("Something went wrong, could not find notification 2.");
//       }
//       return notification;
//     })
//   );
// };

export const mergeAndResetNotifications: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  user.newNotifications.forEach((notification) =>
    user.oldNotifications.unshift(notification)
  );
  user.newNotifications = [];

  try {
    user.save();
  } catch (error) {
    return next(
      createHttpError(
        "Could not update user notifications, please try again.",
        500
      )
    );
  }
  res.status(200).json({ message: "ًAll notification marked as read" });
};

export const getCurrentNotifications: AuthRequestHandler = async (
  user,
  req,
  res,
  next
) => {
  const currentNotifications = await Promise.all(
    user.oldNotifications.map(async (id) => {
      let notification: IUserNotification | null;

      try {
        notification = await UserNotification.findOne(id);

        if (!notification) {
          throw new Error(
            "Something went wrong, could not find notification 1."
          );
        }
      } catch (err) {
        throw new Error("Something went wrong, could not find notification 2.");
      }
      return notification;
    })
  );

  res.status(200).json({ currentNotifications });
};
