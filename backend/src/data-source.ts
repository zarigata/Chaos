import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from './entity/User';
import { Role } from './entity/Role';
import { Guild } from './entity/Guild';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  url: process.env.database_url,
  synchronize: true,
  logging: false,
  entities: [User, Role, Guild],
});
