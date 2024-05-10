import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import classes from "./Toast.module.css";
import useRequiredToastContext from "../hooks/use-required-toastContext";

const ToastCloseButton = () => {
  const toastCtx = useRequiredToastContext();

  const closeToastHandler = (e: React.MouseEvent<HTMLElement>) => {
    toastCtx.closeToast(e);
    // e.currentTarget.closest("li")?.classList.add(classes.disable);
  };
  return (
    <button onClick={closeToastHandler} className={classes["toast-close-btn"]}>
      <FontAwesomeIcon icon={faX} />
    </button>
  );
};

export default ToastCloseButton;
