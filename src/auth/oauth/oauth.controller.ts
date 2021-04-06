import { Controller, Request, UseGuards, Post, Get, Req, Render } from '@nestjs/common';
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
  ) { }

  @UseGuards(BasicAuthGuard)
  @UseGuards(ClientPasswordAuthGuard)
  @Post('client')
  getProfileClient(@Request() req): Partial<Client> {
    return req.user;
  }

  @Get('authorize')
  @Render('authorize')
  authorization(@Req() req) {
    // extra authorize logic
    return {
      transactionId: req.oauth2.transactionID,
      user: req.user,
      client: req.oauth2.client,
    };
  }

  @Post('authorize/decision')
  decision() {
    // extra decision logic
    return;
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(ClientPasswordAuthGuard)
  @Post('token')
  token() {
    // extra token exchange logic
    return;
  }
}
