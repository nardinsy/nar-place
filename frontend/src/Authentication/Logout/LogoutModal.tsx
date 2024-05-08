import { useHistory } from "react-router-dom";
import MessageModal from "../../shared-UI/MessageModal";
import Button from "../../shared-UI/Button";
import useRequiredAuthContext from "../../hooks/use-required-authContext";

const LogoutModal = () => {
  const history = useHistory();
  const authContext = useRequiredAuthContext();

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
