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
  // TODO: persist code instead of using class prop
  grantCodes: Record<string, GrantCodeAssoc> = {};
  // TODO: persist token instead of using class prop
  accessTokens: Record<string, AccessTokenAssoc> = {};

  constructor(@InjectRepository(Client) private clientRepository: Repository<Client>) {
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

  private clientCodeGenerator = (
    client: Client,
    redirectUri: string,
    user: User,
    _ares: any,
    done: (err: Nullable<Error>, code: string) => void,
  ) => {
    const code = createCuid();

    this.grantCodes[code] = {
      clientId: client.id,
      redirectUri,
      username: user.username,
    };

    return done(null, code);
  };

  private codeTokenExchangeHelper = (client: Client, code: string, redirectUri: string, done: ExchangeDoneFunction) => {
    const grantCode = this.grantCodes[code];

    if (!grantCode) {
      return done(new UnauthorizedException('Invalid Grant Code'));
    }

    if (client.id !== grantCode.clientId) {
      return done(new UnauthorizedException('Invalid Client ID'));
    }

    if (redirectUri !== grantCode.redirectUri) {
      return done(new UnauthorizedException('Invalid Redirect URI'));
    }

    const token = createCuid();

    this.accessTokens[token] = {
      username: grantCode.username,
      clientId: client.id,
    };

    return done(null, token);
  };
}
