import { NextFunction, Request, Response } from "express";

/**
 * Cache-Control middleware
 *
 * Sets the Cache-Control header based on the HTTP request method and URL.
 * For non-track GET requests, enables private caching for 1 day
 *
 * @param req
 * @param res
 * @param next
 */
const cacheControl = (req: Request, res: Response, next: NextFunction): void => {
  if (req.method === "GET" && !req.url.startsWith("/tracks")) {
    // Set Cache-Control to enable caching for 1 day
    res.set("Cache-Control", "private, max-age=86400, must-revalidate");
  } else {
    // for other request types set no caching
    res.set("Cache-Control", `no-store`);
  }
  next();
};

export default cacheControl;
