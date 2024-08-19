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
      <li
        className="w-fit flex flex-row items-center p-4 mb-2 rounded-md bg-white text-gray shadow-default animate-sideways"
        id={toast.id}
        key={toast.id}
      >
        {/* <div>{Math.floor(Math.random() * (100) + 1)}</div> */}
        <div className="py-0 px-4">
          {toast.type === ToastType.success ? "✅" : "⛔"}
        </div>
        <div>{toast.message}</div>
        <button
          onClick={closeToastHandler}
          className="border-none rounded-full py-2 px-4 bg-white cursor-pointer hover:text-red-heart"
        >
          {"\u{2715}"}
        </button>
      </li>
    );
  }
);

export default ToastItem;
