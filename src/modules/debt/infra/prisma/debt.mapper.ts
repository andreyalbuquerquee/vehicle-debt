import { Debt } from '@modules/debt/domain/Debt';
import type { Prisma, Debt as PrismaDebt } from '@prisma/client';

export function mapPrismaDebtToDomain(debt: PrismaDebt) {
  return Debt.restore(
    {
      vehicleId: debt.vehicleId,
      type: debt.type,
      amount: Number(debt.amount),
      status: debt.status,
    },
    {
      id: debt.id,
      createdAt: debt.createdAt,
      updatedAt: debt.updatedAt,
    },
  );
}

export function mapDebtToPrisma(debt: Debt): Prisma.DebtUncheckedUpdateInput {
  return {
    id: debt.id,
    vehicleId: debt.vehicleId,
    type: debt.type,
    amount: debt.amount,
    status: debt.status,
    updatedAt: debt.updatedAt,
  };
}
