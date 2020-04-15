const winston = require("winston");
const { createLogger, format, transports } = winston;

const logger = createLogger({
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console({
      format: format.combine(
        format.timestamp(),
        format.colorize(),
        format.simple()
      ),
    }),
  ],
});

module.exports = logger;
