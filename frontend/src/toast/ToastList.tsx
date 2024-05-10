import ToastItem from "./ToastItem";
import classes from "./Toast.module.css";
import useRequiredToastContext from "../hooks/use-required-toastContext";

const ToastList = () => {
  const toastCtx = useRequiredToastContext();

  if (!toastCtx.toasts) return <></>;

  const toasts = toastCtx.toasts.map((toast) => {
    return <ToastItem toast={toast} key={toast.id} />;
  });

  return <ul className={classes.toasts}>{toasts}</ul>;
};

export default ToastList;
