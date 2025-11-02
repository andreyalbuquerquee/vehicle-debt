import type { ListOwnerVehiclesUseCase } from '../../../../src/modules/vehicle/application/use-cases/ListOwnerVehiclesUseCase';
import { Vehicle } from '../../../../src/modules/vehicle/domain/Vehicle';
import { ListOwnerVehiclesController } from '../../../../src/modules/vehicle/presentation/ListOwnerVehiclesController';

describe('ListOwnerVehiclesController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<ListOwnerVehiclesUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new ListOwnerVehiclesController(
      useCase as unknown as ListOwnerVehiclesUseCase,
    );

    return { controller, useCase };
  };

  it('returns 200 with vehicle list', async () => {
    const { controller, useCase } = makeController();
    const vehicle = Vehicle.register('owner-1', 'ABC1D23', undefined, {
      idGenerator: { generate: () => 'vehicle-1' },
    });
    useCase.execute.mockResolvedValue([vehicle]);

    const response = await controller.handle({ user: { id: 'owner-1' } });

    expect(useCase.execute).toHaveBeenCalledWith({ ownerId: 'owner-1' });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: 'vehicle-1',
        plate: 'ABC1D23',
        ownerId: 'owner-1',
        renavam: undefined,
        uf: undefined,
        createdAt: vehicle.createdAt,
      },
    ]);
  });

  it('throws unauthorized when user is missing', async () => {
    const { controller } = makeController();

    await expect(controller.handle({})).rejects.toMatchObject({
      name: 'DomainError',
      code: 'unauthorized',
    });
  });
});
