import UserItem from "./UserItem";
import Card from "../../Shared-UI/Card";
import { createAbsoluteApiAddress } from "../../helpers/api-url";
import classes from "./UsersList.module.css";

const UsersList = ({ users }) => {
  if (users.length === 0) {
    return (
      <div className={classes.center}>
        <Card className={classes["center-message"]}>
          <h2>No user found.</h2>
        </Card>
      </div>
    );
  }

  const userss = users.map((user) => {
    let pictureUrl;
    if (user.pictureUrl) {
      pictureUrl = createAbsoluteApiAddress(user.pictureUrl);
    }

    return (
      <UserItem
        key={user.userId}
        id={user.userId}
        username={user.username}
        placeCount={user.placeCount}
        pictureUrl={pictureUrl}
      />
    );
  });

  return <ul className={classes["users-list"]}>{userss}</ul>;
};

export default UsersList;
