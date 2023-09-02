import { NextFunction, Request, Response } from "express";

const cacheControl = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === "GET") {
    // Set Cache-Control to enable caching for 1 hour
    res.setHeader("Cache-Control", "private, max-age=3600");
  }
  next();
};

export default cacheControl;
