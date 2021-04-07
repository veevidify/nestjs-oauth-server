import { LocalAuthGuard } from './guards/local.guard';
import {
  Controller,
  Post,
  Get,
  Render,
  Query,
  Req,
  Res,
  UseGuards,
  UseFilters,
} from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';
import { RedirectUnauthorisedFilter } from 'src/exceptions/unathorised.handler';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // route will receive 401 on unauthenticated creds -- validated by local guard
  // on authenticated, sign & issue jwt

  @Get('login')
  @Render('login-form')
  loginForm(@Query() query): object {
    const { error, client_id: clientId, redirect_uri: redirectUri } = query;

    return {
      username: 'veevidify',
      password: '123456',
      clientId,
      redirectUri,
      error: error !== undefined,
    };
  }

  @UseGuards(LocalAuthGuard)
  @UseFilters(RedirectUnauthorisedFilter)
  @Post('login')
  async login(@Req() req: Request, @Res() res) {
    const { redirect, client_id: clientId, redirect_uri: redirectUri } = req.query;

    let redirectTo: string;
    switch (redirect) {
      case '/oauth/authorize':
        redirectTo = `/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}`;
        break;
      case '/':
      default:
        redirectTo = '/';
        break;
    }
    console.log({ redirect, redirectTo });

    return res.redirect(redirectTo);
  }

  @Get('logout')
  logout(@Req() req: Request, @Res() res: Response) {
    req.logout();
    res.redirect('/');
  }

  @Get('account')
  account() {
    return `a sample protected 'my account' page`;
  }
}
