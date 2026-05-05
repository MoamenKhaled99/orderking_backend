import { OrderWithItems } from '../../../domain/repositories/order.repo.interface';

export class GetOrderByIdResponse {
  constructor(public readonly order: OrderWithItems) {}
}
