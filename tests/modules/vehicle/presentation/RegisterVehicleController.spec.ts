import type { RegisterVehicleUseCase } from '../../../../src/modules/vehicle/application/use-cases/RegisterVehicleUseCase';
import { Vehicle } from '../../../../src/modules/vehicle/domain/Vehicle';
import { RegisterVehicleController } from '../../../../src/modules/vehicle/presentation/RegisterVehicleController';

describe('RegisterVehicleController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<RegisterVehicleUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new RegisterVehicleController(
      useCase as unknown as RegisterVehicleUseCase,
    );

    return { controller, useCase };
  };

  it('returns 201 with created vehicle data and normalizes payload', async () => {
    const { controller, useCase } = makeController();
    const vehicle = Vehicle.register(
      'owner-1',
      'ABC1D23',
      { renavam: '12345678901', uf: 'SP' },
      {
        idGenerator: { generate: () => 'vehicle-1' },
      },
    );
    useCase.execute.mockResolvedValue(vehicle);

    const response = await controller.handle({
      body: {
        plate: ' abc-1d23 ',
        renavam: ' 123.456.789-01 ',
        uf: 'sp',
      },
      user: { id: 'owner-1' },
    });

    expect(useCase.execute).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      plate: 'ABC1D23',
      renavam: '12345678901',
      uf: 'SP',
    });

    expect(response.statusCode).toBe(201);
    expect(response.body).toEqual({
      id: 'vehicle-1',
      plate: 'ABC1D23',
      ownerId: 'owner-1',
      renavam: '12345678901',
      uf: 'SP',
      createdAt: vehicle.createdAt,
    });
  });

  it('throws validation error for invalid plate format', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({
        body: {
          plate: 'invalid',
        },
        user: { id: 'owner-1' },
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      code: 'validation',
    });
  });

  it('throws unauthorized when user is missing', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({
        body: {
          plate: 'ABC1D23',
        },
      }),
    ).rejects.toMatchObject({
      name: 'DomainError',
      code: 'unauthorized',
    });
  });
});
