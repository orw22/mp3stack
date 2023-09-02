import { NextFunction, Request, Response } from "express";

const cacheControl = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  if (req.method === "GET") {
    // Set Cache-Control to enable caching for 3 hours
    res.set("Cache-Control", "private, max-age=10800, must-revalidate");
  } else {
    // for other request types set no caching
    res.set("Cache-Control", `no-store`);
  }
  next();
};

export default cacheControl;
