import { LocalAuthGuard } from './guards/local.guard';
import { Controller, Post, Get, Render, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  // route will receive 401 on unauthenticated creds -- validated by local guard
  // on authenticated, sign & issue jwt
  // @UseGuards(LocalAuthGuard)
  // @Post('/login')
  // async login(@Request() req) {
  //   return this.authService.authenticated(req.user);
  // }

  @Get('login')
  @Render('login-form')
  loginForm(@Query() query): object {
    const { error } = query;
    return {
      username: 'veevidify',
      password: '123456',
      error: error !== undefined,
    };
  }

  @UseGuards(LocalAuthGuard)
  @Post('login')
  login() {
    return;
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
