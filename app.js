const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const { NotFound } = require("./src/utils/errors");

const bodyparser = require("body-parser");

const allRoutes = require("./src/api/routes");
const mongoDbManager = require("./src/db/mongoInMemory");

const logger = require("./src/utils/logger");
require("dotenv").config();
global.__basedir = __dirname;
const app = express();

let host_ip = process.env.HOST_IP || "0.0.0.0";
let port = normalizePort(process.env.PORT || "3001");
app.set("port", port);
app.set("host_ip", host_ip);

app.use(morgan("dev"));
app.use(bodyparser.json());

app.use(cors());

//mount routes when the db started correctly
mongoDbManager
  .start()
  .then((_) => {
    app.use("/",allRoutes);

    // 404
    app.use(function (req, res, next) {
      next(new NotFound({}));
    });

    // error handler
    app.use(function (err, req, res, next) {
      logger.error("[Server error handler] ", err);

      // set locals, only providing error in development
      res.locals.message = err.message;
      res.locals.error = process.env.ENV === "development" ? err : {};

      err.statusCode ? err.statusCode : 500; //500 default, server error not cached

      res.status(err.statusCode).send(normalizeErrorResponse(err));
    });

    app.emit("dbConnected"); // DB Connected
  })
  .catch((error) => {
    // if db connection fails - return 503 for every request
    console.log(`DB connection failed.`);
    app.use((req, res, next) => {
      const error = new Error("Service unavailable");
      error.statusCode = 503;
      error.name = err.name;
      next(error);
    });
  });

module.exports = app;

function normalizeErrorResponse(err) {
  return { description: err.message };
}

function normalizePort(val) {
  let port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}
