export interface RegisterVehicleDTO {
  ownerId: string;
  plate: string;
  renavam?: string | null;
  uf?: string | null;
}
