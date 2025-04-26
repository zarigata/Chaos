import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, ManyToMany, JoinTable } from 'typeorm';
import { User } from './User';

@Entity()
export class Guild {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column({ unique: true })
  name!: string;

  @ManyToOne(() => User, (user) => user.ownedGuilds)
  owner!: User;

  @ManyToMany(() => User, (user) => user.guilds)
  @JoinTable()
  users!: User[];
}
