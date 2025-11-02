import { Entity, type EntityOptions } from '../../../core/domain/Entity';
import { UserEmail } from './UserEmail';

export interface UserProps {
  email: UserEmail;
  passwordHash: string;
}

export class User extends Entity<UserProps> {
  static create(email: string, passwordHash: string, options?: EntityOptions) {
    return new User(
      {
        email: UserEmail.create(email),
        passwordHash,
      },
      options,
    );
  }

  get email() {
    return this.props.email;
  }

  get passwordHash() {
    return this.props.passwordHash;
  }
}
