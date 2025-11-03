import { DefaultErrorHandler } from '@adapters/http/DefaultErrorHandler';
import type { IController } from '@adapters/http/IController';
import type { IHttpErrorHandler } from '@adapters/http/IHttpErrorHandler';
import type { Request, Response } from 'express';

export function expressRouteAdapter(
  controller: IController,
  errorHandler: IHttpErrorHandler = new DefaultErrorHandler(),
) {
  return async (req: Request, res: Response) => {
    try {
      const httpResponse = await controller.handle({
        body: req.body,
        params: req.params,
        query: req.query,
        headers: req.headers,
        user: req.metadata?.user,
      });

      return res.status(httpResponse.statusCode).json(httpResponse.body);
    } catch (err) {
      const fallback = errorHandler.handle(err);

      return res.status(fallback.statusCode).json(fallback.body);
    }
  };
}
