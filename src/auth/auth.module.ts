import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from 'src/config/constants';
import { ClientBasicStrategy } from './strategies/basic.strategy';
import { ClientPasswordStrategy } from './strategies/client_password.strategy';
import { OAuthModule } from './oauth/oauth.module';

@Module({
  imports: [
    UsersModule,
    PassportModule,
    OAuthModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [AuthService, LocalStrategy, JwtStrategy, ClientBasicStrategy, ClientPasswordStrategy],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
