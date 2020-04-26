import { JwtAuthenticatable } from 'src/auth/interface';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Unique,
} from 'typeorm';
import * as bc from 'bcryptjs';
import { Exclude } from 'class-transformer';

@Entity()
@Unique(['id', 'username'])
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column()
  username: string;

  @Column()
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ type: 'text', array: true, default: '{ user }' })
  roles: string[];

  @Column()
  @CreateDateColumn()
  createdAt: Date;

  @Column()
  @UpdateDateColumn()
  updatedAt: Date;

  public validatePassword = (password: string) => {
    return bc.compareSync(password, this.password);
  };

  public static verifyRoles(userFromJwt: JwtAuthenticatable, roles: string[]) {
    return roles.some(role => userFromJwt.roles.includes(role));
  }
}
