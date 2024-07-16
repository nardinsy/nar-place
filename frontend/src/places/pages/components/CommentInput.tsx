import { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHeart,
  faPaperPlane,
  faFaceSmile,
} from "@fortawesome/free-solid-svg-icons";
import classes from "../PlacePage.module.css";

const Comment: FC = () => {
  return (
    <div className={classes["comment-container"]}>
      <FontAwesomeIcon icon={faHeart} className={classes["heart-button"]} />

      <input
        type="text"
        placeholder="Add a comment"
        className={classes["comment-input"]}
      />
      <FontAwesomeIcon icon={faFaceSmile} className={classes["emoji-button"]} />
      {/* <div className={classes["place-page-emoji"]}>😀</div> */}
      <FontAwesomeIcon icon={faPaperPlane} className={classes["send-button"]} />
    </div>
  );
};

export default Comment;
