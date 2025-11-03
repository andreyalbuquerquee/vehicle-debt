import { expressAuthGuardAdapter } from '@infra/http/expressAuthGuardAdapter';
import { expressRouteAdapter } from '@infra/http/expressRouteAdapter';
import { Router } from 'express';
import {
  makeGetVehicleByPlateController,
  makeJwtAuthGuard,
  makeListOwnerVehiclesController,
  makeRegisterVehicleController,
} from '../compose/vehicle.compose';

const vehicleRoutes = Router();
const authGuard = expressAuthGuardAdapter(makeJwtAuthGuard());

vehicleRoutes.use(authGuard);

vehicleRoutes.post('/', expressRouteAdapter(makeRegisterVehicleController()));
vehicleRoutes.get('/', expressRouteAdapter(makeListOwnerVehiclesController()));
vehicleRoutes.get(
  '/:plate',
  expressRouteAdapter(makeGetVehicleByPlateController()),
);

export { vehicleRoutes };
