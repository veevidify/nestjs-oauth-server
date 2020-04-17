import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from 'src/app/app.controller';
import { UsersController } from 'src/users/users.controller';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

import { UsersService } from 'src/users/users.service';
import { AuthService } from 'src/auth/auth.service';
import { AuthModule } from 'src/auth/auth.module';
import { UsersModule } from 'src/users/users.module';
import { User } from 'src/entities/user.entity';

import { AppService } from './app.service';
import * as ormconfig from '../../ormconfig';

// declare deps: orm configs, other modules
// declare controllers
// declare service providers as dependency for controllers
@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    TypeOrmModule.forFeature([User]),
    AuthModule,
    UsersModule,
  ],
  providers: [AppService, UsersService, AuthService],
  controllers: [AppController, UsersController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    ['/', '/users'].map(routeBaseUrl => consumer.apply(LoggerMiddleware).forRoutes(routeBaseUrl));
  }
}
