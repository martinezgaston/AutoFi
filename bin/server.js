#!/usr/bin/env node

let app = require("../app");
let cors = require("cors");
require("dotenv").config();
const logger = require('../src/utils/logger')

//TOOD filter cors routes
app.use(cors());

let server = app.listen(app.get("port"), onListening);

function onError(error) {
  if (error.syscall !== "listen") {
    throw error;
  }

  let bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case "EACCES":
      logger.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      logger.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  let addr = server.address();
  let bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  logger.info("Listening on " + bind);
}

module.exports = server;
