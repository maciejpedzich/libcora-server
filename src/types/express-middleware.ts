import { Response, NextFunction } from 'express';
import RequestWithUser from './request-with-user';

export default interface ExpressMiddleware {
  (req: RequestWithUser, res: Response, next: NextFunction): Promise<void>;
}
