import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';
import rolesRouter from './routes/roles';
import guildsRouter from './routes/guilds';
import { errorHandler } from './middleware/errorHandler';
import { socketAuth } from './middleware/socketAuth';
import { User } from './entity/User';

// Load env
dotenv.config();

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());

  // Auth routes
  app.use('/auth', authRouter);
  app.use('/roles', rolesRouter);
  app.use('/guilds', guildsRouter);

  // Global error handler
  app.use(errorHandler);

  const server = http.createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: '*' } });
  io.use(socketAuth);

  // Basic health check
  app.get('/', (_req: Request, res: Response) => res.send('C.H.A.O.S Backend is alive'));

  // Socket.IO
  io.on('connection', (socket: Socket) => {
    const user = socket.data.user as User;
    console.log(`User ${user.username} connected: ${socket.id}`);
    // Auto-join user to their guild rooms
    user.guilds.forEach((g) => socket.join(g.id));
    socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch((error) => console.error('Data Source initialization error', error));
