import { Injectable } from '@nestjs/common';
import { OAuthService } from './oauth.service';

import * as Express from 'express';
import { ExpressOAuth } from './providers/oauth2.express';

@Injectable()
export class AuthorizationCodeProvider {

  public authenticateMiddleware: (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => Promise<void>;

  public authorizeHandler: (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => Promise<void>;

  public tokenExchange: (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => Promise<void>;

  constructor(
    private oauthService: OAuthService,
    private expressOAuth: ExpressOAuth,
  ) {
    this.authenticateMiddleware = this.expressOAuth.authenticate();
    this.authorizeHandler = this.expressOAuth.authorize({
      authenticateHandler: { handle: (req: Express.Request) => req.user }
    });
    this.tokenExchange = this.expressOAuth.token();
  }

  public setOAuth(oauth: ExpressOAuth) {
    this.expressOAuth = oauth;
  }
}
