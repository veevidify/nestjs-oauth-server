import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtStrategy } from './strategies/jwt.strategy';
import { LocalStrategy } from './strategies/local.strategy';
import { UsersModule } from 'src/users/users.module';
import { jwtConstants } from 'src/config/constants';
import { LocalSerialiser } from './serialisers/local.serialiser';

@Module({
  imports: [
    UsersModule,
    PassportModule.register({ session: true, defaultStrategy: 'local' }),
    JwtModule.register({
      secret: jwtConstants.SECRET,
      signOptions: { expiresIn: '7d' },
    }),
  ],
  providers: [
    AuthService,
    LocalStrategy,
    JwtStrategy,
    LocalSerialiser,
  ],
  exports: [AuthService],
  controllers: [AuthController],
})
export class AuthModule { }
