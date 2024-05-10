import { ToastTypes } from "../contexts/toast-context";

export const generateToastObject = (type: ToastTypes, message: string) => {
  return {
    id: String(Math.random()),
    type,
    message,
  };
};
