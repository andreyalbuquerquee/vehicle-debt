import { Entity, type EntityOptions } from '@core/domain/Entity';
import { DomainError } from '@core/domain/errors/DomainError';
import type { DebtStatus } from './DebtStatus';
import { DEBT_TYPES, type DebtType } from './DebtType';

export interface DebtProps {
  vehicleId: string;
  type: DebtType;
  amount: number;
  status: DebtStatus;
  createdAt?: Date;
}

export class Debt extends Entity<DebtProps> {
  private constructor(props: DebtProps, options?: EntityOptions) {
    super(props, options);
  }

  static restore(props: DebtProps, options?: EntityOptions) {
    if (!props.vehicleId) {
      throw DomainError.invariant('Debt must be associated with a vehicle');
    }

    if (props.amount < 0) {
      throw DomainError.validation('Debt amount cannot be negative', {
        amount: props.amount,
      });
    }

    if (!DEBT_TYPES.includes(props.type)) {
      throw DomainError.validation('Debt type is invalid', {
        type: props.type,
      });
    }

    return new Debt(props, options);
  }

  get vehicleId() {
    return this.props.vehicleId;
  }

  get type() {
    return this.props.type;
  }

  get amount() {
    return this.props.amount;
  }

  get status(): DebtStatus {
    return this.props.status;
  }

  get isPaid() {
    return this.props.status === 'paid';
  }

  markAsPaid() {
    if (this.isPaid) return;
    this.props.status = 'paid';
    this.touch();
  }
}
