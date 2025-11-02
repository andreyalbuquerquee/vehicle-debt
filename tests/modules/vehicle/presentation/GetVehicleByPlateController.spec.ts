import type { GetVehicleByPlateUseCase } from '../../../../src/modules/vehicle/application/use-cases/GetVehicleByPlateUseCase';
import { Vehicle } from '../../../../src/modules/vehicle/domain/Vehicle';
import { GetVehicleByPlateController } from '../../../../src/modules/vehicle/presentation/GetVehicleByPlateController';

describe('GetVehicleByPlateController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<GetVehicleByPlateUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new GetVehicleByPlateController(
      useCase as unknown as GetVehicleByPlateUseCase,
    );

    return { controller, useCase };
  };

  it('returns 200 with vehicle data', async () => {
    const { controller, useCase } = makeController();
    const vehicle = Vehicle.register('owner-1', 'ABC1D23', undefined, {
      idGenerator: { generate: () => 'vehicle-1' },
    });
    useCase.execute.mockResolvedValue(vehicle);

    const response = await controller.handle({
      params: { plate: ' abc-1d23 ' },
      user: { id: 'owner-1' },
    });

    expect(useCase.execute).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      plate: 'ABC1D23',
    });
    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: 'vehicle-1',
      plate: 'ABC1D23',
      ownerId: 'owner-1',
      renavam: undefined,
      uf: undefined,
      createdAt: vehicle.createdAt,
    });
  });

  it('throws validation error when params invalid', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({ params: {}, user: { id: 'owner-1' } }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      code: 'validation',
    });
  });

  it('throws unauthorized when user missing', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({ params: { plate: 'ABC1D23' } }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      code: 'unauthorized',
    });
  });
});
