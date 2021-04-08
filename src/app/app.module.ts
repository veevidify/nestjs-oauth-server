import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from 'src/app/app.controller';
import { AuthController } from 'src/auth/auth.controller';
import { UsersController } from 'src/users/users.controller';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';
import { UsersService } from 'src/users/users.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';

import { AppService } from './app.service';
import * as ormconfig from '../../ormconfig';
import { OAuthModule } from 'src/auth/oauth/oauth.module';
import { OAuthService } from 'src/auth/oauth/oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { Client } from 'src/entities/client.entity';
import { OAuthController } from 'src/auth/oauth/oauth.controller';

// declare deps: orm configs, other modules
// declare controllers
// declare service providers as dependency for controllers
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([
      User,
      AccessToken,
      AuthorizationCode,
      Client,
    ]),
    OAuthModule,
    AuthModule,
    UsersModule,
  ],
  providers: [AppService, UsersService, OAuthService],
  controllers: [AppController, UsersController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    ['/', '/users'].map(routeBaseUrl => consumer.apply(LoggerMiddleware).forRoutes(routeBaseUrl));
  }
}
