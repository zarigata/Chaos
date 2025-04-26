import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToMany,
  OneToMany,
  JoinTable,
} from 'typeorm';
import { Role } from './Role';
import { Guild } from './Guild';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  username!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  password!: string;
  // Security question for account recovery
  @Column({ default: '' })
  securityQuestion!: string;
  // Hashed answer to security question
  @Column({ default: '' })
  securityAnswer!: string;

  @ManyToMany(() => Role, (role: Role) => role.users)
  @JoinTable()
  roles!: Role[];

  @ManyToMany(() => Guild, (guild: Guild) => guild.users)
  @JoinTable()
  guilds!: Guild[];

  @OneToMany(() => Guild, (guild: Guild) => guild.owner)
  ownedGuilds!: Guild[];
}
