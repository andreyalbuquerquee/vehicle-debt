import type { User } from './User';
import type { UserEmail } from './UserEmail';

export interface IUserRepo {
  findByEmail(email: UserEmail): Promise<User | null>;
  create(user: User): Promise<User>;
}
