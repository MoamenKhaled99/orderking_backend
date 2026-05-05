import { BadRequestError } from '../../../../../shared/application/errors/bad-request.error';

export class MenuItemsWrongRestaurantError extends BadRequestError {
  constructor() {
    super('One or more menu items do not belong to the specified restaurant');
  }
}
