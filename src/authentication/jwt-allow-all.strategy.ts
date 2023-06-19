// import { ExtractJwt, Strategy } from 'passport-jwt';
// import { AuthGuard, PassportStrategy } from '@nestjs/passport';
// import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
// import { ConfigService } from '@nestjs/config';
// import { Request } from 'express';
// import { UsersService } from '../users/users.service';
// import { TokenPayload } from './tokenPayload.interface';
// import { User } from '@prisma/client';

// @Injectable()
// export class UserProfileGuard extends AuthGuard('jwt') implements CanActivate {
//   constructor(private readonly userService: UsersService) {
//     super();
//   }
//   async canActivate(context: ExecutionContext): Promise<boolean> {
//     const isAuth = await super.canActivate(context);
//     if (!isAuth) {
//       return true; // Allow unauthenticated users
//     }

//     const request = context.switchToHttp().getRequest<Request>();
//     const user = request.user;
//     if (user) {
//       // Provide the user profile if authenticated
//       request.user = await this.getUserProfile(user.id);
//     }

//     return true;
//   }

//   private async getUserProfile(userId: string): Promise<User | undefined> {
//     // Implement your logic to fetch and return the user profile based on the user ID
//     // Return undefined if the user profile is not found or an error occurs
//     return this.userService.getUserById(payload.userId);
//   }
// }

import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Request } from 'express';
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
    });
  }

  async validate(payload: TokenPayload) {
    return this.userService.getUserById(payload.userId);
  }

  //   authenticate(request: Request): void {
  //   const { headers } = request;
  //   const apiKey = headers.authorization;
  //   // const ironfishApiKey = this.config.get<string>('IRONFISH_API_KEY');
  //   // if (apiKey !== `Bearer ${ironfishApiKey}`) {
  //   //   throw new UnauthorizedException();
  //   // }
  //   return this.pass();
  // }
}
