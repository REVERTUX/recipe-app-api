import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Request } from 'express';
import { JwtCognitoService } from './jwtCognito.service';

@Injectable()
export default class JwtAuthenticationGuard implements CanActivate {
  constructor(private readonly cognito: JwtCognitoService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const { authorization } = request.headers;
    const user = await this.authorizeByCognito(authorization);
    request.user = user;
    return true;
  }

  public async authorizeByCognito(authorizationToken?: string): Promise<any> {
    if (!authorizationToken)
      throw new UnauthorizedException(`Authorization header is required.`);
    try {
      return await this.cognito.verifyUserJwt(authorizationToken);
    } catch (e) {
      if (e.name === 'NotAuthorizedException')
        throw new UnauthorizedException();
      throw e;
    }
  }
}
