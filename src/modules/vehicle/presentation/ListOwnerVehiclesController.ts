import type { IController } from '../../../adapters/http/IController';
import type { IHttpRequest } from '../../../adapters/http/IHttpRequest';
import type { IHttpResponse } from '../../../adapters/http/IHttpResponse';
import { DomainError } from '../../../core/domain/errors/DomainError';
import type { ListOwnerVehiclesUseCase } from '../application/use-cases/ListOwnerVehiclesUseCase';

export class ListOwnerVehiclesController implements IController {
  constructor(private readonly listVehicles: ListOwnerVehiclesUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const userId = request.user?.id;

    if (!userId) {
      throw DomainError.unauthorized('User is not authenticated');
    }

    const vehicles = await this.listVehicles.execute({ ownerId: userId });

    return {
      statusCode: 200,
      body: vehicles.map((vehicle) => ({
        id: vehicle.id,
        plate: vehicle.plate.value,
        ownerId: vehicle.ownerId,
        renavam: vehicle.renavam?.value,
        uf: vehicle.uf?.value,
        createdAt: vehicle.createdAt,
      })),
    };
  }
}
