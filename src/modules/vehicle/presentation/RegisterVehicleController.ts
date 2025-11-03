import type { IController } from '@adapters/http/IController';
import type { IHttpRequest } from '@adapters/http/IHttpRequest';
import type { IHttpResponse } from '@adapters/http/IHttpResponse';
import { DomainError } from '@core/domain/errors/DomainError';
import type { RegisterVehicleUseCase } from '../application/use-cases/RegisterVehicleUseCase';
import { parseRegisterVehiclePayload } from './validation/registerVehicleValidation';

export class RegisterVehicleController implements IController {
  constructor(private readonly registerVehicle: RegisterVehicleUseCase) {}

  async handle(request: IHttpRequest): Promise<IHttpResponse> {
    const userId = request.user?.id;

    if (!userId) {
      throw DomainError.unauthorized('User is not authenticated');
    }

    const payload = parseRegisterVehiclePayload(request.body);

    const vehicle = await this.registerVehicle.execute({
      ownerId: userId,
      plate: payload.plate,
      renavam: payload.renavam ?? undefined,
      uf: payload.uf ?? undefined,
    });

    return {
      statusCode: 201,
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
