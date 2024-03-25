import classes from "./UserItem.module.css";
import { Link } from "react-router-dom";

import Avatar from "../../Profile/UI/Avatar";
import Card from "../../Shared-UI/Card";

const UserItem = ({ id, username, pictureUrl, placeCount }) => {
  const userInfo = { id, username, pictureUrl, placeCount };
  // id=userId
  return (
    <li className={classes["user-item"]} key={id}>
      <Card className={classes["user-item__content"]}>
        <Link
          to={{
            pathname: `/places/${id}`,
            state: { userInfo },
          }}
        >
          <div className={classes["user-item__image"]}>
            <Avatar pictureUrl={pictureUrl} alt={username} width={"4rem"} />
          </div>
          <div>
            <p className={classes["user-item__info__name"]}>{username}</p>
            <p className={classes["user-item__info__count"]}>
              {placeCount} {placeCount === 1 ? "Place" : "Places"}
            </p>
          </div>
        </Link>
      </Card>
    </li>
  );
};

export default UserItem;
