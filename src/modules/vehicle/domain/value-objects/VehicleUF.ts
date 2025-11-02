import { DomainError } from '../../../../core/domain/errors/DomainError';
import { ValueObject } from '../../../../core/domain/ValueObject';
import { BRAZILIAN_UFS } from '../../../../core/shared/data/brazilianUfs';

const VALID_UF = new Set<string>(BRAZILIAN_UFS);

export class VehicleUF extends ValueObject<string | undefined> {
  private constructor(uf: string | undefined) {
    super(uf);
  }

  static create(raw?: string | null) {
    if (raw === undefined || raw === null || raw.trim() === '') {
      return new VehicleUF(undefined);
    }

    return new VehicleUF(raw.trim().toUpperCase());
  }

  protected validate(uf: string | undefined): void {
    if (!uf) return;

    if (!VALID_UF.has(uf)) {
      throw DomainError.validation('Vehicle UF is invalid', { uf });
    }
  }
}
