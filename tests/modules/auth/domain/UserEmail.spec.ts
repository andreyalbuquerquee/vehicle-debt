import { DomainError } from '../../../../src/core/domain/errors/DomainError';
import { UserEmail } from '../../../../src/modules/auth/domain/UserEmail';

describe('UserEmail Value Object', () => {
  it('normalizes email to lowercase and trims whitespace', () => {
    const vo = UserEmail.create('  TeSt@Example.COM  ');

    expect(vo.value).toBe('test@example.com');
  });

  it('throws a validation error for empty email', () => {
    expect(() => UserEmail.create('')).toThrow(DomainError);
    expect(() => UserEmail.create('')).toThrow('User email is required');
  });

  it('throws a validation error for invalid format', () => {
    const act = () => UserEmail.create('invalid-email');
    expect(act).toThrow(DomainError);
    expect(act).toThrow('User email is invalid');
  });
});
