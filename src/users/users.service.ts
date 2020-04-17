import { User } from './../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

// services use external connectors (including db repository)
// to fetch resource and parse them as typed entities
@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  public adminGetUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  public adminGetIndividualUser(userId: string): Promise<User> {
    return this.userRepository.findOneOrFail(userId);
  }

  public getUserByUsername(username: string): Promise<User> {
    return this.userRepository.findOne({ where: { username } });
  }

  public async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
