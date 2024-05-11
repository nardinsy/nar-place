import { ReactNode, createContext, useCallback, useState } from "react";

export type ToastTypes = "success" | "error";

export type Toast = {
  type: ToastTypes;
  message: string;
  id: string;
  timer: NodeJS.Timeout;
};

type ToastContexT = {
  toasts: Toast[] | undefined;
  addToast: (type: ToastTypes, message: string) => void;
  closeToast: (e: React.MouseEvent<HTMLElement>) => void;
};

export const ToastContext = createContext<ToastContexT | undefined>(undefined);

export const ToastContexProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<Toast[] | undefined>(undefined);

  const generateToastObject = useCallback(
    (type: ToastTypes, message: string) => {
      const id = String(Math.random());

      const timer = setTimeout(() => {
        const deletedToastList = toasts?.filter((toast) => toast.id !== id);
        setToasts(deletedToastList);
        clearTimeout(timer);
      }, 5000);

      return {
        id,
        type,
        message,
        timer,
      } as Toast;
    },
    []
  );

  const addToast = (type: ToastTypes, message: string) => {
    const toast = generateToastObject(type, message);
    setToasts((pre) => (pre ? [...pre, toast] : [toast]));
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
