import { NestFactory, HttpAdapterHost } from '@nestjs/core';
import { AppModule } from './modules/app.module';
import { GeneralExceptionHandler } from './exceptions/all.handler';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const { adapter } = app.get(HttpAdapterHost);
  app.useGlobalFilters(new GeneralExceptionHandler(adapter));
  await app.listen(3000);
}
bootstrap();
