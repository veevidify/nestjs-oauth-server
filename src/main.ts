import { ValidationPipe } from 'src/utils/validation.pipe';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { GeneralExceptionHandler } from './exceptions/all.handler';
import { AppModule } from './app/app.module';
import { NestExpressApplication } from '@nestjs/platform-express';
import { resolve } from 'path';
import * as HBS from 'hbs';
import * as Passport from 'passport';
import * as Session from 'express-session';
import * as BodyParser from 'body-parser';
import { web } from './config/constants';

// entrypoint
// start web services
// register services like websockets here
async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  const { adapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GeneralExceptionHandler(adapter));

  // app.useStaticAssets(join(__dirname, '..', 'public'));
  app.useStaticAssets(resolve('./src/public'));
  app.setBaseViewsDir(resolve('./src/views'));
  app.setViewEngine('hbs');

  HBS.registerPartials(resolve('./src/views/partials'));

  app.use(
    Session({
      secret: web.SESSION_SECRET,
      saveUninitialized: false,
      resave: false,
    }),
  );
  app.use(Passport.initialize());
  app.use(Passport.session());
  app.use(BodyParser.urlencoded({ extended: true }));

  await app.listen(3000);
}
bootstrap();
