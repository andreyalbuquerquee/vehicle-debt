import type { HashProvider } from '@core/application/ports/crypto/HashProvider';
import { DomainError } from '@core/domain/errors/DomainError';
import type { UniqueIdGenerator } from '@core/domain/UniqueIdGenerator';
import type { IUserRepo } from '@modules/auth/domain/IUserRepo';
import { User } from '@modules/auth/domain/User';
import { UserEmail } from '@modules/auth/domain/UserEmail';
import type { RegisterUserDTO } from '../dto/RegisterUserDTO';

export class RegisterUserUseCase {
  constructor(
    private readonly usersRepo: IUserRepo,
    private readonly hashProvider: HashProvider,
    private readonly idGenerator: UniqueIdGenerator,
  ) {}

  async execute({ email, password }: RegisterUserDTO): Promise<User> {
    const emailVO = UserEmail.create(email);
    const isEmailTaken = await this.usersRepo.findByEmail(emailVO);

    if (isEmailTaken) {
      throw DomainError.conflict('User already exists for email', {
        email: emailVO.value,
      });
    }

    const hashedPassword = await this.hashProvider.hash(password);
    const user = User.create(emailVO.value, hashedPassword, {
      idGenerator: this.idGenerator,
    });

    return this.usersRepo.create(user);
  }
}
