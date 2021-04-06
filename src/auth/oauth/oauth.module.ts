import { Module, MiddlewareConsumer, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthService } from './oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/users/users.service';

@Module({
  imports: [TypeOrmModule.forFeature([
    AccessToken,
    RefreshToken,
    AuthorizationCode,
    Client,
    User,
  ])],
  providers: [OAuthService, UsersService],
  exports: [TypeOrmModule, OAuthService],
  controllers: [],
})
export class OAuthModule {
  constructor(private oauthService: OAuthService) { }
}
