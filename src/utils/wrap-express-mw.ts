import { Response, NextFunction } from 'express';
import { Socket } from 'socket.io';

import ExpressMiddleware from '@/types/express-middleware';
import RequestWithUser from '@/types/request-with-user';
import SocketIoNextFunction from '@/types/socket-io-next';

const wrapExpressMiddleware =
  (middleware: ExpressMiddleware) =>
  (socket: Socket, next: SocketIoNextFunction) =>
    middleware(
      socket.request as RequestWithUser,
      {} as Response,
      next as NextFunction
    );

export default wrapExpressMiddleware;
