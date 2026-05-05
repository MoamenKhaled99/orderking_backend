import { IQuery } from '../../../../../../shared/application/query.interface';

export class GetMenuByRestaurantQuery implements IQuery {
  constructor(public readonly restaurantId: string) {}
}
