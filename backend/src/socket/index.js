// backend/src/socket/index.js

import { Server } from 'socket.io';
import { createAdapter } from '@socket.io/redis-adapter';
import { redisPub, redisSub } from '../config/redis.js';
import authMiddleware from './authMiddleware.js';
import { handleNotificationEvents } from '../modules/notifications/socketHandlers.js'; // placeholder for other module handlers

export default function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.FRONTEND_URL || '*',
      methods: ['GET', 'POST'],
      credentials: true,
    },
    maxHttpBufferSize: 1e6,
  });

  // Attach Redis adapter for horizontal scaling
  io.adapter(createAdapter(redisPub, redisSub));

  // Apply authentication middleware for Socket.IO connections
  io.use(authMiddleware);

  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}, user: ${socket.data.userId}`);

    // Join personal notification room if authenticated
    if (socket.data.userId) {
      socket.join(`user:${socket.data.userId}`);
    }

    // Register module‑specific event handlers
    handleNotificationEvents(io, socket);
    // TODO: add chat, live‑class, analytics handlers here

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
    });
  });
}
