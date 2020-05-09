import { ValidationPipe } from 'src/utils/validation.pipe';
import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { GeneralExceptionHandler } from './exceptions/all.handler';
import { AppModule } from './app/app.module';

// entrypoint
// start web services
// register services like websockets here
async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { adapter } = app.get(HttpAdapterHost);
  app.useGlobalPipes(new ValidationPipe());
  app.useGlobalFilters(new GeneralExceptionHandler(adapter));
  await app.listen(3000);
}
bootstrap();
