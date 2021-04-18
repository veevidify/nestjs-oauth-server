import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { oauth } from 'src/config/constants';

@Injectable()
export class BearerAuthGuard extends AuthGuard(oauth.STRATEGY_BEARER) {
  handleRequest(err: Error, user, _info: any) {
    // You can throw an exception based on either "info" or "err" arguments
    console.log({ user });
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}
