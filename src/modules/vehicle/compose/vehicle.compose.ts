import type { IAuthGuard } from '../../../adapters/http/AuthGuard';
import { JwtAuthGuard } from '../../../adapters/http/JwtAuthGuard';
import type { TokenProvider } from '../../../core/application/ports/security/TokenProvider';
import { prisma } from '../../../core/infra/database/connection';
import { JwtTokenProvider } from '../../../infra/security/JwtTokenProvider';
import { env } from '../../../main/env';
import { GetVehicleByPlateUseCase } from '../application/use-cases/GetVehicleByPlateUseCase';
import { ListOwnerVehiclesUseCase } from '../application/use-cases/ListOwnerVehiclesUseCase';
import { RegisterVehicleUseCase } from '../application/use-cases/RegisterVehicleUseCase';
import type { IVehicleRepo } from '../domain/IVehicleRepo';
import { VehicleRepoPrisma } from '../infra/VehicleRepoPrisma';
import { GetVehicleByPlateController } from '../presentation/GetVehicleByPlateController';
import { ListOwnerVehiclesController } from '../presentation/ListOwnerVehiclesController';
import { RegisterVehicleController } from '../presentation/RegisterVehicleController';

let vehicleRepo: IVehicleRepo | undefined;
let registerVehicleUseCase: RegisterVehicleUseCase | undefined;
let listVehiclesUseCase: ListOwnerVehiclesUseCase | undefined;
let vehicleByPlateUseCase: GetVehicleByPlateUseCase | undefined;
let registerVehicleController: RegisterVehicleController | undefined;
let listVehiclesController: ListOwnerVehiclesController | undefined;
let getVehicleByPlateController: GetVehicleByPlateController | undefined;
let tokenProvider: TokenProvider | undefined;
let authGuard: IAuthGuard<{ userId: string }> | undefined;

function getVehicleRepo(): IVehicleRepo {
  if (!vehicleRepo) {
    vehicleRepo = new VehicleRepoPrisma(prisma);
  }
  return vehicleRepo;
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

function getRegisterVehicleUseCase() {
  if (!registerVehicleUseCase) {
    registerVehicleUseCase = new RegisterVehicleUseCase(getVehicleRepo());
  }
  return registerVehicleUseCase;
}

function getListVehiclesUseCase() {
  if (!listVehiclesUseCase) {
    listVehiclesUseCase = new ListOwnerVehiclesUseCase(getVehicleRepo());
  }
  return listVehiclesUseCase;
}

function getVehicleByPlateUseCaseInstance() {
  if (!vehicleByPlateUseCase) {
    vehicleByPlateUseCase = new GetVehicleByPlateUseCase(getVehicleRepo());
  }
  return vehicleByPlateUseCase;
}

export function makeRegisterVehicleController() {
  if (!registerVehicleController) {
    registerVehicleController = new RegisterVehicleController(
      getRegisterVehicleUseCase(),
    );
  }
  return registerVehicleController;
}

export function makeListOwnerVehiclesController() {
  if (!listVehiclesController) {
    listVehiclesController = new ListOwnerVehiclesController(
      getListVehiclesUseCase(),
    );
  }
  return listVehiclesController;
}

export function makeGetVehicleByPlateController() {
  if (!getVehicleByPlateController) {
    getVehicleByPlateController = new GetVehicleByPlateController(
      getVehicleByPlateUseCaseInstance(),
    );
  }
  return getVehicleByPlateController;
}

export function makeJwtAuthGuard() {
  if (!authGuard) {
    authGuard = new JwtAuthGuard(getTokenProvider());
  }
  return authGuard;
}
