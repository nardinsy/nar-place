import { FC } from "react";
import { Link } from "react-router-dom";
import Avatar from "../../Profile/UI/Avatar";
import Card from "../../shared-UI/Card";
import { UserDto } from "../../helpers/dtos";
import classes from "./UserItem.module.css";

type UserItemProps = { userDto: UserDto; key: string };

const UserItem: FC<UserItemProps> = ({ userDto }) => {
  const { userId, username, pictureUrl, placeCount } = userDto;

  return (
    <li className={classes["user-item"]} key={userId} data-testid={userId}>
      <Card className={classes["user-item__content"]}>
        <Link
          to={{
            pathname: `/places/${userId}`,
            state: { userDto },
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
