import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import classes from "./Avatar.module.css";

const Avatar = ({
  cssClassName,
  pictureUrl,
  alt,
  width,
}: {
  cssClassName?: string;
  pictureUrl: string | undefined;
  alt: string | undefined;
  width: string;
}) => {
  //if pictureUrl is not undefined but it is not valid url, then what?

  let content;
  const x = () => {
    content = (
      <FontAwesomeIcon
        icon={faCircleUser}
        className={classes.avatar}
        style={{ width: width, height: width }}
      />
    );
  };
  // let content;

  if (!pictureUrl) {
    content = (
      <FontAwesomeIcon
        icon={faCircleUser}
        className={classes.avatar}
        style={{ width: width, height: width }}
      />
    );
  } else {
    content = (
      <img
        src={pictureUrl}
        alt={alt}
        style={{ width: width, height: width }}
        className={`${classes["avatar-img"]} ${cssClassName}`}
      />
    );
  }

  // console.log("Avatar content: ", content);

  return <div className={`${classes.avatar} ${cssClassName}`}>{content}</div>;
};

export default Avatar;
