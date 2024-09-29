import { useContext } from "react";
import LocalBackendContex from "../local-storage/local-backend-service-context";

const useRequiredLocalBackendContext = () => {
  const localBackendCtx = useContext(LocalBackendContex);

  if (!localBackendCtx) {
    throw new Error(
      "localBackendContext has to be used within <LocalBackendContex.Provider>"
    );
  }

  return localBackendCtx;
};

export default useRequiredLocalBackendContext;
