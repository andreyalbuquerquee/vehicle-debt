import { Entity, type EntityOptions } from '../../../core/domain/Entity';
import { DomainError } from '../../../core/domain/errors/DomainError';
import { VehiclePlate } from './value-objects/VehiclePlate';
import { VehicleRenavam } from './value-objects/VehicleRenavam';
import { VehicleUF } from './value-objects/VehicleUF';

export interface VehicleProps {
  ownerId: string;
  plate: VehiclePlate;
  renavam?: VehicleRenavam;
  uf?: VehicleUF;
}

export class Vehicle extends Entity<VehicleProps> {
  private constructor(props: VehicleProps, options?: EntityOptions) {
    super(props, options);
  }

  static register(
    ownerId: string,
    plate: string,
    data?: {
      renavam?: string | null;
      uf?: string | null;
    },
    options?: EntityOptions,
  ) {
    if (!ownerId) {
      throw DomainError.validation('Vehicle owner id is required');
    }

    return new Vehicle(
      {
        ownerId,
        plate: VehiclePlate.create(plate),
        renavam: data?.renavam
          ? VehicleRenavam.create(data.renavam)
          : undefined,
        uf: VehicleUF.create(data?.uf ?? undefined),
      },
      options,
    );
  }

  get ownerId() {
    return this.props.ownerId;
  }

  get plate() {
    return this.props.plate;
  }

  get renavam() {
    return this.props.renavam;
  }

  get uf() {
    return this.props.uf;
  }
}
