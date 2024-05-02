import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import classes from "./MenuButtonIcon.module.css";
import Avatar from "../../Profile/UI/Avatar";
import useRequireAuthContext from "../../hooks/useRequireAuthContext";

const MenuButtonIcon = () => {
  const authContext = useRequireAuthContext();

  return (
    <>
      {authContext.isLoggedin ? (
        <Avatar
          pictureUrl={authContext.userPictureUrl}
          alt={authContext.username}
          width={"50px"}
        />
      ) : (
        <FontAwesomeIcon icon={faCircleUser} className={classes.avatar} />
      )}
    </>
  );
};

export default MenuButtonIcon;
