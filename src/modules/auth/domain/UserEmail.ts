import { DomainError } from '../../../core/domain/errors/DomainError';
import { ValueObject } from '../../../core/domain/ValueObject';

const EMAIL_REGEX =
  /^[a-z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)*$/i;

export class UserEmail extends ValueObject<string> {
  private constructor(email: string) {
    super(UserEmail.normalize(email));
  }

  static create(email: string) {
    return new UserEmail(email);
  }

  protected validate(email: string): void {
    if (!email) {
      throw DomainError.validation('User email is required');
    }

    if (email.length > 320) {
      throw DomainError.validation('User email is too long', {
        maxLength: 320,
      });
    }

    if (!EMAIL_REGEX.test(email)) {
      throw DomainError.validation('User email is invalid', { email });
    }
  }

  private static normalize(email: string) {
    return email.trim().toLowerCase();
  }
}
