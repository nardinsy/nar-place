import { io, Socket } from "socket.io-client";
import { NotificationDto } from "../helpers/dtos";

const WS_URL = "http://192.168.1.13:5000";

type OnRecieveNotification = (recievedNotification: NotificationDto) => void;

interface ServerToClientEvents {
  noArg: () => void;
  "name-inquiry": () => void;
  "you-have-new-comment": (notification: NotificationDto) => void;
  "new-reply-to-your-comment": (notification: NotificationDto) => void;
  "somebody-likes-your-comment": (notification: NotificationDto) => void;
}

interface ClientToServerEvents {
  hello: () => void;
  announce: ({ name }: { name: string }) => void;
  disconnect: () => void;
  // "admin-add-new-comment": NotificationDto;
  // "admin-reply-to-comment": NotificationDto;
  // "admin-likes-comment": NotificationDto;
}

export interface WebSocketService {
  // connect: () => void;
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
    this._socket.connect();
  }

  // connect() {
  //   this._socket.connect();
  //   console.log("socket was connected");
  // }

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
