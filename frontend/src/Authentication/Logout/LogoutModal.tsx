import { useHistory } from "react-router-dom";
import MessageModal from "../../Shared-UI/MessageModal";
import Button from "../../Shared-UI/Button";
import useRequireAuthContext from "../../Hooks/useRequireAuthContext";

const LogoutModal = () => {
  const history = useHistory();
  const authContext = useRequireAuthContext();

  if (!authContext.isLoggedin)
    throw new Error("User most be logged in to be able to logout");

  const logoutClient = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await authContext.logout();
    history.replace("/");
  };

  const cancelLogoutHandler = (event: MouseEvent) => {
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
