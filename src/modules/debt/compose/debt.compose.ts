import type { IAuthGuard } from '@adapters/http/AuthGuard';
import { JwtAuthGuard } from '@adapters/http/JwtAuthGuard';
import type { TokenProvider } from '@core/application/ports/security/TokenProvider';
import { prisma } from '@core/infra/database/connection';
import { JwtTokenProvider } from '@infra/security/JwtTokenProvider';
import { env } from '@main/env';
import type { IDebtRepo } from '@modules/debt/domain/IDebtRepo';
import { VehicleOwnershipCheckerService } from '@modules/vehicle/application/services/VehicleOwnershipCheckerService';
import type { IVehicleRepo } from '@modules/vehicle/domain/IVehicleRepo';
import { VehicleRepoPrisma } from '@modules/vehicle/infra/VehicleRepoPrisma';
import { ListVehicleDebtsUseCase } from '../application/use-cases/ListVehicleDebtsUseCase';
import { PayDebtUseCase } from '../application/use-cases/PayDebtUseCase';
import { DebtRepoPrisma } from '../infra/DebtRepoPrisma';
import { ListVehicleDebtsController } from '../presentation/ListVehicleDebtsController';
import { PayDebtController } from '../presentation/PayDebtController';

let vehicleRepo: IVehicleRepo | undefined;
let debtRepo: IDebtRepo | undefined;
let tokenProvider: TokenProvider | undefined;
let authGuard: IAuthGuard<{ userId: string }> | undefined;
let listDebtsUseCase: ListVehicleDebtsUseCase | undefined;
let payDebtUseCase: PayDebtUseCase | undefined;
let listDebtsController: ListVehicleDebtsController | undefined;
let payDebtController: PayDebtController | undefined;

function getVehicleRepo(): IVehicleRepo {
  if (!vehicleRepo) {
    vehicleRepo = new VehicleRepoPrisma(prisma);
  }
  return vehicleRepo;
}

function getDebtRepo(): IDebtRepo {
  if (!debtRepo) {
    debtRepo = new DebtRepoPrisma(prisma);
  }
  return debtRepo;
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

function getListDebtsUseCase() {
  if (!listDebtsUseCase) {
    listDebtsUseCase = new ListVehicleDebtsUseCase(
      new VehicleOwnershipCheckerService(getVehicleRepo()),
      getDebtRepo(),
    );
  }
  return listDebtsUseCase;
}

function getPayDebtUseCase() {
  if (!payDebtUseCase) {
    payDebtUseCase = new PayDebtUseCase(getDebtRepo());
  }
  return payDebtUseCase;
}

export function makeListVehicleDebtsController() {
  if (!listDebtsController) {
    listDebtsController = new ListVehicleDebtsController(getListDebtsUseCase());
  }
  return listDebtsController;
}

export function makePayDebtController() {
  if (!payDebtController) {
    payDebtController = new PayDebtController(getPayDebtUseCase());
  }
  return payDebtController;
}

export function makeDebtAuthGuard() {
  if (!authGuard) {
    authGuard = new JwtAuthGuard(getTokenProvider());
  }
  return authGuard;
}
