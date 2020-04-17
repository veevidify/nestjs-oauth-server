import { Controller, Get } from '@nestjs/common';
import { AppService } from 'src/app/app.service';

// main app module
// use for things like health check, metadata, api doc
@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }
}
