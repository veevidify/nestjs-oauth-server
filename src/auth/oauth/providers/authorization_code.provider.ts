import { Injectable, Inject } from '@nestjs/common';
import { OAuth2Model } from '../interfaces';
import { OAuthService } from '../oauth.service';
import { oauth } from 'src/config/constants';

import * as ExpressOAuth from 'express-oauth-server';
import * as OAuth2 from 'oauth2-server';
import * as Express from 'express';
import { oauth2Options } from '../oauth.config';

@Injectable()
export class AuthorizationCodeProvider {
  private oauth: ExpressOAuth;

  public authenticateMiddleware: (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => Promise<OAuth2.Token>;

  public authorizeHandler: (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => Promise<OAuth2.AuthorizationCode>;

  public tokenExchange: (
    request: Express.Request,
    response: Express.Response,
    next: Express.NextFunction,
  ) => Promise<OAuth2.Token>;

  constructor(
    @Inject(oauth.MODEL_INJECT_TOKEN) private oauthModel: OAuth2Model,
    private oauthService: OAuthService,
  ) {
    this.oauth = new ExpressOAuth({
      model: this.oauthModel,
      ...oauth2Options,
    });

    this.authenticateMiddleware = this.oauth.authenticate();
    this.authorizeHandler = this.oauth.authorize();
    this.tokenExchange = this.oauth.token();
  }

  public setOAuth(oauth: ExpressOAuth) {
    this.oauth = oauth;
  }
}
