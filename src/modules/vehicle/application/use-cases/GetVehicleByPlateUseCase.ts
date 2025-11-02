import { DomainError } from '../../../../core/domain/errors/DomainError';
import type { IVehicleRepo } from '../../domain/IVehicleRepo';
import { VehiclePlate } from '../../domain/value-objects/VehiclePlate';
import type { GetVehicleByPlateDTO } from '../dto/GetVehicleByPlateDTO';

export class GetVehicleByPlateUseCase {
  constructor(private readonly vehiclesRepo: IVehicleRepo) {}

  async execute({ ownerId, plate }: GetVehicleByPlateDTO) {
    const plateVO = VehiclePlate.create(plate);
    const vehicle = await this.vehiclesRepo.findByOwnerAndPlate(
      ownerId,
      plateVO,
    );

    if (!vehicle) {
      throw DomainError.notFound('Vehicle', {
        plate: plateVO.value,
      });
    }

    return vehicle;
  }
}
