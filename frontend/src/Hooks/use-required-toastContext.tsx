import { useContext } from "react";
import { ToastContext } from "../contexts/toast-context";

const useRequiredToastContext = () => {
  const toastCtx = useContext(ToastContext);

  if (!toastCtx) {
    throw new Error(
      "useAuthContext has to be used within <ToastContext.Provider>"
    );
  }

  return toastCtx;
};

export default useRequiredToastContext;
