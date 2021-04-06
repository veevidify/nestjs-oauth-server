import { Module, MiddlewareConsumer, RequestMethod, UnauthorizedException } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthService } from './oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { Client } from 'src/entities/client.entity';
import { User } from 'src/entities/user.entity';
import { RefreshToken } from 'src/entities/refresh_token.entity';
import { UsersService } from 'src/users/users.service';
import { ValidateFunction, ImmediateFunction } from 'oauth2orize';

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

  private validate: ValidateFunction = async (clientId, redirectUri, done) => {
    try {
      const client = await this.oauthService.getClientByClientId(clientId);
      if (client === null || !client.redirectUris.includes(redirectUri)) {
        return done(new UnauthorizedException('Invalid Client'));
      }
      return done(null, client, redirectUri);
    } catch (err) {
      return done(err);
    }
  };

  private immediate: ImmediateFunction = (client: Client, user: User, _scope, _type, _areq, done) => {
    if (client.isTrusted) return done(null, true, null, null);

    const accessToken = this.oauthService.findAccessTokenByUserAndClient(user, client);
    if (accessToken !== null) return done(null, true, null, null);

    return done(null, false, null, null);
  };

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(this.oauthService.provider.authorization(this.validate, this.immediate))
      .forRoutes({
        path: 'oauth/authorize', method: RequestMethod.GET
      });

    consumer
      .apply(this.oauthService.provider.decision())
      .forRoutes({
        path: 'oauth/authorize/decision',
        method: RequestMethod.POST
      });

    consumer
      .apply(
        this.oauthService.provider.token(),
        this.oauthService.provider.errorHandler(),
      )
      .forRoutes({
        path: 'oauth/token',
        method: RequestMethod.POST
      });
  }
}
