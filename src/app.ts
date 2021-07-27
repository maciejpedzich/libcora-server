import express from 'express';
import 'reflect-metadata';
import { createConnection } from 'typeorm';
import { config as loadENV } from 'dotenv';

import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routers/auth';
import usersRouter from './routers/users';
import messagesRouter from './routers/messages';
import errorMiddleware from './middleware/error';
import fileUpload from './middleware/file-upload';
import generateFileUrl from './middleware/generate-file-url';

loadENV();

const app = express();
const ALLOWED_ORIGINS = [
  'capacitor://localhost',
  'ionic://localhost',
  'http://localhost',
  'http://localhost:8080',
  'http://localhost:8100'
];
const isDevelopmentEnv = process.env.NODE_ENV === 'development';

(async () => {
  try {
    await createConnection({
      type: 'postgres',
      url: process.env.DB_URL as string,
      entities: ['./src/models/*.ts'],
      logging: isDevelopmentEnv,
      synchronize: isDevelopmentEnv
    });

    app.use(
      cors({
        origin: ALLOWED_ORIGINS,
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        exposedHeaders: ['Authorization']
      })
    );
    app.use(express.static('./public'));
    app.use(express.json());
    app.use(cookieParser());

    app.post('/upload-image', fileUpload.single('image'), generateFileUrl);
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/messages', messagesRouter);
    app.use(errorMiddleware);
  } catch (error) {
    console.error(error);
  }
})();

export default app;
