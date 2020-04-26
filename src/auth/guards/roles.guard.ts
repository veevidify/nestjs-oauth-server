import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Observable } from 'rxjs';
import { Reflector } from '@nestjs/core';
import { JwtAuthenticatable } from 'src/auth/interface';
import { User } from 'src/entities/user.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}
  canActivate(ctx: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const allowedRoles: string[] = this.reflector.get('roles', ctx.getHandler());
    if (!allowedRoles) return true;

    const req = ctx.switchToHttp().getRequest();

    const user: JwtAuthenticatable = req.user;

    return User.verifyRoles(user, allowedRoles);
  }
}
