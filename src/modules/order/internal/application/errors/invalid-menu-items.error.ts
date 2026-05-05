import { BadRequestError } from '../../../../../shared/application/errors/bad-request.error';

export class InvalidMenuItemsError extends BadRequestError {
  constructor(message: string) {
    super(message);
  }
}
