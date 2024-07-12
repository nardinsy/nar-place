import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserDto, PlaceDto } from "../../helpers/dtos";
import classes from "./PlacePage.module.css";
import PlaceImage from "./components/PlaceImage";
import PlaceInfo from "./components/PlaceInfo";
import PlaceCreatorAccountInfo from "./components/PlaceCreatorAccountInfo";
import FollowButton from "./components/FollowButton";
import Comment from "./components/Comment";

const PlacePage: FC = () => {
  const {
    state,
  }: {
    state: {
      placeDto: PlaceDto;
      userDto: UserDto;
    };
  } = useLocation();
  const { placeDto, userDto } = state;

  const { title, pictureUrl } = placeDto;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className={classes["place-page-container"]}>
      <PlaceImage src={pictureUrl} alt={title} />

      <div className={classes["place-page-info-container"]}>
        <div className={classes["place-creator-account-container"]}>
          <PlaceCreatorAccountInfo userDto={userDto} alt={title} />
          <FollowButton />
        </div>
        <PlaceInfo placeDto={placeDto} />
        <Comment />
      </div>
    </div>
  );
};

export default PlacePage;
