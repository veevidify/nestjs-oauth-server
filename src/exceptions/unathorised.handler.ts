import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  ForbiddenException,
} from '@nestjs/common';
import { Request, Response } from 'express';
import { UnauthorizedException } from '@nestjs/common';

@Catch(UnauthorizedException, ForbiddenException)
export class RedirectUnauthorisedFilter implements ExceptionFilter {
  catch(exception: HttpException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const request = ctx.getRequest<Request>();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    const redirectPostLogin = request.path === '/oauth/authorize' ? '?redirect=/oauth/authorize' : '?redirect=/';

    return response.status(status).redirect('/auth/login' + redirectPostLogin);
  }
}
