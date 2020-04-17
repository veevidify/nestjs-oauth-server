import { Strategy } from 'passport-local';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { User } from 'src/entities/user.entity';

// rely on services to provide necessary output
// effectful functions / throw exceptions
@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super();
  }

  async validate(username: string, password: string): Promise<Partial<User>> | never {
    const user = await this.authService.validateUser(username, password);

    if (!user) throw new UnauthorizedException('Wrong username or password.');
    return user;
  }
}
