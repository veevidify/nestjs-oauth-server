import * as bc from 'bcryptjs';
import {
  Get,
  Controller,
  HttpCode,
  Param,
  Post,
  Body,
  UsePipes,
  UseGuards,
  Request,
} from '@nestjs/common';

import { UsersService } from 'src/users/users.service';
import { ValidationPipe } from 'src/utils/validation.pipe';
import { User } from 'src/entities/user.entity';
import { RolesAuthorised } from 'src/auth/guards/decorators';

import { CreateUserDto } from './interfaces';
import { BearerAuthGuard } from 'src/auth/guards/bearer.guard';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @RolesAuthorised(['admin', 'user'])
  @HttpCode(200)
  public allUsersForAdmin() {
    return this.userService.allUsers();
  }

  @Get('/:id')
  @HttpCode(200)
  public singleUserForAdmin(@Param() params) {
    const { id } = params;
    return this.userService.getUser(id);
  }

  @Post('/')
  @UsePipes(new ValidationPipe())
  @RolesAuthorised(['admin'])
  @HttpCode(201)
  public adminCreateUser(@Body() body: CreateUserDto) {
    const userDetails: Partial<User> = {
      ...body,
      password: bc.hashSync(body.password),
    };

    return this.userService.add(userDetails);
  }
}
