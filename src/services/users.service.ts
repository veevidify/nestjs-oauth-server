import { User } from './../entities/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class UserService {
  constructor(@InjectRepository(User) private userRepository: Repository<User>) {}

  public adminGetUsers(): Promise<User[]> {
    return this.userRepository.find();
  }

  public adminGetIndividualUser(userId: string): Promise<User> {
    return this.userRepository.findOneOrFail(userId);
  }

  public async remove(userId: string): Promise<void> {
    await this.userRepository.delete(userId);
  }
}
