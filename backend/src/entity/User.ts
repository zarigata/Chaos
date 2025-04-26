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

  @ManyToMany(() => Role, (role: Role) => role.users)
  @JoinTable()
  roles!: Role[];

  @ManyToMany(() => Guild, (guild: Guild) => guild.users)
  @JoinTable()
  guilds!: Guild[];

  @OneToMany(() => Guild, (guild: Guild) => guild.owner)
  ownedGuilds!: Guild[];
}
