import { NextFunction, Request, Response } from "express";
import { HttpError } from "http-errors";
import { MongoServerError } from "mongodb";
import mongoose from "mongoose";
import logger from "./logger";

/**
 * Error handler middleware
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
