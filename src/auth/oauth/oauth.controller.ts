import { Controller, Get, Request, UseGuards, Post } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth/guards/basic.guard';
import { Client } from 'src/entities/client.entity';
import { ClientPasswordAuthGuard } from 'src/auth/guards/client_password.guard';
import { OAuthService } from './oauth.service';
import { AuthService } from '../auth.service';


@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly authService: AuthService
  ) {}

  @UseGuards(BasicAuthGuard)
  @UseGuards(ClientPasswordAuthGuard)
  @Post('client')
  getProfileClient(@Request() req): Partial<Client> {
    return req.user;
  }
}
