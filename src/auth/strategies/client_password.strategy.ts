import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy as PassportClientPasswordStrategy } from 'passport-oauth2-client-password';
import { Client } from 'src/entities/client.entity';

import { oauth } from 'src/config/constants';
import { OAuthService } from '../oauth/oauth.service';

// rely on services to provide necessary output
// effectful functions / throw exceptions
@Injectable()
export class ClientPasswordStrategy extends PassportStrategy(PassportClientPasswordStrategy, oauth.STRATEGY_CLIENT_PASSWORD) {
  constructor(private oauthService: OAuthService) {
    super();
  }

  async validate(clientId: string, clientSecret: string): Promise<Partial<Client>> | never {
    const client = await this.oauthService.validateClient(clientId, clientSecret);

    if (!client) throw new UnauthorizedException('Invalid Client');
    return client;
  }
}
