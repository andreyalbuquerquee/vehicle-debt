import { DomainError } from '../../../../core/domain/errors/DomainError';
import type {
  VehicleOwnershipChecker,
  VehicleOwnershipCheckerInput,
  VehicleOwnershipCheckerOutput,
} from '../../../debt/application/ports/VehicleOwnershipChecker';
import type { IVehicleRepo } from '../../domain/IVehicleRepo';
import { VehiclePlate } from '../../domain/value-objects/VehiclePlate';

export class VehicleOwnershipCheckerService implements VehicleOwnershipChecker {
  constructor(private readonly vehicleRepo: IVehicleRepo) {}

  async ensureVehicleOwnership(
    params: VehicleOwnershipCheckerInput,
  ): Promise<VehicleOwnershipCheckerOutput> {
    const { ownerId, plate } = params;

    const plateVO = VehiclePlate.create(plate);

    const vehicle = await this.vehicleRepo.findByOwnerAndPlate(
      ownerId,
      plateVO,
    );

    if (!vehicle) {
      throw DomainError.notFound('Vehicle', { plate: plateVO.value });
    }

    return { vehicleId: vehicle.id };
  }
}
