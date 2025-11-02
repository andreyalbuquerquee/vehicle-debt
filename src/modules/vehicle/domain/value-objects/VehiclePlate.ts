import { DomainError } from '../../../../core/domain/errors/DomainError';
import { ValueObject } from '../../../../core/domain/ValueObject';

const MERCOSUL_REGEX = /^[A-Z]{3}[0-9][A-Z][0-9]{2}$/;
const OLD_REGEX = /^[A-Z]{3}[0-9]{4}$/;

export class VehiclePlate extends ValueObject<string> {
  private constructor(plate: string) {
    super(plate);
  }

  static create(raw: string) {
    return new VehiclePlate(VehiclePlate.normalize(raw));
  }

  protected validate(plate: string): void {
    if (!plate) {
      throw DomainError.validation('Vehicle plate is required');
    }

    if (!(MERCOSUL_REGEX.test(plate) || OLD_REGEX.test(plate))) {
      throw DomainError.validation('Vehicle plate format is invalid', {
        plate,
      });
    }
  }

  private static normalize(raw: string) {
    const sanitized = raw.replace(/\s|-/g, '').toUpperCase();
    return sanitized;
  }
}
