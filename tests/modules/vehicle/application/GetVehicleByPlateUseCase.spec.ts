import { DomainError } from '../../../../src/core/domain/errors/DomainError';
import { GetVehicleByPlateUseCase } from '../../../../src/modules/vehicle/application/use-cases/GetVehicleByPlateUseCase';
import type { IVehicleRepo } from '../../../../src/modules/vehicle/domain/IVehicleRepo';
import { Vehicle } from '../../../../src/modules/vehicle/domain/Vehicle';

describe('GetVehicleByPlateUseCase', () => {
  it('returns vehicle when owned by user', async () => {
    const vehicle = Vehicle.register('owner-1', 'ABC1D23', undefined, {
      idGenerator: { generate: () => 'vehicle-1' },
    });

    const repo = {
      findByOwnerAndPlate: jest.fn().mockResolvedValue(vehicle),
    } as unknown as IVehicleRepo;

    const useCase = new GetVehicleByPlateUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'owner-1',
      plate: 'ABC1D23',
    });

    expect(result).toBe(vehicle);
  });

  it('throws not found when vehicle does not belong to user', async () => {
    const repo = {
      findByOwnerAndPlate: jest.fn().mockResolvedValue(null),
    } as unknown as IVehicleRepo;

    const useCase = new GetVehicleByPlateUseCase(repo);

    await expect(
      useCase.execute({ ownerId: 'owner-1', plate: 'ABC1D23' }),
    ).rejects.toBeInstanceOf(DomainError);
  });
});
