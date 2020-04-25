import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, ExtractJwt } from 'passport-jwt';
import { jwtConstants } from 'src/config/constants';
import { JwtAuthenticatable } from 'src/auth/interface';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    const jwtOptions = {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: jwtConstants.secret,
    };
    super(jwtOptions);
  }

  async validate(payload: JwtAuthenticatable) {
    return {
      userId: payload.sub,
      username: payload.username,
    };
  }
}
