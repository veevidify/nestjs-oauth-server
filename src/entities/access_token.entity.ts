import { Entity, Unique, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './client.entity';

@Entity()
@Unique(['id'])
export class AccessToken {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  token: string;

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
}
