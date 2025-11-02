import { DomainError } from '../../../../core/domain/errors/DomainError';
import type { IVehicleRepo } from '../../domain/IVehicleRepo';
import { Vehicle } from '../../domain/Vehicle';
import type { RegisterVehicleDTO } from '../dto/RegisterVehicleDTO';

export class RegisterVehicleUseCase {
  constructor(private readonly vehiclesRepo: IVehicleRepo) {}

  async execute(data: RegisterVehicleDTO) {
    const vehicle = Vehicle.register(data.ownerId, data.plate, {
      renavam: data.renavam ?? undefined,
      uf: data.uf ?? undefined,
    });

    const plate = vehicle.plate;

    const alreadyExists = await this.vehiclesRepo.findByPlate(plate);
    if (alreadyExists) {
      throw DomainError.conflict('Vehicle plate already registered', {
        plate: plate.value,
      });
    }

    return this.vehiclesRepo.create(vehicle);
  }
}
