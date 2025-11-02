import { Router } from 'express';
import { authRoutes } from '../../modules/auth/http/routes.express';
import { vehicleRoutes } from '../../modules/vehicle/http/routes.express';

const routes = Router();

routes.use('/auth', authRoutes);
routes.use('/vehicle', vehicleRoutes);

export { routes };
