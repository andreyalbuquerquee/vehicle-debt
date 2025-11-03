import type { PrismaClient } from '@prisma/client';
import type { Debt } from '../domain/Debt';
import type { DebtWithOwner, IDebtRepo } from '../domain/IDebtRepo';
import { mapDebtToPrisma, mapPrismaDebtToDomain } from './prisma/debt.mapper';

export class DebtRepoPrisma implements IDebtRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findByVehicleId(vehicleId: string) {
    const debts = await this.prisma.debt.findMany({
      where: { vehicleId },
      orderBy: { createdAt: 'desc' },
    });

    return debts.map(mapPrismaDebtToDomain);
  }

  async findByIdWithOwner(debtId: string): Promise<DebtWithOwner | null> {
    const debt = await this.prisma.debt.findUnique({
      where: { id: debtId },
      include: {
        vehicle: {
          select: {
            ownerId: true,
          },
        },
      },
    });

    if (!debt) return null;

    return {
      debt: mapPrismaDebtToDomain(debt),
      ownerId: debt.vehicle.ownerId,
    };
  }

  async save(debt: Debt) {
    const data = mapDebtToPrisma(debt);
    await this.prisma.debt.update({
      where: { id: debt.id },
      data,
    });
  }
}
