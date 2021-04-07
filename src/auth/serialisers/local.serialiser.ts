import { Injectable } from "@nestjs/common";
import { PassportSerializer } from "@nestjs/passport";
import { AuthService } from "../auth.service";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { User } from "src/entities/user.entity";

@Injectable()
export class LocalSerialiser extends PassportSerializer {
  constructor(
    private readonly authService: AuthService,
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {
    super();
  }

  serializeUser(user: User, done: CallableFunction) {
    console.log('=> Serialise user ', { user });
    return done(null, user.id);
  }

  async deserializeUser(userId: string, done: CallableFunction) {
    try {
      const user = await this.userRepository.findOneOrFail({ id: userId });
      console.log('=> Deserialise user ', { user });
      return done(null, user);
    } catch (err) {
      return done(err, null);
    }
  }
}
