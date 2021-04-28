import BaseHttpError from './base-http';

export default class InvalidCredentialsError extends BaseHttpError {
  constructor() {
    super(401, 'Invalid email address and/or password');
  }
}
