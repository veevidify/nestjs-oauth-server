import { Entity, Unique, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany, } from 'typeorm';
import { AccessToken } from './access_token.entity';
import { AuthorizationCode } from './authorization_code.entity';

@Entity()
@Unique(['id', 'clientId'])
export class Client {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  clientId: string;

  @Column()
  clientSecret: string;

  @Column()
  isTrusted: boolean;

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AccessToken, accessToken => accessToken.client, {
    cascade: ['remove'],
    eager: false,
  })
  accessTokens: AccessToken[];

  @OneToMany(() => AuthorizationCode, code => code.client, {
    cascade: ['remove'],
    eager: false,
  })
  authorizationCodes: AuthorizationCode[];

  public static validateSecret = (client: Client, testSecret: string) => {
    return (testSecret === client.clientSecret);
  };
}
