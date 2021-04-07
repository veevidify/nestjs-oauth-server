import { Controller, UseGuards, Post, Get, Req, Render, UseFilters, Res, Next, UnauthorizedException } from '@nestjs/common';
import { BasicAuthGuard } from 'src/auth/guards/basic.guard';
import { ClientPasswordAuthGuard } from 'src/auth/guards/client_password.guard';
import { RedirectUnauthorisedFilter } from 'src/exceptions/unathorised.handler';
import { AuthenticatedGuard } from '../guards/authenticated.guard';
import { AuthorizationCodeProvider } from './providers/authorization_code.provider';
import { OAuthService } from './oauth.service';

@Controller('oauth')
export class OAuthController {
  constructor(
    private readonly oauthService: OAuthService,
    private readonly authorizationCodeProvider: AuthorizationCodeProvider,
  ) { }

  @UseFilters(RedirectUnauthorisedFilter)
  @UseGuards(AuthenticatedGuard)
  @Get('authorize')
  @Render('authorize')
  async authorization(@Req() req) {
    // extra authorize logic
    const user = req.user;

    const {
      client_id: clientId,
      redirect_uri: redirectUri,
    } = req.query;

    const client = await this.oauthService.getClientByClientId(clientId);
    console.log({ user, clientId, client });
    if (! client) throw new UnauthorizedException('Invalid Client');

    return { user, client, redirectUri };
  }

  @UseFilters(RedirectUnauthorisedFilter)
  @UseGuards(AuthenticatedGuard)
  @Post('authorize')
  authorise(@Req() req, @Res() res, @Next() next) {
    // extra user authorising logic
    return this.authorizationCodeProvider.authorizeHandler(res, req, next);
  }

  @UseGuards(BasicAuthGuard)
  @UseGuards(ClientPasswordAuthGuard)
  @Post('token')
  token(@Req() req, @Res() res, @Next() next) {
    // extra token exchange logic
    return this.authorizationCodeProvider.tokenExchange(req, res, next);
  }
}
