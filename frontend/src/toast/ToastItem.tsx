import classes from "./Toast.module.css";
import { memo, useEffect } from "react";
import { Toast } from "./ToastList";
import { ToastType } from "../services/toast";

const ToastItem = memo(
  ({ toast, onDelete }: { toast: Toast; onDelete: (id: string) => any }) => {
    useEffect(() => {
      const timerId = setTimeout(() => {
        onDelete(toast.id);
      }, 8000);

      return () => clearTimeout(timerId);
    }, []);

    const closeToastHandler = (e: React.MouseEvent<HTMLElement>) => {
      e.preventDefault();
      onDelete(toast.id);
    };

    return (
      <li className={classes.toast} id={toast.id} key={toast.id}>
        {/* <div>{Math.floor(Math.random() * (100) + 1)}</div> */}
        <div className={classes["toast-icon"]}>
          {toast.type === ToastType.success ? "✅" : "⛔"}
        </div>
        <div>{toast.message}</div>
        <button
          onClick={closeToastHandler}
          className={classes["toast-close-btn"]}
        >
          {"\u{2715}"}
        </button>
      </li>
    );
  }
);

export default ToastItem;
