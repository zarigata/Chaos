import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import dotenv from 'dotenv';
import { AppDataSource } from './data-source';
import authRouter from './routes/auth';

// Load env
dotenv.config();

AppDataSource.initialize().then(() => {
  const app = express();
  app.use(express.json());

  // Auth routes
  app.use('/auth', authRouter);

  const server = http.createServer(app);
  const io = new SocketIOServer(server, { cors: { origin: '*' } });

  // Basic health check
  app.get('/', (_req: Request, res: Response) => res.send('C.H.A.O.S Backend is alive'));

  // Socket.IO
  io.on('connection', (socket: Socket) => {
    console.log(`User connected: ${socket.id}`);
    socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
  });

  // Start server
  const PORT = process.env.PORT || 3000;
  server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
}).catch((error) => console.error('Data Source initialization error', error));
