import { IQuery } from '../../../../../../shared/application/query.interface';

export class GetOrderStatusQuery implements IQuery {
  constructor(
    public readonly orderId: string,
    public readonly userId: string,
  ) {}
}
