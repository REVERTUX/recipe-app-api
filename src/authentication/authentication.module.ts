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
import { Jwt0Strategy } from './jwt0.strategy';
import { JwtCognitoService } from './jwtCognito.service';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ defaultStrategy: 'jwt' }),
    ConfigModule,
    PrismaModule,
    JwtModule.register({}),
  ],
  providers: [
    AuthenticationService,
    // LocalStrategy,
    JwtStrategy,
    // JwtRefreshTokenStrategy,
    // JwtAllowAllStrategy,
    // Jwt0Strategy,
  ],
  controllers: [AuthenticationController],
})
export class AuthenticationModule {}
