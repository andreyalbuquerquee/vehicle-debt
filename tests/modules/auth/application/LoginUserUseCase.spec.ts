import type { HashProvider } from '../../../../src/core/application/ports/crypto/HashProvider';
import type { TokenProvider } from '../../../../src/core/application/ports/security/TokenProvider';
import { LoginUserUseCase } from '../../../../src/modules/auth/application/use-cases/LoginUserUseCase';
import type { IUserRepo } from '../../../../src/modules/auth/domain/IUserRepo';
import { User } from '../../../../src/modules/auth/domain/User';

describe('LoginUserUseCase', () => {
  const makeHashProvider = () =>
    ({
      hash: jest.fn(),
      verify: jest.fn(),
    }) as jest.Mocked<HashProvider>;

  const makeUsersRepo = () =>
    ({
      findByEmail: jest.fn(),
      create: jest.fn(),
    }) as jest.Mocked<IUserRepo>;

  const makeTokenProvider = () =>
    ({
      sign: jest.fn(),
      verify: jest.fn(),
    }) as jest.Mocked<TokenProvider>;

  const makeExistingUser = () =>
    User.create('user@example.com', 'hashed-password', {
      idGenerator: { generate: () => 'user-id' },
    });

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns user when credentials are valid', async () => {
    const usersRepo = makeUsersRepo();
    const user = makeExistingUser();
    usersRepo.findByEmail.mockResolvedValue(user);

    const hashProvider = makeHashProvider();
    hashProvider.verify.mockResolvedValue(true);

    const tokenProvider = makeTokenProvider();
    tokenProvider.sign.mockReturnValue('jwt-token');

    const useCase = new LoginUserUseCase(
      usersRepo,
      hashProvider,
      tokenProvider,
    );

    const result = await useCase.execute({
      email: 'user@example.com',
      password: 'plain-password',
    });

    expect(usersRepo.findByEmail).toHaveBeenCalled();
    expect(hashProvider.verify).toHaveBeenCalledWith(
      'plain-password',
      'hashed-password',
    );
    expect(tokenProvider.sign).toHaveBeenCalledWith({ userId: 'user-id' });
    expect(result).toEqual({
      token: 'jwt-token',
    });
  });

  it('throws unauthorized when user is not found', async () => {
    const usersRepo = makeUsersRepo();
    usersRepo.findByEmail.mockResolvedValue(null);

    const hashProvider = makeHashProvider();
    const tokenProvider = makeTokenProvider();
    const useCase = new LoginUserUseCase(
      usersRepo,
      hashProvider,
      tokenProvider,
    );

    await expect(
      useCase.execute({
        email: 'missing@example.com',
        password: 'plain-password',
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      message: 'Invalid credentials',
      code: 'unauthorized',
    });

    expect(hashProvider.verify).not.toHaveBeenCalled();
    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });

  it('throws unauthorized when password does not match', async () => {
    const usersRepo = makeUsersRepo();
    const user = makeExistingUser();
    usersRepo.findByEmail.mockResolvedValue(user);

    const hashProvider = makeHashProvider();
    hashProvider.verify.mockResolvedValue(false);

    const tokenProvider = makeTokenProvider();
    const useCase = new LoginUserUseCase(
      usersRepo,
      hashProvider,
      tokenProvider,
    );

    await expect(
      useCase.execute({
        email: 'user@example.com',
        password: 'wrong-password',
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      message: 'Invalid credentials',
      code: 'unauthorized',
    });

    expect(tokenProvider.sign).not.toHaveBeenCalled();
  });
});
