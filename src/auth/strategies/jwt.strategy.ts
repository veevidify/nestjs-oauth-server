import { User } from 'src/entities/user.entity';
import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from 'src/config/constants';
import { JwtAuthenticatable } from 'src/auth/interfaces';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.SECRET,
    };
    super(jwtOptions);
  }

  async validate(payload: JwtAuthenticatable): Promise<Partial<User>> {
    return {
      id: payload.sub,
      roles: payload.roles,
      username: payload.username,
    };
  }
}
