import { User } from './../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { omit } from 'src/utils/functions';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(private userService: UsersService) {}

  async validateUser(username: string, password: string): Promise<Partial<User> | null> {
    const user = await this.userService.getUserByUsername(username);

    if (user && user.validatePassword(password)) {
      const partialUser = omit(user)('password');

      return partialUser;
    }

    return null;
  }
}
