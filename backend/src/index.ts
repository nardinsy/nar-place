const mongoDB = "mongodb://127.0.0.1:27017/mern";
import mongoose from "mongoose";
import expressAuth from "./lib/express-auth";
import { json, urlencoded } from "body-parser";
import placeRouter from "./routes/place-route";
import usersRouter from "./routes/users-authed-route";
import { configureCORS } from "./cors";
import { createServer } from "http";
import { configureWebSocket } from "./services/web-socket";

const app = expressAuth();
app.use(configureCORS);

app.use(json({ limit: "50mb" }));
app.use(urlencoded({ limit: "50mb", extended: true }));

app.use(json());

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
