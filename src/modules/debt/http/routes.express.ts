import { Router } from 'express';
import { expressAuthGuardAdapter } from '../../../infra/http/expressAuthGuardAdapter';
import { expressRouteAdapter } from '../../../infra/http/expressRouteAdapter';
import {
  makeDebtAuthGuard,
  makeListVehicleDebtsController,
  makePayDebtController,
} from '../compose/debt.compose';

const debtRoutes = Router();
const authGuard = expressAuthGuardAdapter(makeDebtAuthGuard());

debtRoutes.use(authGuard);

debtRoutes.get(
  '/vehicle/:plate/debt',
  expressRouteAdapter(makeListVehicleDebtsController()),
);

debtRoutes.post(
  '/debt/:debtId/pay',
  expressRouteAdapter(makePayDebtController()),
);

export { debtRoutes };
