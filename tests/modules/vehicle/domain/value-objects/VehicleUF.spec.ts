import { DomainError } from '../../../../../src/core/domain/errors/DomainError';
import { VehicleUF } from '../../../../../src/modules/vehicle/domain/value-objects/VehicleUF';

describe('VehicleUF', () => {
  it('normalizes uf to uppercase', () => {
    const uf = VehicleUF.create('sp');
    expect(uf.value).toBe('SP');
  });

  it('returns undefined for empty values', () => {
    const uf = VehicleUF.create('');
    expect(uf.value).toBeUndefined();
  });

  it('throws validation error for invalid uf', () => {
    expect(() => VehicleUF.create('xx')).toThrow(DomainError);
    expect(() => VehicleUF.create('xx')).toThrow('Vehicle UF is invalid');
  });
});
