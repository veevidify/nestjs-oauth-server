import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy as PassportBearerStrategy } from 'passport-http-bearer';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';

import { oauth } from 'src/config/constants';
import { OAuthService } from '../oauth/oauth.service';

// rely on services to provide necessary output
// effectful functions / throw exceptions
@Injectable()
export class BearerStrategy extends PassportStrategy(PassportBearerStrategy, oauth.STRATEGY_BEARER) {
  constructor(private oauthService: OAuthService) {
    super();
  }

  async validate(token: string): Promise<Client | User | null> | never {
    const accessToken = await this.oauthService.validateAccessToken(token);

    if (!accessToken) throw new UnauthorizedException('Invalid Bearer Token');

    if (accessToken.user) return accessToken.user;
    else if (accessToken.client) return accessToken.client;
  }
}
