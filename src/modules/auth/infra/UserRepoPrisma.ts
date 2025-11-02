import type { PrismaClient } from '@prisma/client';
import type { IUserRepo } from '../domain/IUserRepo';
import type { User } from '../domain/User';
import type { UserEmail } from '../domain/UserEmail';
import { mapPrismaUserToDomain, mapUserToPrisma } from './prisma/user.mapper';

export class UserRepoPrisma implements IUserRepo {
  constructor(private readonly prisma: PrismaClient) {}

  async findByEmail(email: UserEmail) {
    const record = await this.prisma.user.findUnique({
      where: { email: email.value },
    });

    return record ? mapPrismaUserToDomain(record) : null;
  }

  async create(user: User) {
    const data = mapUserToPrisma(user);
    const created = await this.prisma.user.create({ data });
    return mapPrismaUserToDomain(created);
  }
}
