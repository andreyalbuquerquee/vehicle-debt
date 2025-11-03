export interface VehicleOwnershipCheckerInput {
  ownerId: string;
  plate: string;
}

export interface VehicleOwnershipCheckerOutput {
  vehicleId: string;
}

export interface VehicleOwnershipChecker {
  ensureVehicleOwnership(
    params: VehicleOwnershipCheckerInput,
  ): Promise<VehicleOwnershipCheckerOutput>;
}
