import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthService } from './oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { OAuthModel } from './oauth.model';
import { AuthorizationCodeProvider } from './oauth.provider';
import { oauth } from 'src/config/constants';
import { AuthModule } from '../auth.module';
import { ClientBasicStrategy } from '../strategies/basic.strategy';
import { ClientPasswordStrategy } from '../strategies/client_password.strategy';
import { BearerStrategy } from '../strategies/bearer.strategy';
import { OAuthController } from './oauth.controller';
import { ExpressOAuth } from './providers/oauth2.express';

const modelFactory = {
  provide: oauth.MODEL_INJECT_TOKEN,
  useFactory: (oauthService: OAuthService) => {
    const model = new OAuthModel(oauthService);
    return model;
  },
  inject: [OAuthService],
};

@Module({
  imports: [TypeOrmModule.forFeature([AccessToken, AuthorizationCode, Client, User]), AuthModule],
  providers: [
    OAuthService,
    UsersService,
    ClientBasicStrategy,
    ClientPasswordStrategy,
    BearerStrategy,
    modelFactory,
    ExpressOAuth,
    AuthorizationCodeProvider,
  ],
  exports: [TypeOrmModule, OAuthService],
  controllers: [OAuthController],
})
export class OAuthModule {}
