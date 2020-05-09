import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/entities/user.entity';
import { classToPlain } from 'class-transformer';

// services use external connectors (including db repository)
// to fetch resource and parse them as typed entities
// all pure function, with mockable repository dependencies
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  public async allUsers(): Promise<Partial<User>[]> {
    const users = await this.userRepository.find();
    return users.map(user => classToPlain(user));
  }

  public async getUser(userId: string): Promise<Partial<User>> {
    const user = await this.userRepository.findOneOrFail(userId);
    return classToPlain(user);
  }

  public async getUserByUsername(username: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { username } });
    return user;
  }

  public async add(user: Partial<User>): Promise<Partial<User>> {
    const newUser = this.userRepository.save(user);
    return classToPlain(newUser);
  }

  public async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
