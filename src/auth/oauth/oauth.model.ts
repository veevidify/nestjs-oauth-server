import { Injectable } from '@nestjs/common';

import { OAuthService } from './oauth.service';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { Falsey, Nullable } from 'src/utils/types';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { flatMap, boolifyPromise, id } from 'src/utils/functions';
import { OAuth2Model } from './interfaces';

@Injectable()
export class OAuthModel implements OAuth2Model {
  constructor(
    private oauthService: OAuthService,
  ) {}

  /**
   * Invoked to generate a new access token.
   *
   */
  generateAccessToken = async (
    client: Client,
    user: User,
    scope: string | string[],
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
    clientSecret: Nullable<string>,
  ): Promise<Client | Falsey> => {
    if (clientSecret === null) {
      return await this.oauthService.getClientByClientId(clientId);
    } else {
      return await this.oauthService.validateClient(clientId, clientSecret);
    }
  };

  /**
   * Invoked to save an access token and optionally a refresh token, depending on the grant type.
   *
   */
  saveToken = async (
    token: AccessToken,
    client: Client,
    user: User,
  ): Promise<AccessToken | Falsey> => {
    return await this.oauthService.persistAccessToken(token, user, client);
  };

  /**
   * Invoked to generate a new authorization code.
   */
  generateAuthorizationCode = async (
    client: Client,
    user: User,
    scope: string | string[],
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
  getAuthorizationCode = async (authorizationCode: string): Promise<AuthorizationCode | Falsey> => {
    return await this.oauthService.findAuthorizationCode(authorizationCode);
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
  ): Promise<AuthorizationCode | Falsey> => {
    code.scope = flatMap([code.scope], id);
    return await this.oauthService.persistAuthorizationCode(code, client, user);
  };

  /**
   * Invoked to revoke an authorization code.
   *
   */
  revokeAuthorizationCode = async (code: AuthorizationCode): Promise<boolean> => {
    return await boolifyPromise(this.oauthService.removeAuthorizationCode(code));
  };

  /**
   * Invoked to retrieve an existing access token previously saved through Model#saveToken().
   *
   */
  getAccessToken = async (accessToken: string): Promise<AccessToken | Falsey> => {
    return await this.oauthService.findAccessToken(accessToken);
  };

  /**
   * Invoked during request authentication to check if the provided access token was authorized the requested scopes.
   *
   */
  verifyScope = async (token: AccessToken, scope: string | string[]): Promise<boolean> => {
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
  ): Promise<string | string[] | Falsey> => {
    const scopes = flatMap([scope], id);
    if (scopes.includes('admin') && !user.roles.includes('admin')) return false;

    return scope;
  };

  /**
   * Invoked to generate a new refresh token.
   *
   */
  generateRefreshToken = async (
    client: Client,
    user: User,
    scope: string | string[],
  ): Promise<string> => {
    const scopes = flatMap([scope], id);
    const accessToken = this.oauthService.createAccessToken(scopes, client, user);
    return accessToken.refreshToken;
  };

  /**
   * Invoked to retrieve an existing refresh token previously saved through Model#saveToken().
   *
   */
  getRefreshToken = async (refreshToken: string): Promise<AccessToken | Falsey> => {
    return await this.oauthService.findAccessTokenByRefreshToken(refreshToken);
  };


  /**
   * Invoked to revoke a refresh token.
   *
   */
  revokeToken = async (token: AccessToken): Promise<boolean> => {
    return await boolifyPromise(this.oauthService.removeAccessToken(token));
  };


  /**
   * Invoked to retrieve a user using a username/password combination.
   *
   */
  getUser = async (username: string, password: string): Promise<User | Falsey> => {
    return await this.oauthService.validateUser(username, password);
  };
}
