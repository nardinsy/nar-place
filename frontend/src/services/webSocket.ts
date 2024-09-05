import { io, Socket } from "socket.io-client";
import { NotificationDto } from "../helpers/dtos";

const WS_URL = "http://192.168.1.13:5000";

type OnRecieveNotification = (recievedNotification: NotificationDto) => void;

export interface ServerToClientEvents {
  "userId-inquiry": () => void;
  connected: () => void;
  "invalid-token": () => void;
  "you-have-new-comment": (notification: NotificationDto) => void;
  "new-reply-to-your-comment": (notification: NotificationDto) => void;
  "somebody-likes-your-comment": (notification: NotificationDto) => void;
}

interface ClientToServerEvents {
  announce: ({ token }: { token: string }) => void;
  // "admin-add-new-comment": NotificationDto;
  // "admin-reply-to-comment": NotificationDto;
  // "admin-likes-comment": NotificationDto;
}

export interface WebSocketService {
  connect: (token: string) => Promise<boolean>;
  welcome: () => void;
  close: () => void;
  listenToCommentNotifications: (callback: OnRecieveNotification) => void;
}

class WebSocketImpl implements WebSocketService {
  protected _socket: Socket<ServerToClientEvents, ClientToServerEvents>;

  constructor() {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(
      WS_URL,
      {
        autoConnect: false,
      }
    );
    this._socket = socket;
    // this._socket.connect();
  }

  connect(token: string): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this._socket.connect();

      this._socket.on("userId-inquiry", () => {
        this._socket.emit("announce", { token });
      });

      this._socket.on("connected", () => {
        console.log("Connect to socket successfully");
        resolve(true);
      });

      this._socket.on("invalid-token", () => {
        resolve(false);
      });
    });

    // this._socket.connect();
    // this._socket.on("userId-inquiry", () => {
    //   this._socket.emit("announce", { userId, token });
    // });
    // this._socket.on("connected", () => {
    //   console.log("Connect to socket successfully");
    // });
  }

  welcome() {
    // this._socket.on("name-inquiry", () => {
    //   console.log("He asked my name");
    //   this._socket.emit("announce", { name: "Nardin" });
    // });
  }

  close() {
    this._socket.close();
  }

  listenToCommentNotifications(
    onRecieveNewNotificationCallback: (
      recievedNotification: NotificationDto
    ) => void
  ) {
    // const socket = io(WS_URL, {
    //   autoConnect: false,
    // });
    // socket.connect();

    this._socket.on("you-have-new-comment", (notification) => {
      console.log(notification);
      onRecieveNewNotificationCallback(notification);
    });

    this._socket.on("new-reply-to-your-comment", (notification) => {
      console.log(notification);
      onRecieveNewNotificationCallback(notification);
    });

    this._socket.on("somebody-likes-your-comment", (notification) => {
      console.log(notification);
      onRecieveNewNotificationCallback(notification);
    });
  }
}

export const connectWebSocket = (): WebSocketService => {
  return new WebSocketImpl();
};
