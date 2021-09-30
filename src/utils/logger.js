const { createLogger, format, transports, config } = require("winston");
const { ValidationError } = require("./errors");
const { combine, printf, label } = format;
require("dotenv").config();


const timestampFormat = "YYYY-MM-DD HH:mm:SS";
const CONSOLE = 0;

const loggerFormat = printf((info) => {
  return `${info.timestamp} [${info.level}] ${info.message}`;
});
logger = createLogger({
  format: combine(
    label({ label: "ipp" }),
    format.timestamp(timestampFormat),
    format.splat(),
    format.simple(),
    loggerFormat
  ),
  transports: [
    new transports.Console({
      level: process.env.LOG_LEVEL,
      colorized: true,
      timestamp: true,
    }),
  ],
});

logger.logErrorAndInput = function (serviceName, inputObject, errMessage) {
  logger.error(serviceName + " - Message: " + errMessage);
  logger.error("[Input Error] %o", { input: inputObject });
};

logger.changeLogLevel = function (level) {
  try {
    if (
      !["info", "debug", "error", "warn"].includes(
        String(level).toLocaleLowerCase()
      )
    )
      return new ValidationError({});

    logger.transports[CONSOLE].level = level;

    return level;
  } catch (error) {
    return error;
  }
};

logger.getLogLevel = function () {
  return logger.transports[CONSOLE].level;
};

logger.logRequest = async (req, res, next) => {
  logger.debug("Request: %o", { 
    'URL':req.originalUrl,
    headers: req.headers, 
    body: req.body});
  next();
};

module.exports = logger;
