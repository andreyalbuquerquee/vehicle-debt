import { DomainError } from '../../core/domain/errors/DomainError';
import type { IHttpErrorHandler } from './IHttpErrorHandler';
import type { IHttpResponse } from './IHttpResponse';

export class DefaultErrorHandler implements IHttpErrorHandler {
  handle(error: unknown): IHttpResponse {
    if (error instanceof DomainError) {
      const statusCode = this.mapDomainErrorToStatus(error);

      return {
        statusCode,
        body: {
          error: error.message,
          code: error.code,
          details: error.details,
        },
      };
    }

    console.error('UNHANDLED ERROR:', error);

    return {
      statusCode: 500,
      body: { error: 'Internal server error' },
    };
  }

  private mapDomainErrorToStatus(error: DomainError): number {
    switch (error.code) {
      case 'validation':
        return 422;
      case 'unauthorized':
        return 401;
      case 'not_found':
        return 404;
      case 'conflict':
        return 409;
      case 'invariant_violation':
        return 400;
      default:
        return 400;
    }
  }
}
