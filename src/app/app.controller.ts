import { JwtAuthGuard } from './../auth/guards/jwt.auth_guard';
import { User } from 'src/entities/user.entity';
import { Controller, Get, Request, UseGuards } from '@nestjs/common';
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

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Request() req): Partial<User> {
    return req.user;
  }
}
