import BaseHttpError from './base-http';

export default class InvalidBodyError extends BaseHttpError {
  constructor(message: string) {
    super(422, message);
  }
}
