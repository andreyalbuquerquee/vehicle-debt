import type { Vehicle } from './Vehicle';
import type { VehiclePlate } from './value-objects/VehiclePlate';

export interface IVehicleRepo {
  create(vehicle: Vehicle): Promise<Vehicle>;
  findByPlate(plate: VehiclePlate): Promise<Vehicle | null>;
  findByOwnerAndPlate(
    ownerId: string,
    plate: VehiclePlate,
  ): Promise<Vehicle | null>;
  findManyByOwner(ownerId: string): Promise<Vehicle[]>;
}
