import winston from "winston";

/**
 * Winston Logger instance
 *
 * Minimum log level is configured based on environment
 *
 * @type {Logger}
 */
const logger = winston.createLogger({
  level: process.env.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.simple(),
  transports: [new winston.transports.Console()],
});

export default logger;
