import { NotFoundError } from '../../../../../shared/application/errors/not-found.error';

export class RestaurantNotFoundError extends NotFoundError {
  constructor() {
    super('Restaurant not found');
  }
}
