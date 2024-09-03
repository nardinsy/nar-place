import { useContext } from "react";
import WebSocketContext from "../contexts/websocket-context";

const useRequiredSocketContext = () => {
  const socketContext = useContext(WebSocketContext);

  if (!socketContext) {
    throw new Error(
      "useSocketContext has to be used within <SocketContext.Provider>"
    );
  }

  return socketContext;
};

export default useRequiredSocketContext;
