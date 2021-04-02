import { Injectable } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

import { oauth } from 'src/config/constants';

@Injectable()
export class ClientPasswordAuthGuard extends AuthGuard(oauth.STRATEGY_CLIENT_PASSWORD) {}
