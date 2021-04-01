import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Strategy as PassportClientPasswordStrategy } from 'passport-oauth2-client-password';
import { AuthService } from 'src/auth/auth.service';
import { Client } from 'src/entities/client.entity';

// rely on services to provide necessary output
// effectful functions / throw exceptions
@Injectable()
export class ClientPasswordStrategy extends PassportStrategy(PassportClientPasswordStrategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(clientId: string, clientSecret: string): Promise<Partial<Client>> | never {
    const client = await this.authService.validateClient(clientId, clientSecret);

    if (!client) throw new UnauthorizedException('Invalid Client');
    return client;
  }
}
