import { Injectable, UnauthorizedException } from '@nestjs/common';
import {
  createServer as createOAuth2Service,
  grant as OAuth2Grant,
  exchange as OAuth2Exchange,
  SerializeClientDoneFunction,
  DeserializeClientDoneFunction,
  ExchangeDoneFunction,
} from 'oauth2orize';
import { InjectRepository } from '@nestjs/typeorm';
import { Client } from 'src/entities/client.entity';
import { Repository } from 'typeorm';
import * as createCuid from 'cuid';
import { User } from 'src/entities/user.entity';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';

interface GrantCodeAssoc {
  clientId: string;
  redirectUri: string;
  username: string;
}

interface AccessTokenAssoc {
  clientId: string;
  username: string;
}

@Injectable()
export class OAuthService {
  service = createOAuth2Service();

  constructor(
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(AuthorizationCode) private codeRepository: Repository<AuthorizationCode>,
    @InjectRepository(AccessToken) private tokenRepository: Repository<AccessToken>,
  ) {
    // register service methods
    this.service.serializeClient(this.clientSerialiser);
    this.service.deserializeClient(this.clientDeserialiser);
    this.service.grant(OAuth2Grant.code(this.clientCodeGenerator));
    this.service.exchange(OAuth2Exchange.code(this.codeTokenExchangeHelper));
  }

  private clientSerialiser = (client: Client, done: SerializeClientDoneFunction) => {
    done(null, client.clientId);
  };

  private clientDeserialiser = async (clientId: string, done: DeserializeClientDoneFunction) => {
    const client = await this.clientRepository.findOneOrFail(clientId);
    if (clientId === client.id) {
      done(null, client);
    }

    done(new UnauthorizedException('Invalid Client ID'));
  };

  private clientCodeGenerator = async (
    client: Client,
    redirectUri: string,
    user: User,
    _ares: any,
    done: (err: Nullable<Error>, code: string) => void,
  ) => {
    const code = createCuid();

    await this.createAuthorizationCode(code, redirectUri, client, user);

    return done(null, code);
  };

  private codeTokenExchangeHelper = async (
    client: Client,
    code: string,
    redirectUri: string,
    done: ExchangeDoneFunction,
  ) => {
    const authorizationCode = await this.codeRepository.findOne({ where: { code } });

    if (!authorizationCode) {
      return done(new UnauthorizedException('Invalid Grant Code'));
    }

    if (client.id !== authorizationCode.client.id) {
      return done(new UnauthorizedException('Invalid Client ID'));
    }

    if (redirectUri !== authorizationCode.redirectUri) {
      return done(new UnauthorizedException('Invalid Redirect URI'));
    }

    const token = createCuid();
    await this.createAccessToken(token, client, authorizationCode);

    return done(null, token);
  };

  // === //
  public async createAuthorizationCode(
    code: string,
    redirectUri: string,
    client: Client,
    user: User
  ): Promise<AuthorizationCode | null> {
    const authorizationCode = new AuthorizationCode();
    authorizationCode.client = client;
    authorizationCode.code = code;
    authorizationCode.redirectUri = redirectUri;
    authorizationCode.user = user;

    const resultCode = this.codeRepository.create(authorizationCode);
    return await this.codeRepository.save(resultCode);
  }

  public async createAccessToken(
    token: string,
    client: Client,
    authorizationCode: AuthorizationCode
  ): Promise<AccessToken | null> {
    const accessToken: Partial<AccessToken> = new AccessToken();
    accessToken.token = token;
    accessToken.client = client;
    accessToken.user = authorizationCode.user;

    const resultToken = this.tokenRepository.create(accessToken);
    return await this.tokenRepository.save(resultToken);
  }

  public async getClientById(clientId: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { clientId } });
    return client;
  }

  public async findAccessToken(token: string): Promise<AccessToken | null> {
    const accessToken = await this.tokenRepository.findOne({ where: { token } });
    return accessToken;
  }
}
