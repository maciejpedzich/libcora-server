import { Request, Response, NextFunction } from 'express';

export default function generateFileUrl(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const url = `${req.protocol}://${req.headers.host}/${req.file?.filename}`;

  return res.status(200).json({ url });
}
