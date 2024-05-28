import { ReactNode, createContext } from "react";
import { ToastServer, ToastService, ToastType } from "../services/toast";

class ToastServiceImpl implements ToastService {
  private servers: ToastServer[] = [];

  registerToastServer(server: ToastServer): void {
    this.servers.push(server);
  }

  unregisterToastServer(server: ToastServer): void {
    this.servers = this.servers.filter((x) => x !== server);
  }

  show(message: string, type: ToastType) {
    this.servers.forEach((server) => server.show(message, type));
  }

  showSuccess(message: string): void {
    this.show(message, ToastType.success);
  }

  showError(message: string): void {
    this.show(message, ToastType.error);
  }
}

export const ToastServiceContext = createContext<ToastService | undefined>(
  undefined
);

export const ToastServiceContexProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const toastService = new ToastServiceImpl();

  const showSuccess = (message: string) => {
    toastService.showSuccess(message);
  };

  const showError = (message: string) => {
    toastService.showError(message);
  };

  const registerToastServer = (server: ToastServer) => {
    toastService.registerToastServer(server);
  };

  const unregisterToastServer = (server: ToastServer) => {
    toastService.unregisterToastServer(server);
  };

  return (
    <ToastServiceContext.Provider
      value={{
        registerToastServer,
        unregisterToastServer,
        showSuccess,
        showError,
      }}
    >
      {children}
    </ToastServiceContext.Provider>
  );
};
