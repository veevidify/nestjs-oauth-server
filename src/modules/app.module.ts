import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from 'src/controllers/app.controller';
import { UserController } from 'src/controllers/users.controller';
import { AppService } from 'src/services/app.service';
import { UserService } from 'src/services/users.service';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

import { User } from './../entities/user.entity';
import * as ormconfig from '../../ormconfig';

// declare deps: orm configs, other modules
// declare controllers
// declare service providers as dependency for controllers
@Module({
  imports: [TypeOrmModule.forRoot(ormconfig), TypeOrmModule.forFeature([User])],
  providers: [AppService, UserService],
  controllers: [AppController, UserController],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    ['/', '/users'].map(routeBaseUrl => consumer.apply(LoggerMiddleware).forRoutes(routeBaseUrl));
  }
}
