import { DomainError } from '@core/domain/errors/DomainError';
import { parseVehiclePlateParams } from '@modules/vehicle/presentation/validation/registerVehicleValidation';
import { z } from 'zod';

const payDebtParamsSchema = z.object({
  debtId: z.string().min(1),
});

export function parseVehicleDebtsParams(params: unknown) {
  return parseVehiclePlateParams(params);
}

export function parsePayDebtParams(params: unknown) {
  const result = payDebtParamsSchema.safeParse(params ?? {});

  if (!result.success) {
    throw DomainError.validation('Invalid request params', {
      issues: result.error.issues,
    });
  }

  return result.data;
}
