import type { HashProvider } from '../../../../core/application/ports/crypto/HashProvider';
import type { TokenProvider } from '../../../../core/application/ports/security/TokenProvider';
import { DomainError } from '../../../../core/domain/errors/DomainError';
import type { IUserRepo } from '../../domain/IUserRepo';
import { UserEmail } from '../../domain/UserEmail';
import type { LoginUserDTO } from '../dto/LoginUserDTO';

export interface LoginUserResult {
  token: string;
}

export class LoginUserUseCase {
  constructor(
    private readonly usersRepo: IUserRepo,
    private readonly hashProvider: HashProvider,
    private readonly tokenProvider: TokenProvider,
  ) {}

  async execute({ email, password }: LoginUserDTO): Promise<LoginUserResult> {
    const emailVO = UserEmail.create(email);
    const user = await this.usersRepo.findByEmail(emailVO);

    if (!user) {
      throw DomainError.unauthorized('Invalid credentials');
    }

    const isPasswordValid = await this.hashProvider.verify(
      password,
      user.passwordHash,
    );

    if (!isPasswordValid) {
      throw DomainError.unauthorized('Invalid credentials');
    }

    const token = this.tokenProvider.sign({ userId: user.id });

    return { token };
  }
}
