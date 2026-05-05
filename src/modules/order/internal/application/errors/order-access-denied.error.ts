import { UnauthorizedError } from '../../../../../shared/application/errors/unauthorized.error';

export class OrderAccessDeniedError extends UnauthorizedError {
  constructor() {
    super('You do not have access to this order');
  }
}
