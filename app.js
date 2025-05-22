const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const morgan = require("morgan");
dotenv.config();
const connectMongoDB = require("./init/mongodb");
const {
  authRoute,
  categoryRoute,
  fileRoute,
  postRoute,
  commentRoute,
} = require("./routes");
const { errorHandler } = require("./middlewares");
const notFound = require("./controllers/notFound");

// initliaze app
const app = express();

// connecting database
connectMongoDB();

// third party middleware
app.use(express.json({ limit: "500mb" }));
app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
// app.use(bodyParser.json({ limit: "500mb" }));
// app.use(bodyParser.urlencoded({ limit: "500mb", extended: true }));
app.use(morgan("dev"));

// routes section
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/category", categoryRoute);
app.use("/api/v1/file", fileRoute);
app.use("/api/v1/posts", postRoute);
app.use("/api/v1/comments", commentRoute);

// not found route
app.use(notFound);

// error handling middleware
app.use(errorHandler);

module.exports = app;
