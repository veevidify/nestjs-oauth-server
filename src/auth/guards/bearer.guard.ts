import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { oauth } from 'src/config/constants';

@Injectable()
export class BearerAuthGuard extends AuthGuard(oauth.STRATEGY_BEARER) { }
