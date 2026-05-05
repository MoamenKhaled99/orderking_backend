import { NotFoundError } from '../../../../../shared/application/errors/not-found.error';

export class OrderNotFoundError extends NotFoundError {
  constructor() {
    super('Order not found');
  }
}
