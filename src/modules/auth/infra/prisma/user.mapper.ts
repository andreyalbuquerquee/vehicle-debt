import { User } from '@modules/auth/domain/User';
import type { Prisma, User as PrismaUser } from '@prisma/client';

export function mapPrismaUserToDomain(user: PrismaUser) {
  return User.create(user.email, user.password, {
    id: user.id,
    createdAt: user.createdAt,
    updatedAt: user.createdAt,
  });
}

export function mapUserToPrisma(user: User): Prisma.UserUncheckedCreateInput {
  return {
    id: user.id,
    email: user.email.value,
    password: user.passwordHash,
    createdAt: user.createdAt,
  };
}
