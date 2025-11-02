import { DomainError } from '../../../../../src/core/domain/errors/DomainError';
import { VehiclePlate } from '../../../../../src/modules/vehicle/domain/value-objects/VehiclePlate';

describe('VehiclePlate', () => {
  it('normalizes plate to uppercase without separators', () => {
    const plate = VehiclePlate.create(' abc-1d23 ');
    expect(plate.value).toBe('ABC1D23');
  });

  it('accepts old plate format and removes hyphen', () => {
    const plate = VehiclePlate.create('abc-1234');
    expect(plate.value).toBe('ABC1234');
  });

  it('throws validation error for invalid plate', () => {
    expect(() => VehiclePlate.create('invalid')).toThrow(DomainError);
    expect(() => VehiclePlate.create('invalid')).toThrow(
      'Vehicle plate format is invalid',
    );
  });
});
