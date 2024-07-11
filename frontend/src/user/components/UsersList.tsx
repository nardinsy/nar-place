import UserItem from "./UserItem";
import Card from "../../shared-UI/Card";
import { createAbsoluteApiAddress } from "../../helpers/api-url";
import classes from "./UsersList.module.css";
import { UserDto } from "../../helpers/dtos";
import Spinner from "../../shared-UI/Spinner";

const UsersList = ({
  users,
  loading,
}: {
  users: UserDto[];
  loading: boolean;
}) => {
  if (loading) {
    return (
      <div className={classes.center} data-testid="users-spinner">
        <Spinner />
      </div>
    );
  }

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
    return <UserItem key={user.userId} userDto={{ ...user, pictureUrl }} />;
  });
  return (
    <ul className={classes["users-list"]} data-testid="users-list">
      {userItems}
    </ul>
  );
};

export default UsersList;
