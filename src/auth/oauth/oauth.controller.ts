import { Controller, Request, UseGuards, Post, Get, Req, Render, UseFilters } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth/guards/basic.guard';
import { Client } from 'src/entities/client.entity';
import { ClientPasswordAuthGuard } from 'src/auth/guards/client_password.guard';
import { OAuthService } from './oauth.service';
import { AuthService } from '../auth.service';
import { LocalAuthGuard } from '../guards/local.guard';
import { RedirectUnauthorisedFilter } from 'src/exceptions/unathorised.handler';
import { AuthenticatedGuard } from '../guards/authenticated.guard';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly authService: AuthService
  ) { }

  // @UseGuards(BasicAuthGuard)
  // @UseGuards(ClientPasswordAuthGuard)
  // @Post('client')
  // getProfileClient(@Request() req): Partial<Client> {
  //   return req.user;
  // }

  @UseFilters(RedirectUnauthorisedFilter)
  @UseGuards(AuthenticatedGuard)
  @Get('authorize')
  @Render('authorize')
  authorization(@Req() req) {
    // authorize logic
    const user = req.user;
    console.log({ user });
    return { user };
  }

  @UseGuards(AuthenticatedGuard)
  @Post('authorize')
  decision() {
    // decision logic
    return;
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(ClientPasswordAuthGuard)
  @Post('token')
  token() {
    // token exchange logic
    return;
  }
}
