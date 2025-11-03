import type { ListVehicleDebtsUseCase } from '../../../../src/modules/debt/application/use-cases/ListVehicleDebtsUseCase';
import { Debt } from '../../../../src/modules/debt/domain/Debt';
import { ListVehicleDebtsController } from '../../../../src/modules/debt/presentation/ListVehicleDebtsController';

describe('ListVehicleDebtsController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<ListVehicleDebtsUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new ListVehicleDebtsController(
      useCase as unknown as ListVehicleDebtsUseCase,
    );

    return { controller, useCase };
  };

  const makeDebt = () =>
    Debt.restore(
      {
        vehicleId: 'vehicle-1',
        type: 'IPVA',
        amount: 100,
        status: 'pending',
      },
      {
        id: 'debt-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    );

  it('returns debts data when authenticated', async () => {
    const { controller, useCase } = makeController();
    const debt = makeDebt();
    useCase.execute.mockResolvedValue([debt]);

    const response = await controller.handle({
      params: { plate: 'abc1234' },
      user: { id: 'owner-1' },
    });

    expect(useCase.execute).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      plate: 'ABC1234',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual([
      {
        id: debt.id,
        vehicleId: debt.vehicleId,
        type: debt.type,
        amount: debt.amount,
        status: debt.status,
      },
    ]);
  });

  it('throws unauthorized when user missing', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({ params: { plate: 'abc1234' } }),
    ).rejects.toMatchObject({ code: 'unauthorized' });
  });
});
