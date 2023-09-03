import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import logger from "./logger";

/**
 * Middleware for handling errors and sending appropriate HTTP responses.
 *
 * This middleware is responsible for catching and processing various types of errors
 * that may occur during the request processing pipeline. It categorizes errors into
 * different cases, such as HttpError, mongoose validation errors, mongoose cast errors,
 * and MongoDB server errors, and sends the appropriate HTTP response with error messages.
 * If an unhandled error is encountered, it logs the error and sends a generic 500 Internal
 * Server Error response.
 *
 * @param err - The error thrown during request processing
 * @param res - The response object
 */
const errorHandler = (
  err: Error,
  _: Request,
  res: Response,
  __: NextFunction
): void => {
  if (err instanceof HttpError) {
    res.status(err.status || 500).send({ message: err.message });
  } else if (err instanceof mongoose.Error.ValidationError) {
    res.status(400).send({ message: err.message });
  } else if (err instanceof mongoose.Error.CastError) {
    res.status(400).send({ message: "Invalid ID" });
  } else if (err instanceof MongoServerError) {
    if (err.code === 11000)
      res.status(400).send({
        message:
          "An account with this email already exists. Please enter another email",
      });
    else res.status(500).send({ message: "Something went wrong" });
  } else {
    logger.warn("!! ERROR NOT HANDLED !!");
    logger.error(err);
    res.status(500).send();
  }
};

export default errorHandler;
