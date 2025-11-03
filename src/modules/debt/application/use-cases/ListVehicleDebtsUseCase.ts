import type { IDebtRepo } from '@modules/debt/domain/IDebtRepo';
import type { ListVehicleDebtsDTO } from '../dto/ListVehicleDebtsDTO';
import type { VehicleOwnershipChecker } from '../ports/VehicleOwnershipChecker';

export class ListVehicleDebtsUseCase {
  constructor(
    private readonly ownershipChecker: VehicleOwnershipChecker,
    private readonly debtRepo: IDebtRepo,
  ) {}

  async execute({ ownerId, plate }: ListVehicleDebtsDTO) {
    const { vehicleId } = await this.ownershipChecker.ensureVehicleOwnership({
      ownerId,
      plate,
    });

    const debts = await this.debtRepo.findByVehicleId(vehicleId);

    return debts;
  }
}
