import { DomainError } from '@core/domain/errors/DomainError';
import type { IDebtRepo } from '@modules/debt/domain/IDebtRepo';
import type { PayDebtDTO } from '../dto/PayDebtDTO';

export class PayDebtUseCase {
  constructor(private readonly debtRepo: IDebtRepo) {}

  async execute({ debtId, ownerId }: PayDebtDTO) {
    const result = await this.debtRepo.findByIdWithOwner(debtId);

    const isDebtInvalid = !result || result?.ownerId !== ownerId;

    if (isDebtInvalid) {
      throw DomainError.notFound('Debt', { debtId });
    }

    const { debt } = result;

    if (debt.isPaid) {
      throw DomainError.conflict('Debt is already paid', { debtId });
    }

    debt.markAsPaid();
    await this.debtRepo.save(debt);

    return debt;
  }
}
