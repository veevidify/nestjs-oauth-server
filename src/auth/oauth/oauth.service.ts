import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import * as createCuid from 'cuid';
import { addDays } from 'date-fns';
import { generateCode } from 'src/utils/functions';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(AuthorizationCode) private codeRepository: Repository<AuthorizationCode>,
    @InjectRepository(AccessToken) private accessTokenRepository: Repository<AccessToken>,
  ) {}

  // === repository wrappers === //

  public createAuthorizationCode(
    redirectUri: string,
    scope: string[],
    client?: Client,
    user?: User,
  ): AuthorizationCode {
    const authorizationCode = new AuthorizationCode();
    authorizationCode.authorizationCode = generateCode();
    authorizationCode.redirectUri = redirectUri;
    authorizationCode.scope = scope;
    authorizationCode.client = client;
    authorizationCode.user = user;

    return this.codeRepository.create(authorizationCode);
  }

  public async persistAuthorizationCode(
    authorizationCode: Partial<AuthorizationCode>,
    client?: Client,
    user?: User,
  ): Promise<AuthorizationCode | null> {
    authorizationCode.client = client;
    authorizationCode.user = user;

    return await this.codeRepository.save(authorizationCode);
  }

  public createAccessToken(scopes: string[], client?: Client, user?: User): AccessToken {
    const payload: Partial<AccessToken> = new AccessToken();
    payload.accessToken = createCuid();
    payload.accessTokenExpiresAt = addDays(new Date(), 7);
    payload.refreshToken = createCuid();
    payload.refreshTokenExpiresAt = addDays(new Date(), 14);
    payload.scope = scopes;
    payload.client = client;
    payload.user = user;

    return this.accessTokenRepository.create(payload);
  }

  public async persistAccessToken(
    token: Partial<AccessToken>,
    user?: User,
    client?: Client,
  ): Promise<AccessToken | null> {
    token.client = client;
    token.user = user;
    return await this.accessTokenRepository.save(token);
  }

  public async getClientByClientId(clientId: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { clientId } });
    return client;
  }

  public async findAuthorizationCode(authorizationCode: string): Promise<AuthorizationCode | null> {
    const code = await this.codeRepository.findOne({ where: { authorizationCode } });
    return code;
  }

  public async findAccessToken(accessToken: string): Promise<AccessToken | null> {
    const token = await this.accessTokenRepository.findOne({ where: { accessToken } });
    return token;
  }

  public async findAccessTokenByRefreshToken(refreshToken: string): Promise<AccessToken | null> {
    const token = await this.accessTokenRepository.findOne({ where: { refreshToken } });
    return token;
  }

  public async findAccessTokenByUserAndClient(
    user: User,
    client: Client,
  ): Promise<AccessToken | null> {
    const token = await this.accessTokenRepository.findOne({
      where: {
        userId: user.id,
        clientId: client.id,
      },
    });

    return token;
  }

  public async removeAuthorizationCode(code: AuthorizationCode) {
    return await this.codeRepository.delete(code.id);
  }

  public async removeAccessToken(token: AccessToken) {
    return await this.accessTokenRepository.delete(token.id);
  }

  public async removeAccessTokens(user: User, client: Client) {
    const currents = await this.accessTokenRepository.find({
      where: {
        userId: user.id,
        clientId: client.id,
      },
    });

    return await this.accessTokenRepository.delete(currents.map(token => token.id));
  }

  // == requires overlapping functions with authService to support password grant
  public async validateUser(username: string, password: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });

    if (user && User.validatePassword(user, password)) {
      return user;
    }

    return null;
  }

  async validateClient(clientId: string, clientSecret: string): Promise<Client | null> {
    const client = await this.getClientByClientId(clientId);

    if (client && Client.validateSecret(client, clientSecret)) {
      return client;
    }

    return null;
  }

  async validateAccessToken(accessToken: string): Promise<AccessToken | null> {
    // TODO: jwt-sign the token returned to user land
    const token = await this.findAccessToken(accessToken);

    return token;
  }

  // === end repository wrappers === //
}
