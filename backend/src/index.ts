const mongoDB = "mongodb://127.0.0.1:27017/mern";
import mongoose from "mongoose";
import expressAuth from "./lib/express-auth";
import { json, urlencoded } from "body-parser";
import placeRouter from "./routes/place-route";
import usersRouter from "./routes/users-authed-route";
import { configureCORS } from "./cors";
import { Server } from "socket.io";
import { WebSocket } from "ws";
import { createServer } from "http";
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

// Create an HTTP server and a WebSocket server
// Initialize WebSocket server

// const wss = new WebSocket.Server({ port: 8080 });

// WebSocket event handling
// wss.on("connection", (ws) => {
//   console.log("A new client connected.");

//   // Event listener for incoming messages
//   ws.on("message", (message) => {
//     console.log("Received message:", message.toString());

//     // Broadcast the message to all connected clients
//     wss.clients.forEach((client) => {
//       if (client.readyState === WebSocket.OPEN) {
//         client.send(message.toString());
//       }
//     });
//   });

//   // Event listener for client disconnection
//   ws.on("close", () => {
//     console.log("A client disconnected.");
//   });
// });

// const CONNECTION_URL = mongoDB;

mongoose
  .connect(mongoDB)
  // .then(() => server)
  .then(() => {
    const server = createServer(app);

    const ws = new Server(server, {
      cors: {
        origin: ["http://192.168.1.13:3000", "https://admin.socket.io"],
      },
    });

    ws.on("connection", (client) => {
      console.log("Connection established");
      console.log("id: ", client.id);

      client.on("announce", ({ name }) => {
        console.log(`It's name is ${name}`);

        client.emit("welcome", { message: `Welcome ${name}` });
      });

      client.on("send-message", (message, to) => {
        // this is going to send message to all users exept this client
        // kind of public message
        client.broadcast.emit("new-message", { message });

        // this is going to send message just for 'to' which is some users id
        // kind of private message
        client.to(to).emit("new-message", { message });
      });

      client.emit("name-inquiry");
      client.emit("you-have-new-comment", not);
      client.emit("new-reply-to-your-comment", not);
      client.emit("somebody-likes-your-comment", not);

      client.on("disconnect", () => {
        client.disconnect();
        console.log("disconected");
      });
    });

    // instrument(ws, { auth: false });

    server.listen(5000);
    console.log("Running on port 5000");
  })
  .catch((error) => {
    console.log(error);
  });

let not = {
  kind: "Comment",
  from: {
    userId: "65f9252ffab99b539ad85e84",
    username: "Nar",
    pictureUrl: "users/profile-picture/65f9253ffab99b539ad85e8b",
    placeCount: "11",
  },
  commentContent: {
    placeId: "65f700dae771ff3a4ddababd",
    commentId: "66c73826dbbbbff5158fd3df",
    action: "3",
  },
};

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
//     // this is going to send message to all users exept this client
//     // kind of public message
//     client.broadcast.emit("new-message", { message });

//     // this is going to send message just for 'to' which is some users id
//     // kind of private message
//     client.to(to).emit("new-message", { message });
//   });

//   client.emit("name-inquiry");
// });
