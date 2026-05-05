import { IQuery } from '../../../../../../shared/application/query.interface';

export class GetRestaurantByIdQuery implements IQuery {
  constructor(public readonly id: string) {}
}
