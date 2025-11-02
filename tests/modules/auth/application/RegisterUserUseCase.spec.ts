import type { HashProvider } from '../../../../src/core/application/ports/crypto/HashProvider';
import type { UniqueIdGenerator } from '../../../../src/core/domain/UniqueIdGenerator';
import { RegisterUserUseCase } from '../../../../src/modules/auth/application/use-cases/RegisterUserUseCase';
import type { IUserRepo } from '../../../../src/modules/auth/domain/IUserRepo';
import { User } from '../../../../src/modules/auth/domain/User';

describe('RegisterUserUseCase', () => {
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

  const makeIdGenerator = () =>
    ({
      generate: jest.fn(),
    }) as jest.Mocked<UniqueIdGenerator>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('registers a new user when email is available', async () => {
    const usersRepo = makeUsersRepo();
    usersRepo.findByEmail.mockResolvedValue(null);
    usersRepo.create.mockImplementation(async (user) => user);

    const hashProvider = makeHashProvider();
    hashProvider.hash.mockResolvedValue('hashed-password');

    const idGenerator = makeIdGenerator();
    idGenerator.generate.mockReturnValue('user-id-123');

    const useCase = new RegisterUserUseCase(
      usersRepo,
      hashProvider,
      idGenerator,
    );

    const result = await useCase.execute({
      email: 'user@example.com',
      password: 'strong-password',
    });

    expect(hashProvider.hash).toHaveBeenCalledWith('strong-password');
    expect(usersRepo.findByEmail).toHaveBeenCalled();
    expect(usersRepo.create).toHaveBeenCalledWith(result);
    expect(result).toBeInstanceOf(User);
    expect(result.id).toBe('user-id-123');
    expect(result.email.value).toBe('user@example.com');
    expect(result.passwordHash).toBe('hashed-password');
  });

  it('throws conflict error when email is already used', async () => {
    const usersRepo = makeUsersRepo();
    usersRepo.findByEmail.mockResolvedValue(
      User.create('user@example.com', 'hash', {
        idGenerator: { generate: () => 'existing-user-id' },
      }),
    );

    const hashProvider = makeHashProvider();
    const idGenerator = makeIdGenerator();

    const useCase = new RegisterUserUseCase(
      usersRepo,
      hashProvider,
      idGenerator,
    );

    await expect(
      useCase.execute({
        email: 'user@example.com',
        password: 'strong-password',
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      message: 'User already exists for email',
      code: 'conflict',
    });

    expect(usersRepo.create).not.toHaveBeenCalled();
    expect(hashProvider.hash).not.toHaveBeenCalled();
  });
});
