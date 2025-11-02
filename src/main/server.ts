import { setEntityIdGenerator } from '../core/domain/Entity';
import { createApp } from '../infra/http/express-app';
import { UuidUniqueIdGenerator } from '../infra/identity/UuidUniqueIdGenerator';

setEntityIdGenerator(new UuidUniqueIdGenerator());

export const app = createApp();
