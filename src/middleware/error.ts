import { Request, Response, NextFunction } from 'express';
import { QueryFailedError } from 'typeorm/error/QueryFailedError';
import BaseHttpError from '../errors/base-http';

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (process.env.NODE_ENV === 'development') {
    console.error(error);
  }

  let status = 500;
  let message = 'Unexpected error occurred';

  if (error instanceof BaseHttpError) {
    status = error.status;
    message = error.message;
  } else if (
    error instanceof QueryFailedError &&
    error.message.includes('duplicate key value')
  ) {
    status = 409;
    message = 'This email address has already been registered';
  }

  return res.status(status).json({ error: message });
}
