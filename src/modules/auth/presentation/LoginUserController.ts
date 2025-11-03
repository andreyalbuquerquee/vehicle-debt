import type { IController } from '@adapters/http/IController';
import type { IHttpRequest } from '@adapters/http/IHttpRequest';
import type { IHttpResponse } from '@adapters/http/IHttpResponse';
import { DomainError } from '@core/domain/errors/DomainError';
import { z } from 'zod';
import type { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';

const loginUserSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export class LoginUserController implements IController {
  constructor(private readonly loginUser: LoginUserUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const parseResult = loginUserSchema.safeParse(request.body ?? {});

    if (!parseResult.success) {
      throw DomainError.validation('Invalid request body', {
        issues: parseResult.error.issues,
      });
    }

    const { token } = await this.loginUser.execute(parseResult.data);

    return {
      statusCode: 200,
      body: { token },
    };
  }
}
