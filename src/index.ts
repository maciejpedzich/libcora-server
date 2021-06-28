import { createServer } from 'http';
import { Server, Socket } from 'socket.io';

import app from './app';
import wrapExpressMiddleware from './utils/wrap-express-mw';
import authMiddleware from './middleware/auth';
import RequestWithUser from './types/request-with-user';
import User from './models/user';

const httpServer = createServer(app);
const io = new Server(httpServer);
const uidToSidMap: { [uid: string]: string } = {};

io.use(wrapExpressMiddleware(authMiddleware));

io.on('connection', (socket: Socket) => {
  const { user } = socket.request as RequestWithUser;
  const currentUser = user as User;
  uidToSidMap[currentUser.id] = socket.id;

  console.log(uidToSidMap);

  socket.on('disconnect', () => {
    delete uidToSidMap[currentUser.id];
    console.log(uidToSidMap);
  });

  socket.on('send-message', ({ content, recipientId }) =>
    io.to(uidToSidMap[recipientId]).emit('incoming-message', content)
  );
});

httpServer.listen(process.env.PORT);
