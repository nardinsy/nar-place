const mongoDB = "mongodb://127.0.0.1:27017/mern";
import mongoose from "mongoose";
import expressAuth from "./lib/express-auth";
import { json, urlencoded } from "body-parser";
import placeRouter from "./routes/place-route";
import usersRouter from "./routes/users-authed-route";
import { configureCORS } from "./cors";
import { Server, Socket } from "socket.io";
import { createServer } from "http";
import { configureWebSocket } from "./services/web-socket";
import { instrument } from "@socket.io/admin-ui";

const app = expressAuth();
app.use(configureCORS);

app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true }));

app.use(json());

//test
// app.postAuth(
//   "/testIncludeValidationChin",
//   [check("title").not().isEmpty()],
//   (user, req, res, next) => {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       return next(new Error("Haha"));
//     }
//     console.log("test post ok");
//     res.json({ message: "Test2 ok" });
//   }
// );
//test
// app.get("/testWithTwoParameters", (req, res, next) => {
//   console.log("test post ok");
//   res.json({ message: "Test ok" });
// });

app.use("/api/places", placeRouter);
app.use("/api/users", usersRouter);

// const errorHandler: ErrorRequestHandler = (err, req, res, next) => {
//   console.log("Last errorHandler midelware", err);
//   res.status(err.code || 500);
//   res.json({ message: err.message || "An unknow error" });
// };
// app.use(errorHandler);

mongoose
  .connect(mongoDB)
  .then(() => {
    const server = createServer(app);

    configureWebSocket(server, app);

    server.listen(5000);
    console.log("Running on port 5000");
  })
  .catch((error) => {
    console.log(error);
  });

// mongoose.set("useFindAndModify", false);

// instrument(ws, {
//   namespaceName: "/custom",
// });

// const adminNamespace = ws.of("/admin");

// instrument(ws, { auth: false });

// const PORT = 5000;
// const server = app.listen(PORT, () => {
//   console.log("Listening on port: " + PORT);
// });

// const ws = new Server(server, {
//   cors: {
//     origin: [
//       "https://admin.socket.io",
//       "http://localhost:3000",
//       "http://192.168.1.13:3000",
//     ],
//     credentials: true,
//     // origin: ["http://192.168.1.13:3000", "https://admin.socket.io"],
//   },
// });

// instrument(ws, { auth: false });

// ws.on("connection", (client) => {
//   client.on("disconnect", () => {
//     console.log("🔥: A user disconnected");
//   });

//   console.log("Connection established");
//   console.log("id: ", client.id);

//   client.on("announce", ({ name }) => {
//     console.log(`It's name is ${name}`);

//     client.emit("welcome", { message: `Welcome ${name}` });
//   });

//   client.on("send-message", (message, to) => {
//     // this is going to send message to all users except this client
//     // kind of public message
//     client.broadcast.emit("new-message", { message });

//     // this is going to send message just for 'to' which is some users id
//     // kind of private message
//     client.to(to).emit("new-message", { message });
//   });

//   client.emit("name-inquiry");
// });

// ----- before cleanup

// mongoose
//   .connect(mongoDB)
//   .then(() => {
//     const server = createServer(app);
// const io = new Server(server);
// socketHandler(io);

// const ws = new Server<
//   ClientToServerEvents,
//   ServerToClientEvents,
//   InterServerEvents,
//   SocketData
// >(server, {
//   cors: {
//     origin: ["http://192.168.1.13:3000", "https://admin.socket.io"],
//   },
// });

// app.use(socketHandler.bind(io));
//---- from here
// ws.on("connection", async (socket) => {
//   console.log("Connection established");
//   const validUser = await validateSocketHandshakerToken(socket);
//   if (validUser) {
//     app.set("socketService", socket);
//   } else {
//     socket.emit("invalid-token");
//     socket.disconnect();
//   }
// });
/// to here
// ws.on("connection", (client) => {
//   console.log("Connection established");
//   console.log("id: ", client.id);

//   client.on("announce", ({ name }) => {
//     console.log(`It's name is ${name}`);

//     client.emit("welcome", { message: `Welcome ${name}` });
//   });

//   client.on("send-message", (message, to) => {
//     // this is going to send message to all users exept this client
//     // kind of public message
//     client.broadcast.emit("new-message", { message });

//     // this is going to send message just for 'to' which is some users id
//     // kind of private message
//     client.to(to).emit("new-message", { message });
//   });

//   client.emit("name-inquiry");
//   client.emit("you-have-new-comment", not);
//   client.emit("new-reply-to-your-comment", not);
//   client.emit("somebody-likes-your-comment", not);

//   client.on("disconnect", () => {
//     client.disconnect();
//     console.log("disconected");
//   });
// });

// instrument(ws, { auth: false });

//   server.listen(5000);
//   console.log("Running on port 5000");
// })
// .catch((error) => {
//   console.log(error);
// });
