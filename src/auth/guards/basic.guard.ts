import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { oauth } from 'src/config/constants';

@Injectable()
export class BasicAuthGuard extends AuthGuard(oauth.STRATEGY_BASIC) {}
