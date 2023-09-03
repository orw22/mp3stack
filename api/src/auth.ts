import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

/**
 * Middleware for authenticating users
 *
 * Checks the authorization header for a JWT token, verifies its validity,
 * and sets the authenticated user's ID in the request object for later usage
 * if the token is valid. If the token is invalid or missing, it calls the next
 * function with an HttpError.
 *
 * @param req - The request object.
 * @param res - The response object.
 * @param next - The next function to pass control to the next middleware.
 */
export function authenticate(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.slice(7);
  if (token) {
    try {
      const payload = jwt.verify(token, process.env.JWT_SECRET ?? "") as {
        _id: string;
      };
      if (!payload._id) next(createError(400, "No user ID in token"));
      req.userId = payload._id;
      next();
    } catch (error) {
      next(createError(401, "Invalid token"));
    }
  } else {
    next(createError(401, "Unauthorised"));
  }
}
