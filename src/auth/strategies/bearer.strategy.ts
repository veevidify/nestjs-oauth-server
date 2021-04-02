import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy as PassportBearerStrategy } from 'passport-http-bearer';
import { AuthService } from 'src/auth/auth.service';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';

import { oauth } from 'src/config/constants';

// rely on services to provide necessary output
// effectful functions / throw exceptions
@Injectable()
export class BearerStrategy extends PassportStrategy(PassportBearerStrategy, oauth.STRATEGY_BEARER) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(token: string): Promise<Client | User | null> | never {
    const accessToken = await this.authService.validateAccessToken(token);

    if (!accessToken) throw new UnauthorizedException('Invalid Bearer Token');

    if (accessToken.user) return accessToken.user;
    else if (accessToken.client) return accessToken.client;
  }
}
