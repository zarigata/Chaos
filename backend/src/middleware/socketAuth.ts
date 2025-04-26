import { Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../data-source';
import { User } from '../entity/User';

export async function socketAuth(socket: Socket, next: (err?: any) => void) {
  const token = socket.handshake.auth.token;
  if (!token) {
    return next(new Error('Unauthorized'));
  }
  try {
    const { id } = jwt.verify(token, process.env.jwt_secret as string) as { id: string };
    const user = await AppDataSource.getRepository(User).findOne({ where: { id }, relations: ['guilds'] });
    if (!user) {
      return next(new Error('Unauthorized'));
    }
    socket.data.user = user;
    next();
  } catch (err) {
    return next(new Error('Unauthorized'));
  }
}
