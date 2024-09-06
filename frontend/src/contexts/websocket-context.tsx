import { createContext, FC } from "react";
import { HasChildren } from "../helpers/props";
import { createWebSocket, WebSocketService } from "../services/webSocket";

// export class WebSocketImplWithPharaz {
//   // protected _socket;

//   constructor() {
//     // this._socket = createWebsocketConnection();
//   }

//   connect() {
//     // this._socket.connect();
//     console.log("socket was connected");
//   }

//   test() {
//     const socket = io("http://192.168.1.13:5000", {
//       autoConnect: false,
//     });
//     // const socket = createWebsocketConnection();
//     console.log("Fuck?");
//     socket.connect();

//     socket.on("name-inquiry", () => {
//       console.log("He asked my name");
//       socket.emit("announce", { name: "Nardin" });
//     });
//     socket.on("welcome", ({ message }) => {
//       console.log(message);
//     });

//     socket.on("new-message", ({ message }) => {
//       console.log(message);
//     });
//     const toJustPharazId = "65f70343ec6d2699d66e5bb7";
//     const message = "This is a message for example typed by user";
//     socket.emit("send-message", message, toJustPharazId);

//     socket.onAny((...args: any[]) => {
//       console.log(args);
//     });
//     // socket.onopen = () => {
//     //   console.log("Connection opened");
//     // };
//     // socket.onclose = () => {
//     //   console.log("Connection closed");
//     // };
//   }

//   // connect() {
//   //   this._socket.onopen = () => {
//   //     console.log("WebSocket Client Connected");
//   //   };
//   // }

//   // message() {
//   //   this._socket.onmessage = (message) => {
//   //     console.log(message);
//   //   };
//   // }

//   // error() {
//   //   this._socket.onerror = () => {
//   //     console.log("Connection Error");
//   //   };
//   // }

//   // close() {
//   //   this._socket.close();
//   // }
// }

// class CommentNotificationWebSocket extends WebSocketImplWithPharaz {
//   newCommentRecieved() {
//     // this._socket.emit();
//   }
// }

interface WebSocketContextT {
  socket: WebSocketService;
}

const socket = createWebSocket();
const WebSocketContext = createContext<WebSocketContextT>({ socket });

export const WebSocketContextProvider: FC<HasChildren> = ({ children }) => {
  // socket.connect();
  // const [socket, setSocket] = useState<>(undefined);

  // const authCtx = useRequiredAuthContext();

  // useEffect(() => {
  //   if (authCtx.isLoggedin) {
  //     setSocket(connectedSocket);
  //     console.log("setting socket");
  //   } else {
  //     if (socket) {
  //       socket.close();
  //     }
  //     setSocket(undefined);
  //   }
  // }, []);

  const value: WebSocketContextT = {
    socket,
  };
  return (
    <WebSocketContext.Provider value={value}>
      {children}
    </WebSocketContext.Provider>
  );
};

export default WebSocketContext;
