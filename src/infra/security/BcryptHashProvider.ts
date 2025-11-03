import type { HashProvider } from '@core/application/ports/crypto/HashProvider';
import bcrypt from 'bcryptjs';

export class BcryptHashProvider implements HashProvider {
  constructor(private readonly rounds = 10) {}

  async hash(plain: string) {
    return bcrypt.hash(plain, this.rounds);
  }

  async verify(plain: string, digest: string) {
    return bcrypt.compare(plain, digest);
  }
}
