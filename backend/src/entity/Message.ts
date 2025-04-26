import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';
import { Guild } from './Guild';

@Entity()
export class Message {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @Column()
  content!: string;

  @ManyToOne(() => User, (user) => user, { eager: true })
  author!: User;

  @ManyToOne(() => Guild, (guild) => guild, { eager: true })
  guild!: Guild;

  @CreateDateColumn()
  createdAt!: Date;
}
