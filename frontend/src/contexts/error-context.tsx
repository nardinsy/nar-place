import { createContext, FC } from "react";
import { HasChildren } from "../helpers/props";

type ErrorContextT = {
  showErrorMessage(message: string): void;
};

export const ErrorContext = createContext<ErrorContextT | undefined>(undefined);

const ErrorContextProvider: FC<HasChildren> = ({ children }) => {
  const showErrorMessage = (message: string) => {
    alert(message);
  };

  const value: ErrorContextT = { showErrorMessage };

  return (
    <ErrorContext.Provider value={value}>{children}</ErrorContext.Provider>
  );
};

export default ErrorContextProvider;
