import { OrderWithItems } from '../../../domain/repositories/order.repo.interface';

export class CreateOrderResponse {
  constructor(public readonly order: OrderWithItems) {}
}
