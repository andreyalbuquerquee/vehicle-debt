import { ListOwnerVehiclesUseCase } from '../../../../src/modules/vehicle/application/use-cases/ListOwnerVehiclesUseCase';
import type { IVehicleRepo } from '../../../../src/modules/vehicle/domain/IVehicleRepo';
import { Vehicle } from '../../../../src/modules/vehicle/domain/Vehicle';

describe('ListOwnerVehiclesUseCase', () => {
  it('returns vehicles for owner', async () => {
    const repo = {
      findManyByOwner: jest.fn().mockResolvedValue([
        Vehicle.register('owner-1', 'ABC1D23', undefined, {
          idGenerator: { generate: () => 'vehicle-1' },
        }),
      ]),
    } as unknown as IVehicleRepo;

    const useCase = new ListOwnerVehiclesUseCase(repo);

    const result = await useCase.execute({ ownerId: 'owner-1' });

    expect(repo.findManyByOwner).toHaveBeenCalledWith('owner-1');
    expect(result).toHaveLength(1);
    expect(result[0].plate.value).toBe('ABC1D23');
  });
});
