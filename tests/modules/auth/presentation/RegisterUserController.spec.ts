import type { RegisterUserUseCase } from '../../../../src/modules/auth/application/use-cases/RegisterUserUseCase';
import { User } from '../../../../src/modules/auth/domain/User';
import { RegisterUserController } from '../../../../src/modules/auth/presentation/RegisterUserController';

describe('RegisterUserController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<RegisterUserUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new RegisterUserController(
      useCase as unknown as RegisterUserUseCase,
    );

    return { controller, useCase };
  };

  it('returns 201 with created user payload', async () => {
    const { controller, useCase } = makeController();
    const user = User.create('valid@example.com', 'hash', {
      idGenerator: { generate: () => 'new-user-id' },
    });
    useCase.execute.mockResolvedValue(user);

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

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 'new-user-id',
      email: 'valid@example.com',
      createdAt: user.createdAt,
    });
  });

  it('throws DomainError for invalid body', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({
        body: {
          email: 'invalid-email',
        },
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      code: 'validation',
      message: 'Invalid request body',
    });
  });
});
