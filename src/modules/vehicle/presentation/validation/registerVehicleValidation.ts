import { DomainError } from '@core/domain/errors/DomainError';
import { VehiclePlate } from '@modules/vehicle/domain/value-objects/VehiclePlate';
import { VehicleRenavam } from '@modules/vehicle/domain/value-objects/VehicleRenavam';
import { VehicleUF } from '@modules/vehicle/domain/value-objects/VehicleUF';
import { z } from 'zod';

const registerVehicleSchema = z.object({
  plate: z
    .string()
    .min(1)
    .transform((value, ctx) => {
      try {
        return VehiclePlate.create(value).value;
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          message:
            error instanceof DomainError
              ? error.message
              : 'Vehicle plate format is invalid',
        });
        return z.NEVER;
      }
    }),
  renavam: z
    .string()
    .optional()
    .nullable()
    .transform((value, ctx) => {
      if (!value || value.trim() === '') return undefined;
      try {
        return VehicleRenavam.create(value).value;
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          message:
            error instanceof DomainError
              ? error.message
              : 'Vehicle renavam must have 11 digits',
          path: ['renavam'],
        });
        return z.NEVER;
      }
    }),
  uf: z
    .string()
    .optional()
    .nullable()
    .transform((value, ctx) => {
      if (!value || value.trim() === '') return undefined;
      try {
        return VehicleUF.create(value).value;
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          message:
            error instanceof DomainError
              ? error.message
              : 'Vehicle UF is invalid',
          path: ['uf'],
        });
        return z.NEVER;
      }
    }),
});

const vehiclePlateParamsSchema = z.object({
  plate: z
    .string()
    .min(1)
    .transform((value, ctx) => {
      try {
        return VehiclePlate.create(value).value;
      } catch (error) {
        ctx.addIssue({
          code: 'custom',
          message:
            error instanceof DomainError
              ? error.message
              : 'Vehicle plate format is invalid',
        });
        return z.NEVER;
      }
    }),
});

export type RegisterVehiclePayload = z.infer<typeof registerVehicleSchema>;
export type VehiclePlateParams = z.infer<typeof vehiclePlateParamsSchema>;

export function parseRegisterVehiclePayload(
  payload: unknown,
): RegisterVehiclePayload {
  const result = registerVehicleSchema.safeParse(payload ?? {});
  if (!result.success) {
    throw DomainError.validation('Invalid request body', {
      issues: result.error.issues,
    });
  }
  return result.data;
}

export function parseVehiclePlateParams(params: unknown): VehiclePlateParams {
  const result = vehiclePlateParamsSchema.safeParse(params ?? {});
  if (!result.success) {
    throw DomainError.validation('Invalid request params', {
      issues: result.error.issues,
    });
  }
  return result.data;
}
