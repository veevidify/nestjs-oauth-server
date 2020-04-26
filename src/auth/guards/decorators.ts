import { RolesGuard } from './roles.guard';
import { SetMetadata, applyDecorators, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from './jwt.guard';

export const ApplyRoles = (roles: string[]) => SetMetadata('roles', roles);

export const RolesAuthorised = (roles: string[]) =>
  applyDecorators(SetMetadata('roles', roles), UseGuards(JwtAuthGuard, RolesGuard));
