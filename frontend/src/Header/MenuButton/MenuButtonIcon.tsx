import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import classes from "./MenuButtonIcon.module.css";
import Avatar from "../../Profile/UI/Avatar";
import AuthContext from "../../store/auth-context";

const MenuButtonIcon = ({ isLoggedin }: { isLoggedin: boolean }) => {
  const authContext = useContext(AuthContext);

  return (
    <>
      {isLoggedin ? (
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
