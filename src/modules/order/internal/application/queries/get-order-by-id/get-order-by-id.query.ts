import { IQuery } from '../../../../../../shared/application/query.interface';

export class GetOrderByIdQuery implements IQuery {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
  ) {}
}
