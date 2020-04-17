import { Get, Controller, HttpCode, Param } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  @HttpCode(200)
  public allUsersForAdmin() {
    return this.userService.adminGetUsers();
  }

  @Get('/:id')
  @HttpCode(200)
  public singleUserForAdmin(@Param() params) {
    const { id } = params;
    return this.userService.adminGetIndividualUser(id);
  }
}
