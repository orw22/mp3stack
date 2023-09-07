import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

/**
 * Authentication middleware generator
 *
 * Higher order function that generates auth middleware. If useCookie is true,
 * the middleware will get the token from the Cookie header instead of the
 * Authorization header (required for SSE connections)
 *
 * Middleware checks the authorization header for a JWT token, verifies its validity,
 * and sets the authenticated user's ID in the request object if token valid.
 *
 * @param useCookie - Flag indicating whether to get the token from the Cookie header or
 *  the Authorization header
 */
export function authenticate(useCookie: boolean = false) {
  return (req: Request, _: Response, next: NextFunction) => {
    const token = useCookie
      ? req.cookies.mp3stack_auth
      : req.headers.authorization?.slice(7);
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
  };
}
