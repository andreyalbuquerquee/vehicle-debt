import { v7 as uuid } from 'uuid';
import type { UniqueIdGenerator } from '../../core/domain/UniqueIdGenerator';

export class UuidUniqueIdGenerator implements UniqueIdGenerator {
  generate(): string {
    return uuid();
  }
}
