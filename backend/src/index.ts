import express, { Request, Response } from 'express';
import http from 'http';
import { Server as SocketIOServer, Socket } from 'socket.io';
import dotenv from 'dotenv';

// Load env
dotenv.config();

const app = express();
const server = http.createServer(app);
const io = new SocketIOServer(server, { cors: { origin: '*' } });

// Basic routes
app.get('/', (_req: Request, res: Response) => res.send('Discord Clone Backend')); 

// Socket.IO
io.on('connection', (socket: Socket) => {
  console.log(`User connected: ${socket.id}`);
  socket.on('disconnect', () => console.log(`User disconnected: ${socket.id}`));
});

// Start server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
