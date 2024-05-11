import { ToastTypes } from "../contexts/toast-context";
import classes from "./Toast.module.css";

const ToastIcon = ({ type }: { type: ToastTypes }) => {
  const icon = type === "success" ? "✅" : "⛔";
  return <div className={classes["toast-icon"]}>{icon}</div>;
};

export default ToastIcon;
