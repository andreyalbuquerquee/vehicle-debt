import { DomainError } from '../../../../../src/core/domain/errors/DomainError';
import { VehicleRenavam } from '../../../../../src/modules/vehicle/domain/value-objects/VehicleRenavam';

describe('VehicleRenavam', () => {
  it('strips non digits and stores normalized value', () => {
    const renavam = VehicleRenavam.create(' 123.456.789-01 ');
    expect(renavam.value).toBe('12345678901');
  });

  it('throws validation error when renavam is not 11 digits', () => {
    expect(() => VehicleRenavam.create('123')).toThrow(DomainError);
    expect(() => VehicleRenavam.create('123')).toThrow(
      'Vehicle renavam must have 11 digits',
    );
  });
});
