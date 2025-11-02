import type { LoginUserUseCase } from '../../../../src/modules/auth/application/use-cases/LoginUserUseCase';
import { LoginUserController } from '../../../../src/modules/auth/presentation/LoginUserController';

describe('LoginUserController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<LoginUserUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new LoginUserController(
      useCase as unknown as LoginUserUseCase,
    );

    return { controller, useCase };
  };

  it('returns 200 with token and user payload on success', async () => {
    const { controller, useCase } = makeController();
    useCase.execute.mockResolvedValue({
      token: 'jwt-token',
    });

    const response = await controller.handle({
      body: {
        email: 'valid@example.com',
        password: 'super-secret',
      },
    });

    expect(useCase.execute).toHaveBeenCalledWith({
      email: 'valid@example.com',
      password: 'super-secret',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      token: 'jwt-token',
    });
  });

  it('throws validation error when body is invalid', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({
        body: {
          email: 'invalid-email',
        },
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      message: 'Invalid request body',
      code: 'validation',
    });
  });
});
