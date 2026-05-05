import { NotFoundError } from '../../../../../shared/application/errors/not-found.error';

export class MenuItemNotFoundError extends NotFoundError {
  constructor() {
    super('Menu item not found');
  }
}
