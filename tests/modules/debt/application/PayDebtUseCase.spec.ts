import { PayDebtUseCase } from '../../../../src/modules/debt/application/use-cases/PayDebtUseCase';
import { Debt } from '../../../../src/modules/debt/domain/Debt';
import type {
  DebtWithOwner,
  IDebtRepo,
} from '../../../../src/modules/debt/domain/IDebtRepo';

describe('PayDebtUseCase', () => {
  const makeDebtRepo = () =>
    ({
      findByIdWithOwner: jest.fn(),
      save: jest.fn(),
    }) as unknown as jest.Mocked<IDebtRepo>;

  const makeDebt = (status: 'pending' | 'paid' = 'pending') =>
    Debt.restore(
      {
        vehicleId: 'vehicle-1',
        type: 'MULTA',
        amount: 200,
        status,
      },
      {
        id: 'debt-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    );

  it('marks debt as paid when owner matches', async () => {
    const repo = makeDebtRepo();
    const debt = makeDebt('pending');
    repo.findByIdWithOwner.mockResolvedValue({
      debt,
      ownerId: 'owner-1',
    } as DebtWithOwner);

    const useCase = new PayDebtUseCase(repo);

    const result = await useCase.execute({
      ownerId: 'owner-1',
      debtId: 'debt-1',
    });

    expect(repo.findByIdWithOwner).toHaveBeenCalledWith('debt-1');
    expect(repo.save).toHaveBeenCalled();
    expect(result.status).toBe('paid');
  });

  it('throws not found when owners do not match', async () => {
    const repo = makeDebtRepo();
    const debt = makeDebt('pending');
    repo.findByIdWithOwner.mockResolvedValue({
      debt,
      ownerId: 'owner-2',
    } as DebtWithOwner);

    const useCase = new PayDebtUseCase(repo);

    await expect(
      useCase.execute({ ownerId: 'owner-1', debtId: 'debt-1' }),
    ).rejects.toMatchObject({ code: 'not_found' });
  });

  it('throws conflict when debt already paid', async () => {
    const repo = makeDebtRepo();
    const debt = makeDebt('paid');
    repo.findByIdWithOwner.mockResolvedValue({
      debt,
      ownerId: 'owner-1',
    } as DebtWithOwner);

    const useCase = new PayDebtUseCase(repo);

    await expect(
      useCase.execute({ ownerId: 'owner-1', debtId: 'debt-1' }),
    ).rejects.toMatchObject({ code: 'conflict' });
  });

  it('throws not found when debt does not exist', async () => {
    const repo = makeDebtRepo();
    repo.findByIdWithOwner.mockResolvedValue(null);

    const useCase = new PayDebtUseCase(repo);

    await expect(
      useCase.execute({ ownerId: 'owner-1', debtId: 'debt-1' }),
    ).rejects.toMatchObject({ code: 'not_found' });
  });
});
