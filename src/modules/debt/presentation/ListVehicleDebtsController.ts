import type { IController } from '@adapters/http/IController';
import type { IHttpRequest } from '@adapters/http/IHttpRequest';
import type { IHttpResponse } from '@adapters/http/IHttpResponse';
import { DomainError } from '@core/domain/errors/DomainError';
import type { ListVehicleDebtsUseCase } from '../application/use-cases/ListVehicleDebtsUseCase';
import { parseVehicleDebtsParams } from './validation/debtValidation';

export class ListVehicleDebtsController implements IController {
  constructor(private readonly listDebts: ListVehicleDebtsUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const userId = request.user?.id;

    if (!userId) {
      throw DomainError.unauthorized('User is not authenticated');
    }

    const { plate } = parseVehicleDebtsParams(request.params);

    const debts = await this.listDebts.execute({ ownerId: userId, plate });

    return {
      statusCode: 200,
      body: debts.map((debt) => ({
        id: debt.id,
        vehicleId: debt.vehicleId,
        type: debt.type,
        amount: debt.amount,
        status: debt.status,
      })),
    };
  }
}
