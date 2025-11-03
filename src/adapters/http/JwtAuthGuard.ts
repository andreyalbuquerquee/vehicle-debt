import type { TokenProvider } from '@core/application/ports/security/TokenProvider';
import { DomainError } from '@core/domain/errors/DomainError';
import type { IAuthGuard } from './AuthGuard';
import type { IHttpRequest } from './IHttpRequest';

interface IOutput {
  userId: string;
}

export class JwtAuthGuard implements IAuthGuard<IOutput> {
  constructor(private readonly tokenProvider: TokenProvider) {}

  check(request: IHttpRequest): IOutput {
    const headers = request.headers ?? {};
    const authorization = headers.authorization as string | undefined;

    if (!authorization || !authorization.startsWith('Bearer ')) {
      throw DomainError.unauthorized(
        'Missing or malformed authorization header',
      );
    }

    const token = authorization.replace('Bearer ', '').trim();

    try {
      const { userId } = this.tokenProvider.verify(token);

      return { userId };
    } catch (error) {
      throw DomainError.unauthorized('Invalid token').withContext({
        cause: error,
      });
    }
  }
}
