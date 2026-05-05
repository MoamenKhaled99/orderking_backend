import { Inject, Injectable } from '@nestjs/common';
import { IQueryHandler } from '../../../../../../shared/application/query.handler.interface';
import { IOrderRepository } from '../../../domain/repositories/order.repo.interface';
import { OrderAccessDeniedError } from '../../errors/order-access-denied.error';
import { OrderNotFoundError } from '../../errors/order-not-found.error';
import { GetOrderStatusQuery } from './get-order-status.query';
import { GetOrderStatusResponse } from './get-order-status.response';

export interface IGetOrderStatusHandler
  extends IQueryHandler<GetOrderStatusQuery, GetOrderStatusResponse> {}
export const IGetOrderStatusHandler = Symbol('IGetOrderStatusHandler');

@Injectable()
export class GetOrderStatusHandler implements IGetOrderStatusHandler {
  constructor(
    @Inject(IOrderRepository)
    private readonly orderRepository: IOrderRepository,
  ) {}

  async handle(query: GetOrderStatusQuery): Promise<GetOrderStatusResponse> {
    const order = await this.orderRepository.findById(query.orderId);

    if (!order) {
      throw new OrderNotFoundError();
    }

    if (order.userId !== query.userId) {
      throw new OrderAccessDeniedError();
    }

    return new GetOrderStatusResponse(order.id, order.status, order.paymentStatus);
  }
}
