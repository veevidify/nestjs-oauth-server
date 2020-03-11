import { Get, Controller, HttpCode } from '@nestjs/common';
import { UserService } from 'src/services/users.service';

@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {
  }

  @Get()
  @HttpCode(200)
  public allUsersForAdmin() {
    return this.userService.adminGetUsers();
  }
}
