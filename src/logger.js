const winston = require("winston");
const { createLogger, format, transports } = winston;

const logger = createLogger({
  format: format.combine(
    format.timestamp(),
    format.colorize(),
    format.simple()
  ),
  transports: [
    new transports.Console({
      level: "info",
    }),
  ],
});

module.exports = logger;
