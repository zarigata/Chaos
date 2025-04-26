import express, { Request, Response } from 'express';
import cors from 'cors';
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
import { Guild } from './entity/Guild';
import { Message } from './entity/Message';
import path from 'path';

// Load env
dotenv.config();

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(cors({ origin: '*' }));
  app.use(express.json());

  // Auth routes
  app.use('/auth', authRouter);
  app.use('/roles', rolesRouter);
  app.use('/guilds', guildsRouter);

  // Global error handler
  app.use(errorHandler);

  const server = http.createServer(app);

  // Serve frontend static build
  const frontendPath = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));
  app.get('*', (_req: Request, res: Response) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });

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

    // Real-time messaging within guilds
    socket.on('guild:sendMessage', async ({ guildId, content }: { guildId: string; content: string }) => {
      try {
        const messageRepo = AppDataSource.getRepository(Message);
        const guild = await AppDataSource.getRepository(Guild).findOne({ where: { id: guildId } });
        if (!guild) return socket.emit('error', { message: 'Guild not found' });
        const msg = messageRepo.create({ content, author: user, guild });
        await messageRepo.save(msg);
        io.to(guildId).emit('guild:message', msg);
      } catch (err) {
        console.error(err);
        socket.emit('error', { message: 'Send failed' });
      }
    });

    socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch((error) => console.error('Data Source initialization error', error));
