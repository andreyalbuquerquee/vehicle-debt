import { expressRouteAdapter } from '@infra/http/expressRouteAdapter';
import { Router } from 'express';
import {
  makeLoginUserController,
  makeRegisterUserController,
} from '../compose/auth.compose';

const authRoutes = Router();

authRoutes.post('/register', expressRouteAdapter(makeRegisterUserController()));

authRoutes.post('/login', expressRouteAdapter(makeLoginUserController()));

export { authRoutes };
