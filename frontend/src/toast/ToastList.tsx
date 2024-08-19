import { useEffect, useState, useCallback } from "react";
import useRequiredToastContext from "../hooks/use-required-toastContext";
import { ToastServer, ToastService, ToastType } from "../services/toast";
import ToastItem from "./ToastItem";

export type Toast = {
  type: ToastType;
  message: string;
  id: string;
};

class ToastServerImpl implements ToastServer {
  constructor(
    private setToasts: React.Dispatch<React.SetStateAction<Toast[]>>
  ) {}

  private createToastInfo(type: ToastType, message: string): Toast {
    const id = String(Math.random());

    return {
      id,
      type,
      message,
    } as Toast;
  }

  show(message: string, type: ToastType): void {
    const toast = this.createToastInfo(type, message);
    this.setToasts((pre) => (pre ? [...pre, toast] : [toast]));
  }
}

const ToastList = () => {
  const toastCtx: ToastService = useRequiredToastContext();
  const [toasts, setToasts] = useState<Toast[]>([]);

  useEffect(() => {
    const server = new ToastServerImpl(setToasts);
    toastCtx.registerToastServer(server);

    return () => {
      toastCtx.unregisterToastServer(server);
    };
  }, [toastCtx]);

  const deleteToast = useCallback((id: string) => {
    setToasts((pre) => pre.filter((toast) => toast.id !== id));
  }, []);

  const toastElemens = toasts.map((toast) => {
    return <ToastItem toast={toast} key={toast.id} onDelete={deleteToast} />;
  });

  if (toasts.length === 0) return <></>;

  return (
    <ul className="fixed bottom-4 right-4 flex flex-col flex-wrap items-end z-[120]">
      {toastElemens}
    </ul>
  );
};

export default ToastList;
