import type { NextFunction, Request, Response } from 'express';
import type { IAuthGuard } from '../../adapters/http/AuthGuard';

interface IOutput {
  userId: string,
}

export function expressAuthGuardAdapter(authGuard: IAuthGuard<IOutput>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      const { userId } = authGuard.check({
        body: req.body,
        headers: req.headers,
        params: req.params,
        query: req.query,
        user: req.metadata?.user,
      });

      req.metadata = {
        ...(req.metadata ?? {}),
        user: { id: userId },
      };

      next();
    } catch (error) {
      next(error);
    }
  };
}
