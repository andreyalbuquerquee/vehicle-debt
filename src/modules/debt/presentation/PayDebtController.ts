import type { IController } from '@adapters/http/IController';
import type { IHttpRequest } from '@adapters/http/IHttpRequest';
import type { IHttpResponse } from '@adapters/http/IHttpResponse';
import { DomainError } from '@core/domain/errors/DomainError';
import type { PayDebtUseCase } from '../application/use-cases/PayDebtUseCase';
import { parsePayDebtParams } from './validation/debtValidation';

export class PayDebtController implements IController {
  constructor(private readonly payDebt: PayDebtUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const userId = request.user?.id;

    if (!userId) {
      throw DomainError.unauthorized('User is not authenticated');
    }

    const { debtId } = parsePayDebtParams(request.params);

    const debt = await this.payDebt.execute({ debtId, ownerId: userId });

    return {
      statusCode: 200,
      body: {
        id: debt.id,
        vehicleId: debt.vehicleId,
        type: debt.type,
        amount: debt.amount,
        status: debt.status,
        updatedAt: debt.updatedAt,
      },
    };
  }
}
