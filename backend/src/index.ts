const mongoDB = "mongodb://127.0.0.1:27017/mern";
import mongoose from "mongoose";
import expressAuth from "./lib/express-auth";
import { json, urlencoded } from "body-parser";
import placeRouter from "./routes/place-route";
import usersRouter from "./routes/users-authed-route";
import { configureCORS } from "./cors";

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
    app.listen(5000);
    console.log("Running on port 5000");
  })
  .catch((error) => {
    console.log(error);
  });
