import { Module, NestModule, MiddlewareConsumer } from '@nestjs/common';
import { AppController } from '../controllers/app.controller';
import { AppService } from '../services/app.service';
import { UserController } from 'src/controllers/users.controller';
import { UserService } from '../services/users.service';
import { LoggerMiddleware } from 'src/middlewares/logger.middleware';

@Module({
  imports: [],
  controllers: [AppController, UserController],
  providers: [AppService, UserService],
})
export class AppModule implements NestModule {
  public configure(consumer: MiddlewareConsumer) {
    ['/', '/users'].map(routeBaseUrl =>
      consumer.apply(LoggerMiddleware).forRoutes(routeBaseUrl),
    );
  }
}
