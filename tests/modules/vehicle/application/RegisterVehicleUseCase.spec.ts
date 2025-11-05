import { setEntityIdGenerator } from '../../../../src/core/domain/Entity';
import { RegisterVehicleUseCase } from '../../../../src/modules/vehicle/application/use-cases/RegisterVehicleUseCase';
import type { IVehicleRepo } from '../../../../src/modules/vehicle/domain/IVehicleRepo';
import { Vehicle } from '../../../../src/modules/vehicle/domain/Vehicle';

describe('RegisterVehicleUseCase', () => {
  const makeRepo = () =>
    ({
      create: jest.fn(),
      findByPlate: jest.fn(),
      findByOwnerAndPlate: jest.fn(),
      findManyByOwner: jest.fn(),
    }) as jest.Mocked<IVehicleRepo>;

  let counter = 0;

  beforeEach(() => {
    jest.clearAllMocks();
    counter = 0;
    setEntityIdGenerator({
      generate: () => `vehicle-${++counter}`,
    });
  });

  it('registers vehicle when plate is available', async () => {
    const repo = makeRepo();
    repo.findByPlate.mockResolvedValue(null);
    repo.create.mockImplementation(async (vehicle) => vehicle);

    const useCase = new RegisterVehicleUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'owner-1',
      plate: 'ABC1D23',
      renavam: '12345678901',
      uf: 'sp',
    });

    expect(repo.findByPlate).toHaveBeenCalled();
    expect(repo.create).toHaveBeenCalled();
    expect(result).toBeInstanceOf(Vehicle);
    expect(result.plate.value).toBe('ABC1D23');
    expect(result.renavam?.value).toBe('12345678901');
    expect(result.uf?.value).toBe('SP');
  });

  it('throws conflict when plate already exists', async () => {
    const repo = makeRepo();
    repo.findByPlate.mockResolvedValue(
      Vehicle.register('owner-2', 'ABC1D23', undefined, {
        idGenerator: { generate: () => 'vehicle-1' },
      }),
    );

    const useCase = new RegisterVehicleUseCase(repo);

    await expect(
      useCase.execute({ ownerId: 'owner-1', plate: 'ABC1D23' }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      message: 'Vehicle plate already registered',
      code: 'conflict',
    });
  });
});
