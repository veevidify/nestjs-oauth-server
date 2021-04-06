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
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/users/users.service';
import { classToPlain } from 'class-transformer';

type IssueGrantCodeDoneFunction = (err: Error | null, code?: string) => void;
type IssueGrantTokenDoneFunction = (err: Error | null, token?: string, params?: any) => void;

@Injectable()
export class OAuthService {
  service = createOAuth2Service();

  // === initialise oauth2orize === //

  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(Client) private clientRepository: Repository<Client>,
    @InjectRepository(AuthorizationCode) private codeRepository: Repository<AuthorizationCode>,
    @InjectRepository(AccessToken) private accessTokenRepository: Repository<AccessToken>,
    @InjectRepository(RefreshToken) private refreshTokenRepository: Repository<RefreshToken>,
    private userService: UsersService,
  ) {
    // register service methods
    this.service.serializeClient(this.clientSerialiser);
    this.service.deserializeClient(this.clientDeserialiser);

    // grant types
    this.service.grant(OAuth2Grant.code(this.authorizationCodeGrant));
    this.service.grant(OAuth2Grant.token(this.implicitGrant));

    // tokens exchange
    this.service.exchange(OAuth2Exchange.code(this.codeTokenExchange));
    this.service.exchange(OAuth2Exchange.password(this.usernamePasswordTokenExchange));
    this.service.exchange(OAuth2Exchange.clientCredentials(this.clientIdSecretTokenExchange));
    this.service.exchange(OAuth2Exchange.refreshToken(this.refreshToken));
  }

  // == client serialiser & deserialiser

  // When a client redirects a user to user authorization endpoint, an
  // authorization transaction is initiated. To complete the transaction, the
  // user must authenticate and approve the authorization request. Because this
  // may involve multiple HTTP request/response exchanges, the transaction is
  // stored in the session.

  // An application must supply serialization functions, which determine how the
  // client object is serialized into the session. Typically this will be a
  // simple matter of serializing the client's ID, and deserializing by finding
  // the client by ID from the database.
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

  // create access token & refresh token
  private async issueTokenPair(userId: string, clientId: string) {
    const [user, client] = await Promise.all([
      this.userRepository.findOne(userId),
      this.clientRepository.findOne(clientId),
    ]);

    const accessTokenString = createCuid();
    const refreshTokenString = createCuid();

    const [accessToken, refreshToken] = await Promise.all([
      this.createAccessToken(accessTokenString, client, user),
      this.createRefreshToken(refreshTokenString, client, user),
    ]);

    return {
      accessToken,
      refreshToken,
      client,
      user,
    };
  }

  // == supported Grant types

  // Grant authorization codes. The callback takes the `client` requesting
  // authorization, the `redirectUri` (which is used as a verifier in the
  // subsequent exchange), the authenticated `user` granting access, and
  // their response, which contains approved scope, duration, etc. as parsed by
  // the application. The application issues a code, which is bound to these
  // values, and will be exchanged for an access token.
  // constructor => oauth2orize.grant.code callback
  private authorizationCodeGrant = async (
    client: Client,
    redirectUri: string,
    user: User,
    _ares: any,
    done: IssueGrantCodeDoneFunction,
  ) => {
    const code = createCuid();

    try {
      await this.createAuthorizationCode(code, redirectUri, client, user);
      return done(null, code);
    } catch (err) {
      return done(err, null);
    }
  };

  // Grant implicit authorization. The callback takes the `client` requesting
  // authorization, the authenticated `user` granting access, and
  // their response, which contains approved scope, duration, etc. as parsed by
  // the application. The application issues a token, which is bound to these
  // values.
  // constructor => oauth2orize.grant.token callback
  private implicitGrant = async (
    client: Client,
    user: User,
    _ares: any,
    done: IssueGrantTokenDoneFunction,
  ) => {
    try {
      const { refreshToken } = await this.issueTokenPair(user.id, client.id);
      const params = { username: user.username };
      return done(null, refreshToken.token, params);
    } catch (err) {
      done(err, null);
    }
  };

  // == supported token exchanges

  // Exchange authorization codes for access tokens. The callback accepts the
  // `client`, which is exchanging `code` and any `redirectUri` from the
  // authorization request for verification. If these values are validated, the
  // application issues an access token on behalf of the user who authorized the
  // code. The issued access token response can include a refresh token and
  // custom parameters by adding these to the `done()` call
  // constructor => oauth2orize.exchange.code callback
  private codeTokenExchange = async (
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

    try {
      const { accessToken, refreshToken, user } = await this.issueTokenPair(
        authorizationCode.user.id,
        client.id,
      );
      const params = { username: user.username };
      return done(null, accessToken.token, refreshToken.token, params);
    } catch (err) {
      return done(err, false, null, {});
    }
  };

  // Exchange user id and password for access tokens. The callback accepts the
  // `client`, which is exchanging the user's name and password from the
  // authorization request for verification. If these values are validated, the
  // application issues an access token on behalf of the user who authorized the code.
  // constructor => oauth2orize.exchange.password callback
  private usernamePasswordTokenExchange = async (
    client: Client,
    username: string,
    password: string,
    done: ExchangeDoneFunction,
  ) => {
    try {
      const [user, dbClient] = await Promise.all([
        this.validateUser(username, password),
        this.validateClient(client.clientId, client.clientSecret),
      ]);
      if (!user || !client) {
        return done(null, false, null, {});
      }

      const { accessToken, refreshToken } = await this.issueTokenPair(user.id, dbClient.id);
      const params = { username: user.username };
      return done(null, accessToken.token, refreshToken.token, params);
    } catch (err) {
      return done(err, false, null, {});
    }
  };

  // Exchange the client id and password/secret for an access token. The callback accepts the
  // `client`, which is exchanging the client's id and password/secret from the
  // authorization request for verification. If these values are validated, the
  // application issues an access token on behalf of the client who authorized the code.
  // constructor => oauth2orize.exchange.clientCredentials callback
  // CURRENTLY UNSUPPORTED. If support, token entities need to be refactored to relate optionally to User
  private clientIdSecretTokenExchange = async () => {};

  // Exchange refresh token with a new pair of Access token and Refresh token
  // issue new tokens and remove the old ones
  // constructor => oauth2orize.exchange.refreshToken callback
  private refreshToken = async (client: Client, token: string, done: ExchangeDoneFunction) => {
    try {
      const [refreshToken, dbClient] = await Promise.all([
        this.refreshTokenRepository.findOne({ where: { token } }),
        this.validateClient(client.clientId, client.clientSecret),
      ]);

      if (refreshToken === null || dbClient === null) {
        return done(null, false, null, {});
      }

      const user = refreshToken.user;
      const {
        accessToken: newAccessToken,
        refreshToken: newRefreshToken,
      } = await this.issueTokenPair(user.id, client.id);

      // remove existings
      await Promise.all([
        this.removeAccessTokens(user, dbClient),
        this.removeRefreshTokens(user, dbClient),
      ]);

      const params = { username: user.username };
      return done(null, newAccessToken.token, newRefreshToken.token, params);
    } catch (err) {
      return done(err, false, null, {});
    }
  };

  // === end initialise oauth2orize === //

  // === method for oauth controllers token exchange === //

  public async createAuthorizationCode(
    code: string,
    redirectUri: string,
    client: Client,
    user: User,
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
    user: User,
  ): Promise<AccessToken | null> {
    const accessToken: Partial<AccessToken> = new AccessToken();
    accessToken.token = token;
    accessToken.client = client;
    accessToken.user = user;

    const resultToken = this.accessTokenRepository.create(accessToken);
    return await this.accessTokenRepository.save(resultToken);
  }

  public async createRefreshToken(
    token: string,
    client: Client,
    user: User,
  ): Promise<RefreshToken | null> {
    const refreshToken: Partial<AccessToken> = new AccessToken();
    refreshToken.token = token;
    refreshToken.client = client;
    refreshToken.user = user;

    const resultToken = this.refreshTokenRepository.create(refreshToken);
    return await this.refreshTokenRepository.save(resultToken);
  }

  public async getClientById(clientId: string): Promise<Client | null> {
    const client = await this.clientRepository.findOne({ where: { clientId } });
    return client;
  }

  public async findAccessToken(token: string): Promise<AccessToken | null> {
    const accessToken = await this.accessTokenRepository.findOne({ where: { token } });
    return accessToken;
  }

  public async findRefreshToken(token: string): Promise<RefreshToken | null> {
    const refreshToken = await this.refreshTokenRepository.findOne({ where: { token } });
    return refreshToken;
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

  public async removeRefreshTokens(user: User, client: Client) {
    const currents = await this.refreshTokenRepository.find({
      where: {
        userId: user.id,
        clientId: client.id,
      },
    });

    return await this.refreshTokenRepository.delete(currents.map(token => token.id));
  }

  // == requires overlapping functions with authService to support password grant
  public async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.getUserByUsername(username);

    if (user && User.validatePassword(user, password)) {
      return classToPlain(user);
    }

    return null;
  }

  async validateClient(clientId: string, clientSecret: string): Promise<Client | null> {
    const client = await this.getClientById(clientId);

    if (client && Client.validateSecret(client, clientSecret)) {
      return client;
    }

    return null;
  }

  // === end method for oauth controllers token exchange === //
}
