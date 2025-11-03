import { DomainError } from '../../../../src/core/domain/errors/DomainError';
import type { VehicleOwnershipChecker } from '../../../../src/modules/debt/application/ports/VehicleOwnershipChecker';
import { ListVehicleDebtsUseCase } from '../../../../src/modules/debt/application/use-cases/ListVehicleDebtsUseCase';
import { Debt } from '../../../../src/modules/debt/domain/Debt';
import type { IDebtRepo } from '../../../../src/modules/debt/domain/IDebtRepo';

describe('ListVehicleDebtsUseCase', () => {
  const makeOwnershipChecker = () =>
    ({
      ensureVehicleOwnership: jest.fn(),
    }) as jest.Mocked<VehicleOwnershipChecker>;

  const makeDebtRepo = () =>
    ({
      findByVehicleId: jest.fn(),
    }) as unknown as jest.Mocked<IDebtRepo>;

  const createDebt = () =>
    Debt.restore(
      {
        vehicleId: 'vehicle-1',
        type: 'IPVA',
        amount: 123.45,
        status: 'pending',
      },
      {
        id: 'debt-1',
        createdAt: new Date('2024-01-01'),
        updatedAt: new Date('2024-01-01'),
      },
    );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('returns debts for owner vehicle', async () => {
    const ownershipChecker = makeOwnershipChecker();
    const debtRepo = makeDebtRepo();

    ownershipChecker.ensureVehicleOwnership.mockResolvedValue({
      vehicleId: 'vehicle-1',
    });

    const debt = createDebt();
    debtRepo.findByVehicleId.mockResolvedValue([debt]);

    const useCase = new ListVehicleDebtsUseCase(ownershipChecker, debtRepo);

    const result = await useCase.execute({
      ownerId: 'owner-1',
      plate: 'abc1234',
    });

    expect(ownershipChecker.ensureVehicleOwnership).toHaveBeenCalledWith({
      ownerId: 'owner-1',
      plate: 'abc1234',
    });
    expect(debtRepo.findByVehicleId).toHaveBeenCalledWith('vehicle-1');
    expect(result).toEqual([debt]);
  });

  it('throws not found when vehicle does not belong to owner', async () => {
    const ownershipChecker = makeOwnershipChecker();
    const debtRepo = makeDebtRepo();
    ownershipChecker.ensureVehicleOwnership.mockRejectedValue(
      DomainError.notFound('Vehicle'),
    );

    const useCase = new ListVehicleDebtsUseCase(ownershipChecker, debtRepo);

    await expect(
      useCase.execute({ ownerId: 'owner-1', plate: 'abc1234' }),
    ).rejects.toBeInstanceOf(DomainError);
  });
});
