import { FC, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { UserDto, PlaceDto } from "../../helpers/dtos";
import PlaceImage from "./placePageSubComponents/PlaceImage";
import PlaceInfo from "./placePageSubComponents/PlaceInfo";
import PlaceCreatorAccountInfo from "./placePageSubComponents/PlaceCreatorAccountInfo";
import FollowButton from "./placePageSubComponents/FollowButton";
import CommentBox from "../comment/CommentBox";
import { CommentContextProvider } from "../../contexts/comment-contex";
import classes from "./PlacePage.module.css";

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

  const scrollCommentAreaHandler = (event: any) => {};

  return (
    <div className={classes["place-page-container"]}>
      <PlaceImage src={pictureUrl} alt={title} />

      <div className={classes["place-page-info-container"]}>
        <div className={classes["place-creator-account-container"]}>
          <PlaceCreatorAccountInfo userDto={userDto} alt={title} />
          <FollowButton />
        </div>
        <div className={classes["distance"]}></div>

        <div className={classes.middle} onScroll={scrollCommentAreaHandler}>
          <PlaceInfo placeDto={placeDto} />
          <CommentContextProvider>
            <CommentBox placeId={placeDto.placeId} />
          </CommentContextProvider>
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
