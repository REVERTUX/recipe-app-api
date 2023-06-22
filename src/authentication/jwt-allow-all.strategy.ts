import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
import jwt_decode from 'jwt-decode';

import { UsersService } from '../users/users.service';
import { TokenPayload } from './tokenPayload.interface';

@Injectable()
export class JwtAllowAllStrategy extends PassportStrategy(Strategy, 'jwt-all') {
  constructor(
    private readonly configService: ConfigService,
    private readonly userService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (request: Request) => {
          return request?.cookies?.Authentication;
        },
      ]),
      secretOrKey: configService.get('JWT_ACCESS_TOKEN_SECRET'),
      passReqToCallback: true,
    });
  }

  async validate(payload: Request) {
    const user: TokenPayload = jwt_decode(payload.cookies.Authentication);
    return this.userService.getUserById(user.userId);
  }
}
