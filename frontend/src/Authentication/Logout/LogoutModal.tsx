import { useHistory } from "react-router-dom";
import MessageModal from "../../shared-UI/MessageModal";
import Button from "../../shared-UI/Button";
import useRequiredAuthContext from "../../hooks/use-required-authContext";
import { useEffect } from "react";

const LogoutModal = () => {
  const history = useHistory();
  const authContext = useRequiredAuthContext();

  if (!authContext.isLoggedin)
    throw new Error("User most be logged in to be able to logout");

  const logoutClient = async () => {
    await authContext.logout();
    history.replace("/");
  };

  const handleKeyPress = async (event: KeyboardEvent) => {
    switch (event.key) {
      case "Enter":
        await logoutClient();
        break;
      case "Escape":
        closeLogoutModal();
        break;
    }
  };

  useEffect(() => {
    window.addEventListener("keydown", handleKeyPress);
    // window.addEventListener("click", () => {});

    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const logoutClickHandler = async (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    await logoutClient();
  };

  const cancelLogoutHandler = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    closeLogoutModal();
  };

  const closeLogoutModal = () => {
    history.replace("/");
  };

  return (
    <MessageModal message={"Do you want to log out?"}>
      <Button onClick={logoutClickHandler} action={"submit"}>
        Logout
      </Button>
      <Button onClick={cancelLogoutHandler} action={"cancel"}>
        Cancel
      </Button>
    </MessageModal>
  );
};

export default LogoutModal;
