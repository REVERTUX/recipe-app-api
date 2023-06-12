import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class UsersRepository {
  constructor(private prisma: PrismaService) {}

  createUser(params: { data: CreateUserDto; select: Prisma.UserSelect }) {
    const { data, select } = params;
    return this.prisma.user.create({ data, select });
  }

  getUserWithPasswordBy(params: { where: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.prisma.user.findFirstOrThrow({
      where,
      select: { name: true, email: true, id: true, password: true },
    });
  }

  getUserBy(params: { where: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.prisma.user.findFirstOrThrow({
      where,
      select: {
        name: true,
        email: true,
        id: true,
        currentHashedRefreshToken: true,
      },
    });
  }

  getUserPasswordBy(params: { where: Prisma.UserWhereInput }) {
    const { where } = params;
    return this.prisma.user.findFirstOrThrow({
      where,
      select: { password: true },
    });
  }

  updateRefreshToken(currentHashedRefreshToken: string | null, userId: string) {
    return this.prisma.user.update({
      data: { currentHashedRefreshToken },
      where: { id: userId },
    });
  }
}
