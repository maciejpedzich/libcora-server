import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import app from './app';
import wrapExpressMiddleware from './utils/wrap-express-mw';
import authMiddleware from './middleware/auth';
import RequestWithUser from './types/request-with-user';
import User from './models/user';
import Message from './models/message';

const ALLOWED_ORIGINS = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
];

const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: ALLOWED_ORIGINS,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    exposedHeaders: ['Authorization']
  }
});
const uidToSidMap: { [uid: string]: string | undefined } = {};

io.on('connection', (socket: Socket) => {
  socket.on('map-uid', (uid: string) => {
    if (uid) {
      uidToSidMap[uid] = socket.id;
    }
  });

  socket.on('remove-uid', (uid: string) => {
    delete uidToSidMap[uid];
  });

  socket.on('send-message', (message: Message) => {
    const sid = uidToSidMap[message.recipientId];

    if (sid) {
      io.to(sid).emit('incoming-message', message);
    }
  });
});

httpServer.listen(process.env.PORT);
