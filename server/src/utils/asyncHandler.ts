import { Request, Response, NextFunction } from "express";

/**
 * Wraps an async route handler so any thrown/rejected error is forwarded to
 * Express's error middleware (`errorHandler`) instead of crashing the process
 * or being swallowed. Generic params preserve typed `req.params`/body/query.
 */
export const asyncHandler =
  <P = any, ResBody = any, ReqBody = any, ReqQuery = any>(
    handler: (
      req: Request<P, ResBody, ReqBody, ReqQuery>,
      res: Response<ResBody>,
      next: NextFunction
    ) => Promise<unknown> | unknown
  ) =>
  (
    req: Request<P, ResBody, ReqBody, ReqQuery>,
    res: Response<ResBody>,
    next: NextFunction
  ): void => {
    Promise.resolve(handler(req, res, next)).catch(next);
  };
