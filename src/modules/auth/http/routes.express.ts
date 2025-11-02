import { Router } from 'express';
import { expressRouteAdapter } from '../../../infra/http/expressRouteAdapter';
import {
  makeLoginUserController,
  makeRegisterUserController,
} from '../compose/auth.compose';

const authRoutes = Router();

authRoutes.post('/register', expressRouteAdapter(makeRegisterUserController()));

authRoutes.post('/login', expressRouteAdapter(makeLoginUserController()));

export { authRoutes };
