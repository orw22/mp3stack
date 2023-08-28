import { NextFunction, Request, Response } from "express";
import createError from "http-errors";
import jwt from "jsonwebtoken";

// JWT authentication
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
