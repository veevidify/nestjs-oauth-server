import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthService } from './oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { UsersService } from 'src/users/users.service';
import { AuthorizationCodeModel } from './models/authorization_code.model';
import { AuthorizationCodeProvider } from './providers/authorization_code.provider';
import { oauth } from 'src/config/constants';

const modelFactory = {
  provide: oauth.MODEL_INJECT_TOKEN,
  useFactory: (oauthService: OAuthService) => {
    return new AuthorizationCodeModel(oauthService);
  },
  inject: [OAuthService]
};

@Module({
  imports: [TypeOrmModule.forFeature([
    AccessToken,
    AuthorizationCode,
    Client,
    User,
  ])],
  providers: [OAuthService, UsersService, modelFactory, AuthorizationCodeProvider],
  exports: [TypeOrmModule, OAuthService],
  controllers: [],
})
export class OAuthModule {
  constructor(private oauthService: OAuthService) { }
}
