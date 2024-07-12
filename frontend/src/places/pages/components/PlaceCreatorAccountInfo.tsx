import { FC } from "react";
import classes from "../PlacePage.module.css";
import { UserDto } from "../../../helpers/dtos";
import Avatar from "../../../Profile/UI/Avatar";

type PlaceCreatorAccountInfoT = {
  userDto: UserDto;
  alt: string;
};

const PlaceCreatorAccountInfo: FC<PlaceCreatorAccountInfoT> = ({
  userDto,
  alt,
}) => {
  const { username, pictureUrl: userPictureUrl, placeCount, userId } = userDto;

  return (
    <div className={classes["place-creator-account-info"]}>
      <div>
        <Avatar pictureUrl={userPictureUrl} alt={alt} width={"4rem"} />
      </div>

      <div>
        <p>{username}</p>
        <p>
          {placeCount} {placeCount === 1 ? "Place" : "Places"}
        </p>
      </div>
    </div>
  );
};

export default PlaceCreatorAccountInfo;
