/* eslint-disable @typescript-eslint/camelcase */
import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { omit } from 'src/utils/functions';

// services use external connectors (including db repository)
// all pure function, with mockable services dependencies
@Injectable()
export class AuthService {
  constructor(private userService: UsersService, private jwtService: JwtService) {}

  async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.getUserByUsername(username);

    if (user && user.validatePassword(password)) {
      const partialUser = omit(user)('password');

      return partialUser;
    }

    return null;
  }

  async authenticated(user: Partial<User>) {
    const payload = {
      username: user.username,
      sub: user.id,
    };

    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
