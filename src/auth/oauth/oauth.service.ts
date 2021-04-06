import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { classToPlain } from 'class-transformer';

@Injectable()
export class OAuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(AuthorizationCode) private codeRepository: Repository<AuthorizationCode>,
    @InjectRepository(AccessToken) private accessTokenRepository: Repository<AccessToken>,
  ) {
    // register service methods
  }

  // === repository wrappers === //

  public createAuthorizationCode(
    code: string,
    redirectUri: string,
    client: Client,
    user: User,
  ): AuthorizationCode {
    const authorizationCode = new AuthorizationCode();
    authorizationCode.client = client;
    authorizationCode.code = code;
    authorizationCode.redirectUri = redirectUri;
    authorizationCode.user = user;

    const resultCode = this.codeRepository.create(authorizationCode);
    // return await this.codeRepository.save(resultCode);
    return resultCode;
  }

  public createAccessToken(
    token: string,
    client: Client,
    user: User,
  ): AccessToken {
    const payload: Partial<AccessToken> = new AccessToken();
    payload.token = token;
    payload.client = client;
    payload.user = user;

    const accessToken = this.accessTokenRepository.create(payload);
    // return await this.accessTokenRepository.save(accessToken);
    return accessToken;
  }

  public async getClientByClientId(clientId: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { clientId } });
    return client;
  }

  public async findAccessToken(token: string): Promise<AccessToken | null> {
    const accessToken = await this.accessTokenRepository.findOne({ where: { token } });
    return accessToken;
  }

  public async findAccessTokenByUserAndClient(
    user: User,
    client: Client,
  ): Promise<AccessToken | null> {
    const accessToken = await this.accessTokenRepository.findOne({
      where: {
        userId: user.id,
        clientId: client.id,
      },
    });

    return accessToken;
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
  public async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userRepository.findOne({ where: { username }});

    if (user && User.validatePassword(user, password)) {
      return classToPlain(user);
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

  // === end repository wrappers === //
}
