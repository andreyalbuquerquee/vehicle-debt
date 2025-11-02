import { z } from 'zod';
import type { IController } from '../../../adapters/http/IController';
import type { IHttpRequest } from '../../../adapters/http/IHttpRequest';
import type { IHttpResponse } from '../../../adapters/http/IHttpResponse';
import { DomainError } from '../../../core/domain/errors/DomainError';
import type { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase';

const registerUserSchema = z.object({
  email: z.email(),
  password: z.string().min(8),
});

export class RegisterUserController implements IController {
  constructor(private readonly registerUser: RegisterUserUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const parseResult = registerUserSchema.safeParse(request.body ?? {});

    if (!parseResult.success) {
      throw DomainError.validation('Invalid request body', {
        issues: parseResult.error.issues,
      });
    }

    const result = await this.registerUser.execute(parseResult.data);

    return {
      statusCode: 201,
      body: {
        id: result.id,
        email: result.email.value,
        createdAt: result.createdAt,
      },
    };
  }
}
