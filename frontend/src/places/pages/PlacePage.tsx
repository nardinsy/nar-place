import { FC } from "react";
import { useLocation } from "react-router-dom";
import { UserDto, PlaceDto } from "../../helpers/dtos";
import Avatar from "../../Profile/UI/Avatar";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaperPlane,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
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

  const { title, description, address, pictureUrl, creator } = placeDto;
  const { username, pictureUrl: userPictureUrl, placeCount, userId } = userDto;

  const titlelineWidth = 14;
  const descriptionLineWidth = 21;
  const addressLineWidth = 10;

  function wordWrap(str: string, maxWidth: number) {
    let newLineStr = "\n";
    let done = false;
    let res = "";
    while (str.length > maxWidth) {
      let found = false;
      // Inserts new line at first whitespace of the line
      for (let i = maxWidth - 1; i >= 0; i--) {
        if (testWhite(str.charAt(i))) {
          res = res + [str.slice(0, i), newLineStr].join("");
          str = str.slice(i + 1);
          found = true;
          break;
        }
      }
      // Inserts new line at maxWidth position, the word is too long to wrap
      if (!found) {
        res += [str.slice(0, maxWidth), newLineStr].join("");
        str = str.slice(maxWidth);
      }
    }

    return res + str;
  }

  function testWhite(x: string) {
    let white = new RegExp(/^\s$/);
    return white.test(x.charAt(0));
  }

  const oneLineTitle = wordWrap(title, titlelineWidth);
  const oneLineAddress = wordWrap(address, addressLineWidth);
  const wrappedDescription = wordWrap(description, descriptionLineWidth);

  return (
    <div className={classes["place-page-container"]}>
      <div className={classes["place-page-image-container"]}>
        <img src={pictureUrl} alt={title} className={classes["place-image"]} />
      </div>

      <div className={classes["place-page-info-container"]}>
        <div className={classes["place-creator-account-container"]}>
          <div className={classes["place-creator-account-info"]}>
            <div>
              <Avatar pictureUrl={userPictureUrl} alt={title} width={"4rem"} />
            </div>

            <div>
              <p>{username}</p>
              <p>
                {placeCount} {placeCount === 1 ? "Place" : "Places"}
              </p>
            </div>
          </div>

          <div className={classes["place-creator-account_follow_button"]}>
            Follow
          </div>
        </div>

        <div className={classes["place-info"]}>
          <h3>{oneLineTitle}</h3>
          <p>
            <strong>Description:</strong> {wrappedDescription}
          </p>
          <p>
            <strong>Address: </strong>
            {oneLineAddress}
          </p>
          {/* <div>
            <strong>Comments</strong>
            <p>By the title of this post, it might seem that this </p>
            <p>is going to be filled with random text just to fill the page.</p>
            <p>Good</p>
          </div> */}
        </div>

        <div className={classes["comment-container"]}>
          <FontAwesomeIcon icon={faHeart} className={classes["heart-button"]} />

          <input
            type="text"
            placeholder="Add a comment"
            className={classes["comment-input"]}
          ></input>
          <FontAwesomeIcon
            icon={faFaceSmile}
            className={classes["emoji-button"]}
          />
          {/* <div className={classes["place-page-emoji"]}>😀</div> */}
          <FontAwesomeIcon
            icon={faPaperPlane}
            className={classes["send-button"]}
          />
        </div>
      </div>
    </div>
  );
};

export default PlacePage;
