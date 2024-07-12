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

  const content = pictureUrl ? (
    <img
      data-testid="image"
      src={pictureUrl}
      alt={alt}
      style={{ width, height: width }}
      className={`${classes["avatar-img"]} ${cssClassName}`}
      loading="lazy"
    />
  ) : (
    <FontAwesomeIcon
      data-testid="no-image"
      icon={faCircleUser}
      className={classes.avatar}
      style={{ width, height: width }}
    />
  );

  return <div className={`${classes.avatar} ${cssClassName}`}>{content}</div>;
};

export default Avatar;
