import { Router } from 'express';
import { authRoutes } from '../../modules/auth/http/routes.express';

const routes = Router();

routes.use('/auth', authRoutes);

export { routes };
