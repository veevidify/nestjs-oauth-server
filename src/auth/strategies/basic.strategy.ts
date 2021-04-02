import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { BasicStrategy as PassportBasicStrategy } from 'passport-http';
import { AuthService } from 'src/auth/auth.service';
import { Client } from 'src/entities/client.entity';

import { oauth } from 'src/config/constants';

// rely on services to provide necessary output
// effectful functions / throw exceptions
@Injectable()
export class ClientBasicStrategy extends PassportStrategy(PassportBasicStrategy, oauth.STRATEGY_BASIC) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(clientId: string, clientSecret: string): Promise<Partial<Client>> | never {
    const client = await this.authService.validateClient(clientId, clientSecret);

    if (!client) throw new UnauthorizedException('Invalid Client');
    return client;
  }
}
