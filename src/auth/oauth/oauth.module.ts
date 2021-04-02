import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OAuthService } from './oauth.service';
import { AccessToken } from 'src/entities/access_token.entity';
import { AuthorizationCode } from 'src/entities/authorization_code.entity';
import { Client } from 'src/entities/client.entity';

@Module({
  imports: [TypeOrmModule.forFeature([
    AccessToken,
    AuthorizationCode,
    Client,
  ])],
  providers: [OAuthService],
  exports: [TypeOrmModule, OAuthService],
  controllers: [],
})
export class OAuthModule {}
