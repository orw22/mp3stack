import winston from "winston";
const { combine, timestamp, printf } = winston.format;

/**
 * Winston Logger instance
 * @type {Logger}
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: combine(
    timestamp(),
    printf(({ timestamp, level, message, stack }) => {
      return `${timestamp} [${level}] - ${message} ${stack ? "\n" + stack : ""}`;
    })
  ),
  transports: [new winston.transports.Console()],
});

export default logger;
