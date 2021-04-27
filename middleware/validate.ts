import { Request, Response, NextFunction } from 'express';
import { plainToClass } from 'class-transformer';
import {
  validateOrReject,
  ValidationError,
  ValidatorOptions
} from 'class-validator';
import InvalidBodyError from '../errors/invalid-body';

export default function validate(
  dto: any,
  classValidatorOpts?: ValidatorOptions
) {
  return async function (req: Request, res: Response, next: NextFunction) {
    try {
      await validateOrReject(plainToClass(dto, req.body), classValidatorOpts);

      return next();
    } catch (errors) {
      const message = (errors as ValidationError[])
        .map((err) =>
          Object.values(err.constraints as { [key: string]: string })
        )
        .join('; ');

      return next(new InvalidBodyError(message));
    }
  };
}
