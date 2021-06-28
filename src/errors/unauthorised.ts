import BaseHttpError from './base-http';

export default class UnauthorisedError extends BaseHttpError {
  constructor() {
    super(403, 'You are not allowed to perform this action');
  }
}
