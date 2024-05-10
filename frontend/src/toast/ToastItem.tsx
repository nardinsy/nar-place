import classes from "./Toast.module.css";
import { Toast } from "../contexts/toast-context";
import ToastIcon from "./ToastIcon";
import ToastMessage from "./ToastMessage";
import ToastCloseButton from "./ToastCloseButton";

const ToastItem = ({ toast }: { toast: Toast }) => {
  return (
    <li className={classes.toast} id={toast.id} key={toast.id}>
      <ToastIcon type={toast.type} />
      <ToastMessage message={toast.message} />
      <ToastCloseButton />
    </li>
  );
};

export default ToastItem;
