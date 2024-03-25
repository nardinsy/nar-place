const expressAuth = require("./lib/express-auth");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

const placesRoutes = require("./routes/places-authed-route");
const usersRoutes = require("./routes/users-authed-route");
const { configureCORS } = require("./cors");
const { createHttpError } = require("./models/createHttpError");

const app = expressAuth();

// Add headers before the routes are defined
app.use(configureCORS);

// //To accept larger data
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use(bodyParser.json());

app.use("/api/places", placesRoutes);

app.use("/api/users", usersRoutes);

//Could not find route
app.use((req, res, n0ext) => {
  const error = createHttpError("Could not find this route.", 404);
  throw error;
});

// Express will apply this middleware on every incoming request
// will only be executed on requests that have an error atached to it
app.use((error, req, res, next) => {
  // if respense has already been sent, if that is the case we want to return next and forward the error,
  // and we don't sent response on our own
  if (res.headerSent) {
    return next(error);
  }

  console.log("Last errorHandler midelware", error);
  res.status(error.code || 500);
  res.json({ message: error.message || "An unknow error" });
});

// Define the database URL to connect to.
const mongoDB = "mongodb://127.0.0.1:27017/mern";

mongoose
  .connect(mongoDB)
  .then(() => {
    app.listen(5000);
  })
  .catch((error) => {
    console.log(error);
  });
