import { useContext } from "react";
import { useHistory } from "react-router-dom";
import MessageModal from "../../Shared-UI/MessageModal";
import AuthContext from "../../store/auth-context";
import Button from "../../Shared-UI/Button";

const LogoutModal = (props) => {
  const history = useHistory();
  const authContext = useContext(AuthContext);
  if (!authContext)
    throw new Error(
      "Auth context is not provided, Please wrap component with AuthContextProvider"
    );

  if (!authContext.isLoggedin)
    throw new Error("User most be logged in to be able to logout");

  const logoutClient = async (event) => {
    event.preventDefault();
    event.stopPropagation();
    await authContext.logout();
    history.replace("/");
  };

  const cancelLogoutHandler = (event) => {
    event.preventDefault();
    event.stopPropagation();
    history.replace("/");
  };

  return (
    <MessageModal message={"Do you want to log out?"}>
      <Button onClick={logoutClient} action={"submit"}>
        Logout
      </Button>
      <Button onClick={cancelLogoutHandler} action={"cancel"}>
        Cancel
      </Button>
    </MessageModal>
  );
};

export default LogoutModal;
