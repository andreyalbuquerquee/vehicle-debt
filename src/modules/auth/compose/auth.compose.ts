import type { HashProvider } from '@core/application/ports/crypto/HashProvider';
import type { TokenProvider } from '@core/application/ports/security/TokenProvider';
import { setEntityIdGenerator } from '@core/domain/Entity';
import type { UniqueIdGenerator } from '@core/domain/UniqueIdGenerator';
import { prisma } from '@core/infra/database/connection';
import { UuidUniqueIdGenerator } from '@infra/identity/UuidUniqueIdGenerator';
import { BcryptHashProvider } from '@infra/security/BcryptHashProvider';
import { JwtTokenProvider } from '@infra/security/JwtTokenProvider';
import { env } from '@main/env';
import type { IUserRepo } from '@modules/auth/domain/IUserRepo';
import { LoginUserUseCase } from '../application/use-cases/LoginUserUseCase';
import { RegisterUserUseCase } from '../application/use-cases/RegisterUserUseCase';
import { UserRepoPrisma } from '../infra/UserRepoPrisma';
import { LoginUserController } from '../presentation/LoginUserController';
import { RegisterUserController } from '../presentation/RegisterUserController';

let userRepo: IUserRepo | undefined;
let hashProvider: HashProvider | undefined;
let idGenerator: UniqueIdGenerator | undefined;
let tokenProvider: TokenProvider | undefined;
let registerUserUseCase: RegisterUserUseCase | undefined;
let registerUserController: RegisterUserController | undefined;
let loginUserUseCase: LoginUserUseCase | undefined;
let loginUserController: LoginUserController | undefined;

function getUserRepo(): IUserRepo {
  if (!userRepo) {
    userRepo = new UserRepoPrisma(prisma);
  }
  return userRepo;
}

function getHashProvider(): HashProvider {
  if (!hashProvider) {
    hashProvider = new BcryptHashProvider();
  }
  return hashProvider;
}

function getIdGenerator(): UniqueIdGenerator {
  if (!idGenerator) {
    idGenerator = new UuidUniqueIdGenerator();
    setEntityIdGenerator(idGenerator);
  }
  return idGenerator;
}

function getTokenProvider(): TokenProvider {
  if (!tokenProvider) {
    tokenProvider = new JwtTokenProvider({
      secret: env.JWT_SECRET,
      expiresIn: env.JWT_EXPIRATION_DAYS,
    });
  }
  return tokenProvider;
}

export function makeRegisterUserUseCase(): RegisterUserUseCase {
  if (!registerUserUseCase) {
    registerUserUseCase = new RegisterUserUseCase(
      getUserRepo(),
      getHashProvider(),
      getIdGenerator(),
    );
  }
  return registerUserUseCase;
}

export function makeRegisterUserController(): RegisterUserController {
  if (!registerUserController) {
    registerUserController = new RegisterUserController(
      makeRegisterUserUseCase(),
    );
  }
  return registerUserController;
}

export function makeLoginUserUseCase(): LoginUserUseCase {
  if (!loginUserUseCase) {
    loginUserUseCase = new LoginUserUseCase(
      getUserRepo(),
      getHashProvider(),
      getTokenProvider(),
    );
  }
  return loginUserUseCase;
}

export function makeLoginUserController(): LoginUserController {
  if (!loginUserController) {
    loginUserController = new LoginUserController(makeLoginUserUseCase());
  }
  return loginUserController;
}
