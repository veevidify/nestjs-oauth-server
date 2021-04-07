import { Injectable } from '@nestjs/common';

import * as OAuth2 from 'oauth2-server';
import { OAuthService } from '../oauth.service';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { Callback, Falsey } from 'src/utils/types';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { flatMap, boolifyPromise, id } from 'src/utils/functions';

@Injectable()
export class AuthorizationCodeModel implements OAuth2.AuthorizationCodeModel {
  constructor(private oauthService: OAuthService) {}

  /**
   * Invoked to generate a new access token.
   *
   */
  generateAccessToken = async (
    client: Client,
    user: User,
    scope: string | string[],
    _callback?: Callback<string>,
  ): Promise<string> => {
    const scopes = flatMap([scope], id);
    const accessToken = this.oauthService.createAccessToken(scopes, client, user);
    return accessToken.accessToken;
  };

  /**
   * Invoked to retrieve a client using a client id or a client id/client secret combination, depending on the grant type.
   *
   */
  getClient = async (
    clientId: string,
    clientSecret: string,
    _callback?: Callback<Client | Falsey>,
  ): Promise<Client | Falsey> => {
    return this.oauthService.validateClient(clientId, clientSecret);
  };

  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   *
   */
  saveToken = async (
    token: AccessToken,
    client: Client,
    user: User,
    _callback?: Callback<AccessToken>,
  ): Promise<AccessToken | Falsey> => {
    return this.oauthService.persistAccessToken(token, user, client);
  };

  /**
   * Invoked to generate a new authorization code.
   *
   */
  generateAuthorizationCode = async (
    client: Client,
    user: User,
    scope: string | string[],
    _callback?: Callback<string>,
  ): Promise<string> => {
    const scopes = flatMap([scope], id);
    const authorizationCode = this.oauthService.createAuthorizationCode(
      client.redirectUris[0] ?? '',
      scopes,
      client,
      user,
    );
    return authorizationCode.authorizationCode;
  };

  /**
   * Invoked to retrieve an existing authorization code previously saved through Model#saveAuthorizationCode().
   *
   */
  getAuthorizationCode = async (
    authorizationCode: string,
    _callback?: Callback<AuthorizationCode>,
  ): Promise<AuthorizationCode | Falsey> => {
    return this.oauthService.findAuthorizationCode(authorizationCode);
  };

  /**
   * Invoked to save an authorization code.
   * redirectUri is post-filled (after HTTP request)
   *
   */
  saveAuthorizationCode = async (
    code: Pick<AuthorizationCode, 'authorizationCode' | 'expiresAt' | 'redirectUri' | 'scope'>,
    client: Client,
    user: User,
    _callback?: Callback<AuthorizationCode>,
  ): Promise<AuthorizationCode | Falsey> => {
    return this.oauthService.persistAuthorizationCode(code, client, user);
  };

  /**
   * Invoked to revoke an authorization code.
   *
   */
  revokeAuthorizationCode = async (
    code: AuthorizationCode,
    _callback?: Callback<boolean>,
  ): Promise<boolean> => {
    return boolifyPromise(this.oauthService.removeAuthorizationCode(code));
  };

  /**
   * Invoked to retrieve an existing access token previously saved through Model#saveToken().
   *
   */
  getAccessToken = async (
    accessToken: string,
    _callback?: Callback<AccessToken>,
  ): Promise<AccessToken | Falsey> => {
    return this.oauthService.findAccessToken(accessToken);
  };

  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   *
   */
  verifyScope = async (
    token: AccessToken,
    scope: string | string[],
    _callback?: Callback<boolean>,
  ): Promise<boolean> => {
    return flatMap([scope], id).every(s => token.scope.includes(s));
  };

  /**
   * Invoked to check if the requested scope is valid for a particular client/user combination.
   *
   */
  validateScope = async (
    user: User,
    client: Client,
    scope: string | string[],
    _callback?: Callback<string | Falsey>,
  ): Promise<string | string[] | Falsey> => {
    const scopes = flatMap([scope], id);
    if (scopes.includes('admin')) return false;

    return scope;
  };
}
