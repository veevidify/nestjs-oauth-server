import { JwtAuthenticatable } from 'src/auth/interfaces';
/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { classToPlain } from 'class-transformer';
import { Client } from 'src/entities/client.entity';
import { OAuthService } from './oauth/oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';

// services use external connectors (including db repository)
// all pure function, with mockable services dependencies
@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
    private oauthService: OAuthService,
  ) { }

  async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.getUserByUsername(username);

    if (user && User.validatePassword(user, password)) {
      return classToPlain(user);
    }

    return null;
  }

  async validateClient(clientId: string, clientSecret: string): Promise<Client | null> {
    const client = await this.oauthService.getClientById(clientId);

    if (client && Client.validateSecret(client, clientSecret)) {
      return client;
    }

    return null;
  }

  async validateAccessToken(token: string): Promise<AccessToken | null> {
    const accessToken = await this.oauthService.findAccessToken(token);

    return accessToken;
  }

  async authenticated(user: Partial<User>) {
    const payload: JwtAuthenticatable = {
      sub: user.id,
      roles: user.roles,
      username: user.username,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
