import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserDto, PlaceDto } from "../../helpers/dtos";
import classes from "./PlacePage.module.css";
import PlaceImage from "./components/PlaceImage";
import PlaceInfo from "./components/PlaceInfo";
import PlaceCreatorAccountInfo from "./components/PlaceCreatorAccountInfo";
import FollowButton from "./components/FollowButton";
import CommentInput from "./components/CommentInput";
import CommentContainer from "./components/CommentContainer";
import useRequiredAuthContext from "../../hooks/use-required-authContext";

const PlacePage: FC = () => {
  const authContext = useRequiredAuthContext();

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
        <div className={classes["distance"]}></div>
        <div className={classes.middle}>
          <PlaceInfo placeDto={placeDto} />

          <CommentContainer placeId={placeDto.placeId} />
        </div>

        <div className={classes["comment-scope"]}>
          {authContext.isLoggedin && <CommentInput />}
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
