import { useContext } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleUser } from "@fortawesome/free-solid-svg-icons";
import classes from "./MenuButtonIcon.module.css";
import Avatar from "../../Profile/UI/Avatar";
import AuthContext from "../../store/auth-context";

const MenuButtonIcon = () => {
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error(
      "Auth context is not provided, Please wrap component with AuthContextProvider"
    );

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
