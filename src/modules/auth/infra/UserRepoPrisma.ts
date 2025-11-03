import type { IUserRepo } from '@modules/auth/domain/IUserRepo';
import type { User } from '@modules/auth/domain/User';
import type { UserEmail } from '@modules/auth/domain/UserEmail';
import type { PrismaClient } from '@prisma/client';
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
