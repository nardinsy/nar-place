import { useContext } from "react";
import { ToastServiceContext } from "../contexts/toast-service-context";

const useRequiredToastContext = () => {
  const toastCtx = useContext(ToastServiceContext);

  if (!toastCtx) {
    throw new Error(
      "useAuthContext has to be used within <ToastContext.Provider>"
    );
  }

  return toastCtx;
};

export default useRequiredToastContext;
