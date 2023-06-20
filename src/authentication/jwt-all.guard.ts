import { ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export default class JwtAllowAllGuard extends AuthGuard('jwt-all') {
  canActivate(context: ExecutionContext) {
    // Add your custom authentication logic here
    // for example, call super.logIn(request) to establish a session.
    return super.canActivate(context);
  }

  handleRequest(
    err: Error,
    user: any,
    info: any,
    context: ExecutionContext,
    status: any,
  ) {
    // You can throw an exception based on either "info" or "err" arguments
    if (err || !user) {
      return undefined;
    }
    return user;
  }
}
