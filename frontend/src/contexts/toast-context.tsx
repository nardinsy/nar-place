import { ReactNode, createContext, useState } from "react";

export type ToastTypes = "success" | "error";

export type Toast = {
  type: ToastTypes;
  message: string;
  id: string;
  timer: NodeJS.Timeout;
};

type ToastContexT = {
  toasts: Toast[] | undefined;
  addToast: (toast: { id: string; type: ToastTypes; message: string }) => void;
  closeToast: (e: React.MouseEvent<HTMLElement>) => void;
};

export const ToastContext = createContext<ToastContexT | undefined>(undefined);

export const ToastContexProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[] | undefined>(undefined);

  const addToast = (toast: {
    id: string;
    type: ToastTypes;
    message: string;
  }) => {
    const timer = setTimeout(() => {
      const id = toast.id;
      const deletedToastList = toasts?.filter((toast) => toast.id !== id);
      setToasts(deletedToastList);
      clearTimeout(timer);
    }, 5000);

    const newToast: Toast = {
      id: toast.id,
      type: toast.type,
      message: toast.message,
      timer,
    };

    setToasts((pre) => (pre ? [...pre, newToast] : [newToast]));
  };

  const closeToast = (e: React.MouseEvent<HTMLElement>) => {
    const id = e.currentTarget.closest("li")?.id;
    if (!toasts) return;

    const currentToast = toasts.find((toast) => toast.id === id);
    if (currentToast) {
      clearTimeout(currentToast.timer);
    }

    const deletedToastList = toasts.filter((toast) => toast.id !== id);
    setToasts(deletedToastList);
  };

  return (
    <ToastContext.Provider value={{ toasts, addToast, closeToast }}>
      {children}
    </ToastContext.Provider>
  );
};

// [
//   { type: "success", message: "done", id: "1", timer: undefined },
//   {
//     type: "success",
//     message: "dons av a   sssss ssssse",
//     id: "2",
//     timer: undefined,
//   },
//   { type: "error", message: "donadvsaa adve", id: "3", timer: undefined },
//   { type: "success", message: "don aa  afgr sfe", id: "4", timer: undefined },
//   {
//     type: "error",
//     message: "do afb fbabafb rabaaaafgrba abab ne",
//     id: "5",
//     timer: undefined,
//   },
// ]
