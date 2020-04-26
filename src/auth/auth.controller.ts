import { LocalAuthGuard } from './guards/local.guard';
import { Controller, UseGuards, Post, Request } from '@nestjs/common';
import { AuthService } from 'src/auth/auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  // route will receive 401 on unauthenticated creds -- validated by local guard
  // on authenticated, sign & issue jwt
  @UseGuards(LocalAuthGuard)
  @Post('/login')
  async login(@Request() req) {
    return this.authService.authenticated(req.user);
  }
}
