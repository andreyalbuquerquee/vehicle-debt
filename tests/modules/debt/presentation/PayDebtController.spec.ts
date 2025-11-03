import type { PayDebtUseCase } from '../../../../src/modules/debt/application/use-cases/PayDebtUseCase';
import { Debt } from '../../../../src/modules/debt/domain/Debt';
import { PayDebtController } from '../../../../src/modules/debt/presentation/PayDebtController';

describe('PayDebtController', () => {
  const makeController = () => {
    const useCase: jest.Mocked<Pick<PayDebtUseCase, 'execute'>> = {
      execute: jest.fn(),
    };

    const controller = new PayDebtController(
      useCase as unknown as PayDebtUseCase,
    );

    return { controller, useCase };
  };

  const makeDebt = () =>
    Debt.restore(
      {
        vehicleId: 'vehicle-1',
        type: 'IPVA',
        amount: 100,
        status: 'paid',
      },
      {
        id: 'debt-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-02'),
      },
    );

  it('returns updated debt when payment succeeds', async () => {
    const { controller, useCase } = makeController();
    const debt = makeDebt();
    useCase.execute.mockResolvedValue(debt);

    const response = await controller.handle({
      params: { debtId: 'debt-1' },
      user: { id: 'owner-1' },
    });

    expect(useCase.execute).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      debtId: 'debt-1',
    });

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({
      id: debt.id,
      vehicleId: debt.vehicleId,
      type: debt.type,
      amount: debt.amount,
      status: debt.status,
      updatedAt: debt.updatedAt,
    });
  });

  it('throws unauthorized when user missing', async () => {
    const { controller } = makeController();

    await expect(
      controller.handle({ params: { debtId: 'debt-1' } }),
    ).rejects.toMatchObject({ code: 'unauthorized' });
  });
});
