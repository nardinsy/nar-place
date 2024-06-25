import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import classes from "./MenuButtonIcon.module.css";
import Avatar from "../../Profile/UI/Avatar";
import useRequiredAuthContext from "../../hooks/use-required-authContext";

const MenuButtonIcon = () => {
  const authContext = useRequiredAuthContext();

  return (
    <>
      {authContext.isLoggedin ? (
        <Avatar
          pictureUrl={authContext.userPictureUrl}
          alt={authContext.username}
          width={"50px"}
        />
      ) : (
        <FontAwesomeIcon
          data-testid="icon"
          icon={faCircleUser}
          className={classes.avatar}
        />
      )}
    </>
  );
};

export default MenuButtonIcon;
