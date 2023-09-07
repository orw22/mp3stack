import { NextFunction, Request, Response } from "express";

/**
 * Describes CRUD methods for controller classes to implement
 * @interface
 */
export default interface Controller {
  /**
   * Create a new resource
   *
   * @param req
   * @param res
   * @param next
   */
  create: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * Get a resource
   * @param req
   * @param res
   * @param next
   */
  get: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * Update a resource
   *
   * @param req
   * @param res
   * @param next
   */
  update: (req: Request, res: Response, next: NextFunction) => Promise<void>;

  /**
   * Delete a resource
   *
   * @param req
   * @param res
   * @param next
   */
  delete: (req: Request, res: Response, next: NextFunction) => Promise<void>;
}
