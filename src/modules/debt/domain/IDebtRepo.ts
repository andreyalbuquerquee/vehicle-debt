import type { Debt } from './Debt';

export interface DebtWithOwner {
  debt: Debt;
  ownerId: string;
}

export interface IDebtRepo {
  findByVehicleId(vehicleId: string): Promise<Debt[]>;
  findByIdWithOwner(debtId: string): Promise<DebtWithOwner | null>;
  save(debt: Debt): Promise<void>;
}
