import { DomainError } from '../../../../core/domain/errors/DomainError';
import { ValueObject } from '../../../../core/domain/ValueObject';

const RENAVAM_REGEX = /^[0-9]{11}$/;

export class VehicleRenavam extends ValueObject<string> {
  private constructor(value: string) {
    super(value);
  }

  static create(raw: string) {
    return new VehicleRenavam(VehicleRenavam.normalize(raw));
  }

  protected validate(value: string): void {
    if (!RENAVAM_REGEX.test(value)) {
      throw DomainError.validation('Vehicle renavam must have 11 digits', {
        renavam: value,
      });
    }
  }

  private static normalize(raw: string) {
    return raw.replace(/\D/g, '');
  }
}
