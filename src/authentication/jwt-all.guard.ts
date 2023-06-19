import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Observable } from 'rxjs';

@Injectable()
// extends AuthGuard('jwt-all')
export default class JwtAllGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    // const request = context.switchToHttp().getRequest();
    // console.log(request);

    // if (token) {
    //   const payload = this.jwtService.verify(token);
    //   // You can access the user ID from the payload and do something with it
    //   console.log('User ID:', payload.userId);
    // }

    // Return true to allow unauthenticated users
    return true;
  }
}
