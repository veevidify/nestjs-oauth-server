import {
  Request,
  Response,
  AuthenticateOptions,
  AuthorizeOptions,
  ServerOptions,
  TokenOptions,
  OAuthError,
  UnauthorizedRequestError,
} from 'oauth2-server';
import * as NodeOAuthServer from 'oauth2-server';
import {
  RequestHandler,
  Response as ExpressResponse,
  Request as ExpressRequest,
  NextFunction,
} from 'express';
import { Injectable, Inject } from '@nestjs/common';

import { oauth as oauthConstants } from 'src/config/constants';
import { OAuth2Model } from '../interfaces';
import { oauth2Options } from '../oauth.config';

export interface IOAuthServerOptions extends ServerOptions {
  useErrorHandler?: boolean;
  continueMiddleware?: boolean;
}


@Injectable()
export class ExpressOAuth {
  private useErrorHandler: boolean;
  private continueMiddleware: boolean;
  private server: NodeOAuthServer;
  private options: IOAuthServerOptions;

  constructor(
    @Inject(oauthConstants.MODEL_INJECT_TOKEN) private oauthModel: OAuth2Model,
  ) {
    this.options = {
      model: this.oauthModel,
      ...oauth2Options,
    };

    this.useErrorHandler = this.options.useErrorHandler ? true : false;
    this.continueMiddleware = this.options.continueMiddleware ? true : false;

    this.server = new NodeOAuthServer(this.options);
  }

  private handleResponse = (
    req: ExpressRequest,
    res: ExpressResponse,
    response: Response,
  ): void => {
    if (response.status === 302) {
      const location = response.headers.location;
      delete response.headers.location;
      res.set(response.headers);
      res.redirect(location);
    } else {
      res.set(response.headers);
      res.status(response.status).send(response.body);
    }
  };

  private handleError = (
    e: OAuthError,
    req: ExpressRequest,
    res: ExpressResponse,
    response: Response,
    next: NextFunction,
  ): void => {
    if (this.useErrorHandler === true) {
      next(e);
    } else {
      if (response) {
        res.set(response.headers);
      }

      res.status(e.code);

      if (e instanceof UnauthorizedRequestError) {
        res.send();
        return;
      }

      res.send({ error: e.name, description: e.message });
    }
  };

  /**
   * Authentication Middleware.
   *
   * Returns a middleware that will validate a token.
   *
   * (See: https://tools.ietf.org/html/rfc6749#section-7)
   */
  public authenticate = (options?: AuthenticateOptions) => async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const request = new Request(req);
    const response = new Response(res);

    try {
      await this.server.authenticate(request, response, options);
      return this.handleResponse(req, res, response);
    } catch (e) {
      return this.handleError(e, req, res, null, next);
    }
  };

  /**
   * Authorization Middleware.
   *
   * Returns a middleware that will authorize a client to request tokens.
   *
   * (See: https://tools.ietf.org/html/rfc6749#section-3.1)
   */
  public authorize = (options?: AuthorizeOptions): RequestHandler => async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const request = new Request(req);
    const response = new Response(res);

    try {
      await this.server.authorize(request, response, options);
      return this.handleResponse(req, res, response);
    } catch (e) {
      return this.handleError(e, req, res, response, next);
    }
  };

  /**
   * Grant Middleware.
   *
   * Returns middleware that will grant tokens to valid requests.
   *
   * (See: https://tools.ietf.org/html/rfc6749#section-3.2)
   */
  token = (options?: TokenOptions): RequestHandler => async (
    req: ExpressRequest,
    res: ExpressResponse,
    next: NextFunction,
  ) => {
    const request = new Request(req);
    const response = new Response(res);

    try {
      await this.server.token(request, response, options);
      return this.handleResponse(req, res, response);
    } catch (e) {
      return this.handleError(e, req, res, response, next);
    }
  };
}
