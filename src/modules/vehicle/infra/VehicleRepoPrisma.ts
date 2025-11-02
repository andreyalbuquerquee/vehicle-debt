import type { PrismaClient } from '@prisma/client';
import type { IVehicleRepo } from '../domain/IVehicleRepo';
import type { Vehicle } from '../domain/Vehicle';
import type { VehiclePlate } from '../domain/value-objects/VehiclePlate';
import {
  mapPrismaVehicleToDomain,
  mapVehicleToPrisma,
} from './prisma/vehicle.mapper';

export class VehicleRepoPrisma implements IVehicleRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async create(vehicle: Vehicle) {
    const data = mapVehicleToPrisma(vehicle);
    const created = await this.prisma.vehicle.create({ data });
    return mapPrismaVehicleToDomain(created);
  }

  async findByPlate(plate: VehiclePlate) {
    const vehicle = await this.prisma.vehicle.findUnique({
      where: { plate: plate.value },
    });

    return vehicle ? mapPrismaVehicleToDomain(vehicle) : null;
  }

  async findByOwnerAndPlate(ownerId: string, plate: VehiclePlate) {
    const vehicle = await this.prisma.vehicle.findFirst({
      where: {
        ownerId,
        plate: plate.value,
      },
    });

    return vehicle ? mapPrismaVehicleToDomain(vehicle) : null;
  }

  async findManyByOwner(ownerId: string) {
    const vehicles = await this.prisma.vehicle.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });

    return vehicles.map(mapPrismaVehicleToDomain);
  }
}
