import {
  Entity,
  Unique,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { Client } from './client.entity';
import { User } from './user.entity';

import * as OAuth2 from 'oauth2-server';

@Entity()
@Unique(['id'])
export class AccessToken implements OAuth2.Token {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  accessToken: string;

  @Column({ default: new Date() })
  accessTokenExpiresAt?: Date;

  // can be empty (depends on grant type)
  @Column({ default: '' })
  refreshToken: string;

  @Column({ default: null })
  refreshTokenExpiresAt?: Date;

  @Column({ type: 'text', array: true, default: '{*}' })
  scope?: string[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, client => client.accessTokens, {
    eager: true,
  })
  client: Client;

  @ManyToOne(() => User, user => user.accessTokens, {
    eager: true,
  })
  user: User;
}
