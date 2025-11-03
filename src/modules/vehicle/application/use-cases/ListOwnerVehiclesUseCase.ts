import type { IVehicleRepo } from '@modules/vehicle/domain/IVehicleRepo';
import type { ListVehiclesDTO } from '../dto/ListVehiclesDTO';

export class ListOwnerVehiclesUseCase {
  constructor(private readonly vehiclesRepo: IVehicleRepo) {}

  execute({ ownerId }: ListVehiclesDTO) {
    return this.vehiclesRepo.findManyByOwner(ownerId);
  }
}
