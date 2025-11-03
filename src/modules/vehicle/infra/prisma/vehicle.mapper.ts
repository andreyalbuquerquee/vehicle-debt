import { Vehicle } from '@modules/vehicle/domain/Vehicle';
import type { Prisma, Vehicle as PrismaVehicle } from '@prisma/client';

export function mapPrismaVehicleToDomain(vehicle: PrismaVehicle) {
  return Vehicle.register(
    vehicle.ownerId,
    vehicle.plate,
    {
      renavam: vehicle.renavam ?? undefined,
      uf: vehicle.uf ?? undefined,
    },
    {
      id: vehicle.id,
      createdAt: vehicle.createdAt,
      updatedAt: vehicle.createdAt,
    },
  );
}

export function mapVehicleToPrisma(
  vehicle: Vehicle,
): Prisma.VehicleUncheckedCreateInput {
  return {
    id: vehicle.id,
    ownerId: vehicle.ownerId,
    plate: vehicle.plate.value,
    renavam: vehicle.renavam?.value,
    uf: vehicle.uf?.value,
    createdAt: vehicle.createdAt,
  };
}
