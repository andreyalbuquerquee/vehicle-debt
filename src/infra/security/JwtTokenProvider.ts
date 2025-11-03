import type { TokenProvider } from '@core/application/ports/security/TokenProvider';
import jwt, { type SignOptions } from 'jsonwebtoken';

export interface JwtTokenProviderOptions {
  secret: string;
  expiresIn?: string | number;
}

export class JwtTokenProvider<Payload extends object = { userId: string }>
  implements TokenProvider<Payload>
{
  constructor(private readonly options: JwtTokenProviderOptions) {}

  sign(payload: Payload, opts?: { expiresIn?: string | number }) {
    const expiresIn = opts?.expiresIn ?? this.options.expiresIn;

    return jwt.sign(
      payload,
      this.options.secret,
      expiresIn
        ? { expiresIn: expiresIn as SignOptions['expiresIn'] }
        : undefined,
    );
  }

  verify(token: string): Payload {
    return jwt.verify(token, this.options.secret) as Payload;
  }
}
