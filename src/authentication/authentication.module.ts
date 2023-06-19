import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';

import { LocalStrategy } from './local.strategy';
import { JwtStrategy } from './jwt.strategy';
import { JwtRefreshTokenStrategy } from './jwt-refresh-token.strategy';
import { AuthenticationService } from './authentication.service';
import { UsersModule } from '../users/users.module';
import { AuthenticationController } from './authentication.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { JwtAllowAllStrategy } from './jwt-allow-all.strategy';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    ConfigModule,
    PrismaModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthenticationService,
    LocalStrategy,
    JwtStrategy,
    JwtRefreshTokenStrategy,
    JwtAllowAllStrategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
