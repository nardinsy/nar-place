import classes from "./Toast.module.css";

const ToastIcon = ({ type }: { type: "success" | "error" }) => {
  const icon = type === "success" ? "✅" : "⛔";
  return <div className={classes["toast-icon"]}>{icon}</div>;
};

export default ToastIcon;
