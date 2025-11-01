import type { NextFunction, Request, Response } from 'express';
import type { IHttpErrorHandler } from '../../adapters/http/IHttpErrorHandler';

export function expressErrorHandlerAdapter(
  httpErrorHandler: IHttpErrorHandler,
) {
  return (error: unknown, _req: Request, res: Response, next: NextFunction) => {
    if (res.headersSent) {
      return next(error);
    }

    const { statusCode, body } = httpErrorHandler.handle(error);

    return res.status(statusCode).json(body);
  };
}
