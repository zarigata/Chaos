import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entity/User';
import { Role } from './entity/Role';
import { Guild } from './entity/Guild';
import { Message } from './entity/Message';

dotenv.config();
dotenv.config();
const databaseUrl = process.env.DATABASE_URL || process.env.database_url;

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: databaseUrl,
  synchronize: true,
  logging: false,
  entities: [User, Role, Guild, Message],
});
