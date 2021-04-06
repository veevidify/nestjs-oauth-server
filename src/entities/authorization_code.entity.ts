import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, } from 'typeorm';
import { Client } from './client.entity';
import { User } from './user.entity';

@Entity()
@Unique(['id'])
export class AuthorizationCode {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  authorizationCode: string;

  @Column()
  expiresAt: Date;

  @Column()
  redirectUri: string;

  @Column({ type: 'text', array: true, default: '{*}' })
  scope?: string[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne(() => Client, client => client.authorizationCodes, {
    eager: true,
  })
  client: Client;

  @ManyToOne(() => User, user => user.authorizationCodes, {
    eager: true,
  })
  user: User;
}
