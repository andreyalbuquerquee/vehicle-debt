import jwt, { type SignOptions } from 'jsonwebtoken';
import type { TokenProvider } from '../../core/application/ports/security/TokenProvider';

export class JwtTokenProvider<Payload extends object = { userId: string }>
  implements TokenProvider<Payload> {

  constructor(private readonly secret: string) { }

  sign(payload: Payload, opts?: { expiresIn?: string | number }) {
    const expiresIn = opts?.expiresIn;

    if (expiresIn === undefined) {
      return jwt.sign(payload, this.secret);
    }

    const signOptions: SignOptions = typeof expiresIn === 'number'
      ? { expiresIn }
      : { expiresIn: expiresIn as SignOptions['expiresIn'] };

    return jwt.sign(payload, this.secret, signOptions);
  }

  verify(token: string): Payload {
    return jwt.verify(token, this.secret) as Payload;
  }
}
