import { Injectable } from '@nestjs/common';

import * as OAuth2Server from 'oauth2-server';
import { OAuthService } from '../oauth.service';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { Callback, Falsey } from 'src/utils/types';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';

@Injectable()
export class AuthorizationCodeModel implements OAuth2Server.AuthorizationCodeModel {
  constructor(private oauthService: OAuthService) {}

  /**
   * Invoked to generate a new access token.
   *
   */
  generateAccessToken = async (
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> => {
    return '';
  };

  /**
   * Invoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
   *
   */
  getClient = async (
    clientId: string,
    clientSecret: string,
    callback?: Callback<Client | Falsey>,
  ): Promise<Client | Falsey> => {
    return false;
  };

  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   *
   */
  saveToken = async (
    token: AccessToken,
    client: Client,
    user: User,
    callback?: Callback<AccessToken>,
  ): Promise<AccessToken | Falsey> => {
    return false;
  };

  /**
   * Invoked to generate a new refresh token.
   *
   */
  generateRefreshToken = async (
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> => {
    return '';
  };

  /**
   * Invoked to generate a new authorization code.
   *
   */
  generateAuthorizationCode = async (
    client: Client,
    user: User,
    scope: string | string[],
    callback?: Callback<string>,
  ): Promise<string> => {
    return '';
  };

  /**
   * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
   *
   */
  getAuthorizationCode = async (
    authorizationCode: string,
    callback?: Callback<AuthorizationCode>,
  ): Promise<AuthorizationCode | Falsey> => {
    return false;
  };

  /**
   * Invoked to save an authorization code.
   *
   */
  saveAuthorizationCode = async (
    code: Pick<AuthorizationCode, 'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope'>,
    client: Client,
    user: User,
    callback?: Callback<AuthorizationCode>,
  ): Promise<AuthorizationCode | Falsey> => {
    return false;
  };

  /**
   * Invoked to revoke an authorization code.
   *
   */
  revokeAuthorizationCode = async (
    code: AuthorizationCode,
    callback?: Callback<boolean>,
  ): Promise<boolean> => {
    return false;
  };

  /**
   * Invoked to retrieve an existing access token previously saved through Model#saveToken().
   *
   */
  getAccessToken = async (
    accessToken: string,
    callback?: Callback<AccessToken>,
  ): Promise<AccessToken | Falsey> => {
    return false;
  };

  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   *
   */
  verifyScope = async (
    token: AccessToken,
    scope: string | string[],
    callback?: Callback<boolean>,
  ): Promise<boolean> => {
    return false;
  };

  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   *
   */
  validateScope = async (
    user: User,
    client: Client,
    scope: string | string[],
    callback?: Callback<string | Falsey>,
  ): Promise<string | string[] | Falsey> => {
    return false;
  };
}
