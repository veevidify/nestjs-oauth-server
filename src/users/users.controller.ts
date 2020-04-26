import { Get, Controller, HttpCode, Param, Post, Body } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import * as bc from 'bcryptjs';
import { User } from 'src/entities/user.entity';
import { RolesAuthorised } from 'src/auth/guards/decorators';

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
  @RolesAuthorised(['admin'])
  @HttpCode(201)
  public adminCreateUser(
    @Body() body: { username: string; password: string; firstName: string; lastName: string },
  ) {
    const userDetails: Partial<User> = {
      ...body,
      password: bc.hashSync(body.password),
    };

    return this.userService.add(userDetails);
  }
}
