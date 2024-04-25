import UserItem from "./UserItem";
import Card from "../../Shared-UI/Card";
import { createAbsoluteApiAddress } from "../../helpers/api-url";
import classes from "./UsersList.module.css";
import { UserDto } from "../../sharedTypes/dtos";

const UsersList = ({ users }: { users: UserDto[] }) => {
  if (users.length === 0) {
    return (
      <div className={classes.center}>
        <Card className={classes["center-message"]}>
          <h2>No user found.</h2>
        </Card>
      </div>
    );
  }

  const userItems = users.map((user) => {
    const pictureUrl = user.pictureUrl
      ? createAbsoluteApiAddress(user.pictureUrl)
      : undefined;

    return (
      <UserItem
        key={user.userId}
        userDto={
          new UserDto(user.userId, user.username, pictureUrl, user.placeCount)
        }
      />
    );
  });

  return <ul className={classes["users-list"]}>{userItems}</ul>;
};

export default UsersList;
