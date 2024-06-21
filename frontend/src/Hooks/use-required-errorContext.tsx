import { useContext } from "react";
import { ErrorContext } from "../contexts/error-context";

const useRequiredErrorContext = () => {
  const errorCtx = useContext(ErrorContext);

  if (!errorCtx) {
    throw new Error(
      "useErrorContext has to be used within <ErrorContext.Provider>"
    );
  }

  return errorCtx;
};

export default useRequiredErrorContext;
