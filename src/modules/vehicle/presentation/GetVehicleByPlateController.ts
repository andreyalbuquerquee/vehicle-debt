import type { IController } from '@adapters/http/IController';
import type { IHttpRequest } from '@adapters/http/IHttpRequest';
import type { IHttpResponse } from '@adapters/http/IHttpResponse';
import { DomainError } from '@core/domain/errors/DomainError';
import type { GetVehicleByPlateUseCase } from '../application/use-cases/GetVehicleByPlateUseCase';
import { parseVehiclePlateParams } from './validation/registerVehicleValidation';

export class GetVehicleByPlateController implements IController {
  constructor(private readonly getVehicle: GetVehicleByPlateUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const userId = request.user?.id;

    if (!userId) {
      throw DomainError.unauthorized('User is not authenticated');
    }

    const params = parseVehiclePlateParams(request.params);

    const vehicle = await this.getVehicle.execute({
      ownerId: userId,
      plate: params.plate,
    });

    return {
      statusCode: 200,
      body: {
        id: vehicle.id,
        plate: vehicle.plate.value,
        ownerId: vehicle.ownerId,
        renavam: vehicle.renavam?.value,
        uf: vehicle.uf?.value,
        createdAt: vehicle.createdAt,
      },
    };
  }
}
