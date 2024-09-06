import { Application } from "express";
import { verifyToken } from "../authentication/auth";
import { CommentAction, NotificationDto } from "../shared/dtos";
import { Server, Socket } from "socket.io";
import { ServiceName } from "./services-names";
import http = require("http");

interface ServerToClientEvents {
  "userId-inquiry": () => void;
  connected: () => void;
  "invalid-token": () => void;
  "place-received-comment": (notification: NotificationDto) => void;
  "comment-replied": (notification: NotificationDto) => void;
  "comment-liked": (notification: NotificationDto) => void;
}

interface ClientToServerEvents {
  announce: ({ token }: { token: string }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  name: string;
  age: number;
}

export type WSServer = Server<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export type WSSocket = Socket<
  ClientToServerEvents,
  ServerToClientEvents,
  InterServerEvents,
  SocketData
>;

export const clientHandler = (
  client: Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
): void => {
  console.log("Connection established");
  console.log("id: ", client.id);

  // client.on("announce", ({ name }) => {
  //   console.log(`It's name is ${name}`);

  //   client.emit("welcome", { message: `Welcome ${name}` });
  // });

  // client.on("send-message", (message, to) => {
  //   // this is going to send message to all users exept this client
  //   // kind of public message
  //   client.broadcast.emit("new-message", { message });

  //   // this is going to send message just for 'to' which is some users id
  //   // kind of private message
  //   client.to(to).emit("new-message", { message });
  // });

  //   client.emit("name-inquiry");
  //   client.emit("you-have-new-comment", not);
  //   client.emit("new-reply-to-your-comment", not);
  //   client.emit("somebody-likes-your-comment", not);

  client.on("disconnect", () => {
    client.disconnect();
    console.log("disconected");
  });
};

const validateSocketHandshakerToken = (socket: WSSocket): Promise<boolean> => {
  return new Promise((resolve) => {
    socket.emit("userId-inquiry");

    socket.on("announce", ({ token }) => {
      const decodedToken = verifyToken(token);
      if (!decodedToken) {
        resolve(false);
        return;
      }
      socket.join(decodedToken.userId);
      resolve(true);
    });
  });
};

export const getWSServer = (app: Application): WSServer => {
  return app.get(ServiceName.WS);
};

export const configureWebSocket = (server: http.Server, app: Application) => {
  const ws: WSServer = new Server(server, {
    cors: {
      origin: ["http://192.168.1.13:3000", "https://admin.socket.io"],
    },
  });

  app.set(ServiceName.WS, ws);

  ws.on("connection", async (socket) => {
    console.log("Connection established");
    const validUser = await validateSocketHandshakerToken(socket);
    if (validUser) {
      socket.emit("connected");
      console.log("Valid token, socket connected");
    } else {
      console.log("Invalid token, can not connec socket");
      socket.emit("invalid-token");
      socket.disconnect();
    }
  });
};
